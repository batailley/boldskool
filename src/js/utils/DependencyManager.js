import Observable from './Observable'

export default class DependencyManager extends Observable {
  constructor (dependenciesRef) {
    super()
    this.readyDependencies = []
    this.dependenciesListeners = []
    this.dependenciesRef = dependenciesRef
    this.dependenciesDispatchMapper()
  }

  dependenciesListener (dependencies, callback, label) {
    if (this.dependenciesAreReady(dependencies)) {
      callback()
    } else {
      this.dependenciesListeners.push({dependencies, callback, label})
    }
  }

  dependenciesDispatchMapper () {
    this.dependenciesRef.forEach(
            (ref) => (this.listen(ref + '-ready', () => this.dispatch('dependency-ready', ref)))
        )
    this.listen('dependency-ready', (dependencyRef) => {
      this.readyDependencies.push(dependencyRef)
      this.dispatchDependencyReady()
    })
  }

  dispatchDependencyReady () {
    this.dependenciesListeners.forEach((waiter, index) => {
      if (this.dependenciesAreReady(waiter.dependencies)) {
        try {
          waiter.callback()
          this.dependenciesListeners.splice(index, 1)
        } catch (e) {
          console.log('Waiter callback failed', waiter, e)
          throw e
        }
      }
    })
  }

  dependenciesAreReady (wanted) {
    let need = []
    wanted.forEach((wantedValue) => {
      if (!this.dependencyIsReady(wantedValue)) {
        need.push(wantedValue)
      }
    })
    return need.length === 0
  }

  dependencyIsReady (ref) {
    return this.readyDependencies.find((v) => (v === ref))
  }

}
