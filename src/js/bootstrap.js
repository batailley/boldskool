import {Css}  from "./utils/css";
import {Dom}  from "./utils/dom";
import {Collection, CachedCollection}  from "./utils/cached-collection";
import {Dates}  from "./utils/dates";
import {Obj}  from "./utils/object";
import {Request}  from "./utils/request";
import {Event} from "./utils/event";
import {Cookies} from "./utils/cookies";
import {Is} from "./utils/features";
import AnalyticsAdapter from "./utils/AnalyticsAdapter";
import SocketManager from "./SocketManager";
import {TripManager} from "./datamanagers/TripManager";

import BabelPolyfill from 'babel-polyfill';
import NavView from "./components/fixed/element.nav";

import MiniMap from "./components/common/MiniMap.jsx";
import MobileMenuFlightInfo from "./components/common/MobileMenuFlightInfo.jsx";
import ApplicationContainer from "./ApplicationContainer"
import UserManager from "./UserManager";

window.AppInitialiser = {
    subApps : [],
    setSubApp : function(subAppInitialiser) {
      if (this.appIsReady) {
          //App is ready so window.App is alive
          subAppInitialiser.start(window.App)
      } else {
          this.subApps.push(subAppInitialiser);
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
    getContext: function() {
        return new Promise((resolve, reject) => {
            this.utils.Request.get(this.data.get('contextUrl'), null, resolve, reject);
        });
    },
    start: function() {
        this.data = this.setApplicationSettings(new CachedCollection());
        this.getContext()
            .then((c) => {
                    this.data.set('hostUrl', c.server_host);
                    this.preApplication();
                },
                () => {
                    console.log('-Context is unreachable....')
                }
            );
    },
    preApplication: function() {
        this.setAppReady(new ApplicationContainer(this.data, this.utils, domModules, userManager));
    },
    setAppReady: function(App) {
        window.App = App;
        this.appIsReady = true;
        this.subApps.forEach((m) => {
            m.start(App);
        });
        this.postApplication();
    },
    postApplication: function() {
        this.setTranslations();

    },
    setSocketManager: function() {
        let socket = null, socketManager = null;
        if (parseInt(this.data.get('disableWebsocket')) !== 1) {
            socket = io(this.data.get('socket_address') + ":" + this.data.get('socket_port'));
            socketManager = new SocketManager(socket, this.data.get('forceFlightOff'));
        }
        App.setSocketManager(socketManager);
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