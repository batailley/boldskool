export const Dom = {
    /**
     *
     * @param list Nodelist
     * @param event Event name
     * @param fn callback fonction
     */
  addEventListenerList: function (list, event, fn) {
    for (var i = 0, len = list.length; i < len; i++) {
      list[i].addEventListener(event, fn, false)
    }
  },
    /**
     *
     * @param selector
     * @param property
     * @param value
     */
  applyStyleTo: function (selector, property, value) {
    let list = document.querySelectorAll(selector)
    for (var i = 0, len = list.length; i < len; i++) {
      list[i].style[property] = value
    }
  },
    /**
     *
     * @param selector
     * @param value
     */
  applyDisplay: function (selector, value) {
    let el = document.querySelector(selector)
    if (el) {
      el.style.display = value
    }
  }
}
