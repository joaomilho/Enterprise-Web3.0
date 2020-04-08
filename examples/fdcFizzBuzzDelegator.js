function write(x) { console.log(x) }

      class FizzBuzzDelegator { async main () {
        var x = 0
var out = ""
while (x < 1000) {
        if (x % 5 == 0 && x % 3 == 0) {
        await new Promise(r => {
    setTimeout(async () => { r(await write("Fizz Buzz")) }, 1000)
  })
      } else {
        if (x % 3 == 0) {
        await new Promise(r => {
    setTimeout(async () => { r(await write("Fizz")) }, 1000)
  })
      } else {
        if (x % 5 == 0) {
        await new Promise(r => {
    setTimeout(async () => { r(await write("Buzz")) }, 1000)
  })
      } else {
        await new Promise(r => {
    setTimeout(async () => { r(await write(x)) }, 1000)
  })
      }
      }
      }
x++
      }
      } }
      new FizzBuzzDelegator().main()