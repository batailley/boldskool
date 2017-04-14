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

  dependenciesListener (dependencies, callbacks, label) {
    if (this.dependenciesAreReady(dependencies)) {
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
      if (this.dependenciesAreReady(dependenciesWaiter.dependencies)) {
        dependenciesWaiter.callback()
        this.dependenciesListeners.splice(index, 1)
      } else 
    })
  }

  dependenciesState (wanted) {
    let state = "";
    wanted.forEach((wantedValue) => {
      /*
let arr1 = ['f', 'p', 's'] //f
let arr2 = ['s', 's', 's'] //s
let arr3 = ['p', 's', 's'] //p
let arr4 = ['f', 's', 's'] //f

let counter = (source, needle) => {
 return source.reduce(function(n, val) {
    return n + (val === needle);
	}, 0)
}*/
      if (this.dependencyIsPending(wantedValue)) {
        state = "pending"
      }
      if (this.dependencyIsFailing(wantedValue)) {
        state = "failing"
      }      
      if (!this.dependencyIsReady(wantedValue)) {
        need.push(wantedValue)
      }
    })

    return need.length === 0
  }

  dependencyIsReady (ref) {
    return this.readyDependencies.find((v) => (v === ref))
  }

  dependencyIsPending (ref) {
    return this.pendingDependencies.find((v) => (v === ref))
  }

  dependencyIsFailed (ref) {
    return this.failedDependencies.find((v) => (v === ref))
  }  
}
