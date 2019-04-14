
[博客地址]()

### koa 核心源码

#### 使用

```js
const Koa = require('koa')
const app = new Koa()
const port = 3333

app.use(() => {
  console.log('middle');
})

app.listen(port, () => {
  console.log(port)
})
```

#### 分析

koa 是一个类， 开启服务，并且执行中间件函数

#### 实现

```js
const http = require('http')

class Koa {
  constructor () {
    this.middles = []
  }

  use (cb) {
    this.middles.push(cb)
  }

  listen (port, cb) {
    // 开起服务
    http.createServer((req, res) => {

      // 遍历中间件
      this.middles.forEach((item) => {
        item()
      })

    }).listen(port, cb)
  }
}
```

#### request.js 实现

```js
let request = {
  get url () {
    return this.request.req.url
  }
}

module.exports = request
```

这里的get url  相当于

```js
Object.defineProperty(request, 'url', {
  get () {
    return this.request.req.url
  }
})
```


#### context 实现

```js
const context = { }

module.exports = context
```

context 就是 ctx

```js
let ctx = Object.create(this.context);
```


在使用koa过程中，我们经常直接在ctx对象上获取属性，比如

```js
ctx.path 

ctx.query
```

这些属性的实现是通过 

```js
const context = { }

// context.url = context.request.url
// 自定义获取器， 代理
function defineGetter(property, name) {
  context.__defineGetter__(name, function () {
    return this[property][name]
  })
}

// context 获取 url 的时候 实际获取的是  context.request.url
defineGetter('request', 'url')

// path
defineGetter('request', 'path')

module.exports = context
```

这里涉及到一个代理的功能，在原生koa使用的是 Delegator 库

里面有这样的代码

```js
  proto.__defineGetter__(name, function(){
    return this[target][name];
  });
```

关于 (__defineGetter__)[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/__defineGetter__]


#### response.js 实现

response 最主要的是 koa的返回值, 使用的时候是 

```js
ctx.body = '123'
```

response.js 模块，实现，包括设置和获取两个

```js
const response = {
  set body (value) {
    this._body = value
  },

  get body () {
    return this._value
  }
}

module.exports = {}
```

而 response.body 实际是可以直接在 ctx 中获得的, 所以还要在 context.js 中添加一层代理

```js
// 代理 body  ctx.body -> ctx.response.body
defineSetter('response', 'body')

// 属性定义期  代理
function defineSetter(property, name) {
  context.__defineSetter__(name, function (value) {
    this[property][name] = value
  })
}
```

这样当我们使用 ctx.body = xxx 就能相当于写的 ctx.response.body = xxx


### 中间件

#### 使用

```js
app.use(async (ctx, next) => {
  console.log('middleware1');
  next()
  console.log('middleware1 - next');
})

app.use(async (ctx, next) => {
  console.log('middleware2');
  next()
  console.log('middleware2 - next');
})
```

### 分析

每次调用use函数，都在koa的中间件数组中增加一个函数

执行next 代表了 去调用‘下一个’中间件元素

### 重写

* 生成中间件数组
  
此时还不需要ctx，暂时就认为没有传递ctx参数

```js
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

```

先看一下中间件数组现在是什么

```js
// console.log(middles)
[ [Function], [Function] ]
```

* 按顺序执行中间件数组

构建 executing 函数，用于执行中间件，参数是中间间元素的 index 

```js
const executing = (index) => {
  // fnItem 是中间间函数
  const fnItem = middles[index]
  // 获取当前的 ‘下一个’ 中间件
  const nextItem = middles[index + 1]
  // 执行此函数 并且需要 将下一个传入 
  fnItem(() => {
    executing(index + 1)
  })
}
executing(0)
```

其实这里一个点需要注意，一开始写的时候，总是认为，这里应该传的是 下一个中间件，比如

```js
fnItem(() => {
  middles[index + 1]
})
```

但是其实这个 应该传递的时候一个  执行下一个的函数，也就是 executing


* 添加一个条件 -》什么时候终止 executing 

```js
const executing = (index) => {
  // 当index 已经是 中间件数组长度了 则终止函数执行
  if (index == middles.length) return 
  const fnItem = middles[index]
  fnItem(() => executing(index + 1))
}
executing(0)
```

