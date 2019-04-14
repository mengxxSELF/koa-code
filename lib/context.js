const context = {

}

// context.url = context.request.url

// 自定义获取器， 代理
function defineGetter(property, name) {
  context.__defineGetter__(name, function () {
    return this[property][name]
  })
}

// context 获取 url 的时候 实际获取的是  context.request.url
defineGetter('request', 'url')

// 
defineGetter('request', 'path')

// 代理 body  ctx.body -> ctx.response.body
defineGetter('response', 'body')
defineSetter('response', 'body')


// 属性定义期  代理
function defineSetter(property, name) {
  context.__defineSetter__(name, function (value) {
    console.log(value, 'value');
    this[property][name] = value
    console.log(this.response.body);
  })
}

module.exports = context