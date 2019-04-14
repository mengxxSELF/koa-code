const app = {
  middles: [],
  use (cb) {
    this.middles.push(cb)
  }
}

app.use((next) => {
  console.log('middleware1');
  next()
  console.log('middleware1 - next');
})

app.use((next) => {
  console.log('middleware2');
  next()
  console.log('middleware2 - next');
})

console.log(app.middles);

function comp(middles) {
  return middles.reduceRight((prev, next) => {
    console.log(prev, next);
    return () => { next(prev) }
  }, () => {})
}

const ends = comp(app.middles)
console.log(ends, 'ends - ends');
ends(() => {})