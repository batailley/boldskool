export default class Observable {
  constructor () {
    this._Events = []
    this._EventsOnce = []
  }

  listen (event, fct) {
    this._Events[event] = this._Events[event] || []
    if (this._Events[event].indexOf(fct) === -1) {
      this._Events[event].push(fct)
    }
  }
  listenOnce (event, fct) {
    if (this._EventsOnce[event].indexOf(fct) === -1) {
      this._EventsOnce[event].push(fct)
    }
  }
  hasListener (event, fct) {
    let res = false

    if (event in this._Events !== false) {
      res = res || this._Events[event].indexOf(fct) !== -1
    }
    if (event in this._EventsOnce !== false) {
      res = res || this._EventsOnce[event].indexOf(fct) !== -1
    }

    return res
  }
  removeListener (event, fct) {
    if (event in this._Events !== false) {
      const fctIndex = this._Events[event].indexOf(fct)
      if (fctIndex !== -1) {
        this._Events[event].splice(fctIndex, 1)
      }
    }
    if (event in this._EventsOnce !== false) {
      const fctOnceIndex = this._EventsOnce[event].indexOf(fct)
      if (fctOnceIndex !== -1) {
        this._EventsOnce[event].splice(fctOnceIndex, 1)
      }
    }
  }
  dispatch (event /* , args... */) {
    let i = 0
    if (event in this._Events !== false) {
      for (i = 0; i < this._Events[event].length; i++) {
        this._Events[event][i].apply(this, Array.prototype.slice.call(arguments, 1))
      }
    }

    if (event in this._EventsOnce !== false) {
      let callbacks = this._EventsOnce[event]
      this._EventsOnce[event] = []
      for (i = 0; i < callbacks.length; i++) {
        callbacks[i].apply(this, Array.prototype.slice.call(arguments, 1))
      }
    }
  }
}
