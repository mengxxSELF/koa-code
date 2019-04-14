const http = require('http')

let context = require('./lib/context');
let request = require('./lib/request');
let response = require('./lib/response');

class Koa {
  constructor () {
    // 中间件
    this.middles = []
    this.context = context
    this.request = request
    this.response = response
    this.ctx 
  }

  use (cb) {
    this.middles.push(cb)
  }

  createContext(req, res) {
    let ctx = Object.create(this.context);
    ctx.request = Object.create(this.request);
    ctx.response = Object.create(this.response);
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }


  listen (port, cb) {
    http.createServer((req, res) => {
      this.ctx = this.createContext(req, res)

      this.middles.forEach((item) => {
        item(this.ctx)
      })

      const body = this.ctx.body

      // 判断有没有写 ctx.body 

      if (body && body != 'undefined') {
        res.end(body)
      } else {
        res.end('Not Found')
      }

    }).listen(port, cb)
  }
}

module.exports = Koa