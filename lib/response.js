const response = {
  set body (value) {
    this._body = value
  },

  get body () {
    console.log(this._value, 'this._value');
    return this._value
  }
}

// response.body = 'sss'

module.exports = {}
