import Observable from './Observable'

export default class DependencyManager extends Observable {
  constructor (dependenciesRef) {
    super()
    this.readyDependencies = []
    this.failedDependencies = []
    this.pendingDependencies = []
    this.dependenciesListeners = []
    this.dependenciesRef = dependenciesRef
    this.dependenciesStates = ['ready', 'pending', 'failed']
    this.dependenciesDispatchMapper()
  }

  dependenciesListener (dependencies, callback, label) {
    let state = this.analyseStates(this.getDependenciesStates(dependencies))
    if (state === 'ready') {
      callback()
    } else {
      this.dependenciesListeners.push({dependencies, callback, label})
    }
  }

  dependenciesDispatchMapper () {
    this.dependenciesRef.forEach(
        (ref) => {
          this.dependenciesStates.forEach(
            (state) => {
              this.listen(ref + '-' + state, () => this.dispatch('dependency-' + state, ref))
            }
          )
        }
    )

    this.listen('dependency-ready', (dependencyRef) => {
      this.readyDependencies.push(dependencyRef)
      this.dispatchDependencyStateChange()
    })

    this.listen('dependency-failed', (dependencyRef) => {
      this.failedDependencies.push(dependencyRef)
      this.dispatchDependencyFailed()
    })

    this.listen('dependency-pending', (dependencyRef) => {
      this.pendingDependencies.push(dependencyRef)
      this.dispatchDependencyPending()
    })
  }

  dispatchDependencyStateChange () {
    this.dependenciesListeners.forEach((dependenciesWaiter, index) => {
      let state = this.analyseStates(this.getDependenciesStates(dependenciesWaiter.dependencies))
      if (state === 'ready') {
        dependenciesWaiter.callback()
        this.dependenciesListeners.splice(index, 1)
      }
    })
  }

  analyseStates (states) {
    let state = null
    if (this.stateCounter('failing', states) > 0) {
      state = 'failing'
    } else if (this.stateCounter('pending', states) > 0) {
      state = 'pending'
    } else if (this.stateCounter('ready', states) === states.length) {
      state = 'ready'
    }

    return state
  }

  getDependenciesStates (dependencies) {
    let states = []
    dependencies.forEach((wantedValue) => {
      if (this.dependencyIsPending(wantedValue)) {
        states.push('pending')
      }
      if (this.dependencyIsFailing(wantedValue)) {
        states.push('failing')
      }
      if (!this.dependencyIsReady(wantedValue)) {
        states.push('ready')
      }
    })

    return states
  }

  stateCounter (state, source) {
    return source.reduce((n, val) => {
      return n + (val === state)
    }, 0)
  }

  dependencyIsReady (ref) {
    return this.readyDependencies.find((v) => (v === ref))
  }

  dependencyIsPending (ref) {
    return this.pendingDependencies.find((v) => (v === ref))
  }

  dependencyIsFailing (ref) {
    return this.failedDependencies.find((v) => (v === ref))
  }
}
