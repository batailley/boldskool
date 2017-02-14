import {Css}  from "./utils/css";
import {Dom}  from "./utils/dom";
import {Collection, CachedCollection}  from "./utils/cached-collection";
import {Dates}  from "./utils/dates";
import {Obj}  from "./utils/object";
import {Request}  from "./utils/request";
import {Event} from "./utils/event";
import {Cookies} from "./utils/cookies";
import {Is} from "./utils/features";

import BabelPolyfill from 'babel-polyfill';

import ApplicationContainer from "./ApplicationContainer"


window.AppInitialiser = {
    subApps : [],
    setSubView : function(subViewInitialiser) {
      if (this.appIsReady) {
          subViewInitialiser.start(window.App)
      } else {
          this.subViews.push(subViewInitialiser);
      } 
    },
    appIsReady: false,
    utils : {
        Css,
        Dates,
        Dom,
        Obj,
        Request,
        Event,
        Cookies,
        Is,
        Collection,
        CachedCollection
    },
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
        this.setAppReady(new ApplicationContainer(this.data, this.utils, commonDomDependantModules));
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