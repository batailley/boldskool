import {Collection, CachedCollection}  from "./utils/cached-collection";
import {Request}  from "./utils/request";

import BabelPolyfill from 'babel-polyfill';

import ApplicationContainer from "./ApplicationContainer";

import DependencyManager from "./utils/DependencyManager";
import dependenciesRef from '../conf/dependenciesReference.js';

import utils from '../conf/utils.js';


window.AppInitialiser = {
    subViews: [], 
    setSubView : function(subViewInitialiser) {
      if (this.appIsReady) {
          subViewInitialiser.start(window.App)
      } else {
          this.subViews.push(subViewInitialiser);
      } 
    },
    appIsReady: false,
    utils : utils,
    setApplicationSettings: function (data) {
        Object.keys(applicationSettings).forEach((k) => {
            data.set(k, applicationSettings[k]);
        });
        return data;
    },
    start: function() {
        this.data = this.setApplicationSettings(new CachedCollection());
        this.preApplication();
    },
    preApplication: function() {
        let dependencyManager = new DependencyManager(dependenciesRef);
        this.setAppReady(new ApplicationContainer(this.data, this.utils, dependencyManager));
    },
    setAppReady: function(App) {
        window.App = App;
        this.appIsReady = true;

        this.subViews.forEach((views) => {
            views.start(App);
        });
        
        this.postApplication();
    },
    postApplication: function() {
        this.setTranslations();
    },    
    setTranslations: function() {
        let locale = App.getLocale().split('_');
        let url = this.data.get('translationUrl').replace('%7Blang%7D', locale[0]);
        Request.get(
            url,
            null,
            (data) => (App.setTranslations(data)),
            () => (console.log('translations is unreachable...'))
        );
    }
};

window.AppInitialiser.start();