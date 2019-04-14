// const app = {
//   middles: [],
//   use (cb) {
//     this.middles.push(cb)
//   }
// }

// app.use((next) => {
//   console.log('middleware1');
//   next()
//   console.log('middleware1 - next');
// })

// app.use((next) => {
//   console.log('middleware2');
//   next()
//   console.log('middleware2 - next');
// })

const middles = []
const use = (cb) => {
  middles.push(cb)
}

use((next) => {
  console.log('middleware1');
  next()
  console.log('middleware1 - next');
})

use((next) => {
  console.log('middleware2');
  next()
  console.log('middleware2 - next');
})

console.log(middles, middles[0]);

function dispatch (index) {
  console.log(index, middles.length );
  if (index == middles.length) return
  const fnItem = middles[index]
  console.log(fnItem, 'fnItem - fnItem');
  fnItem(() => dispatch(index + 1))
  // 取出来第一个中间件的函数
  // const function1 = middles[index]
  // console.log(function1, 'function1');
  // // 执行这个函数 - 但是要传入next 
  // function1(() => dispatch(index+1) ) 
}


dispatch(0)