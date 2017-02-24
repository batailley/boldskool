import Observable from './utils/Observable'

export default class ApplicationContainer extends Observable {
  constructor (data, utils, dependencyManager) {
    super()
    this.data = data
    this.Util = utils
    this.dependencyManager = dependencyManager
    this.applicationEventsListeners()
  }

  deferToDomReady (executor) {
    if (document.readyState) {
      executor()
    } else {
      document.addEventListener('DOMContentLoaded', () => { executor() })
    }
  }

  dependenciesListener (dependencies, callback, label) {
    this.dependencyManager.dependenciesListener(dependencies, callback, label)
  }

  dependencyDispatch (dependency) {
    this.dependencyManager.dispatch(dependency + '-ready')
  }

  applicationEventsListeners () {
    this.listen('set-flight-on', () => {
      let bod = document.querySelector('body')
      if (this.Util.Css.hasClass(bod, 'no-flight')) {
        this.Util.Css.removeClass(bod, 'no-flight')
      }
    })
    this.listen('set-flight-off', () => {
      this.Util.Css.addClass(document.querySelector('body'), 'no-flight')
    })
    this.listen('flight-error', () => {
      this.dispatch('set-flight-off')
    })
  }

    // Managers Setters
  setTranslations (data) {
    this.data.set('translations', data)
    this.dispatch('translations-ready')
  }
  setAnalyticsAdapter (analyticsAdapter) {
    this.analyticsAdapter = analyticsAdapter
    this.statsEventListenersMapper()
    this.dispatch('stats-ready')
  }

  setUser (user) {
    this.currentUser = user
    this.dispatch('user-ready')
  }
}
