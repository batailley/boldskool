import Observable from '../utils/Observable.js'

export default class DomManager extends Observable {
  constructor () {
    super()
    if (document.readyState === 'complete') {
      this.dispatch('dom-ready')
    } else {
      document.addEventListener('DOMContentLoaded', () => { this.dispatch('dom-ready') })
    }
  }
}
