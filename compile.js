const parseAST = require("./ast");

const compile = ast => {
  return ast
    .map(compileNode)
    .filter(Boolean)
    .join("\n");
};

const delay = fnCall => {
  return global.turbo
    ? fnCall
    : `await new Promise(r => {
    setTimeout(() => { r(${fnCall}) }, 1000)
  })`;
};

const compileNode = node => {
  switch (node.type) {
    case "comment":
      return null;
    case "import":
      return require(`./disruptiveLibs/${node.lib}`);
    case "finalDisruptiveClass":
      return `
      class ${node.name} { ${compile(node.body)} }
      new ${node.name}().main()`;
    case "mainMethod":
      return `async main () {
        ${compile(node.body)}
      }`;
    case "var":
      return `var ${node.name} = ${compileNode(node.value)}`;
    case "while":
      return `while (${compileNode(node.test)}) {
        ${compile(node.body)}
      }`;
    case "if":
      return `if (${compileNode(node.test)}) {
        ${compile(node.then)}
      } else {
        ${compile(node.else)}
      }`;
    case "binary":
      return `${compileNode(node.left)} ${node.operator} ${compileNode(
        node.right
      )}`;
    case "call":
      return delay(`${node.callee}(${node.args.map(compileNode).join(", ")})`);
    case "mutate":
      return `${node.var}${node.mutation}`;
    case "varName":
    case "numVarName":
      return node.value;
    default:
      return JSON.stringify(node);
  }
};

module.exports = (file, turbo) => {
  global.turbo = turbo;
  return compile(parseAST(file));
};
