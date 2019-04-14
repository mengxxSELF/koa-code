const url = require('url')

let request = {
  // get 相当于去 url属性的时候 要调取这个 get 方法
  get url () {
    return this.request.req.url
  },
  get path () {
    return url.parse(this.req.url).pathname
  }
}

module.exports = request
