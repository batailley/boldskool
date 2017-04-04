import {Collection, CachedCollection} from './utils/cached-collection'
import {Request} from './utils/request'

import BabelPolyfill from 'babel-polyfill'

import ApplicationContainer from './ApplicationContainer'

import DependencyManager from './utils/DependencyManager'
import dependenciesRef from './conf/dependenciesReference'

import utils from './conf/utils'
import applicationSettings from './conf/applicationSettings'

window.AppInitialiser = {
  subViews: [],
  setSubView: (subViewInitialiser) => {
    if (this.appIsReady) {
      subViewInitialiser.start(window.App)
    } else {
      this.subViews.push(subViewInitialiser)
    }
  },
  appIsReady: false,
  utils: utils,
  setApplicationSettings: (data) => {
    Object.keys(applicationSettings).forEach((k) => {
      data.set(k, applicationSettings[k])
    })
    return data
  },
  start: () => {
    this.data = this.setApplicationSettings(new CachedCollection())
    this.preApplication()
  },
  preApplication: () => {
    let dependencyManager = new DependencyManager(dependenciesRef)
    this.setAppReady(new ApplicationContainer(this.data, this.utils, dependencyManager))
  },
  setAppReady: (App) => {
    window.App = App
    this.appIsReady = true

    this.subViews.forEach((views) => {
      views.start(App)
    })

    this.postApplication()
  },
  postApplication: () => {
    console.log('everything is awesome')
  }
}

window.AppInitialiser.start()
