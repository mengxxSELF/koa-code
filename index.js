
// const Koa = require('koa')
const Koa = require('./koa')
const app = new Koa()

// app.use((next) => {
//   console.log('middleware1');
//   next()
//   ctx.body = 1233
// })

app.use((ctx) => {
  ctx.req.url

  console.log('ctx.req.url', ctx.req.url, ctx.path)

  ctx.body = '1233'

  // res.end('12ljdklfdlk3')
})

app.listen(3333, () => {
  console.log(3333999999999)
})