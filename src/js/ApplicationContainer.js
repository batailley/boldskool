import Observable from "./utils/Observable";

export default class ApplicationContainer extends Observable {
    constructor(data, utils, dependencyManager) {
        super();

        this.data = data;
        this.Util = utils;
        this.dependencyManager = dependencyManager;

        this.applicationEventsListeners();
        
        this.deferToDomReady(this.initDomDependantModules());
        
    }

    deferToDomReady(executor) {
        if (document.readyState) {
            executor();
        } else {
            document.addEventListener('DOMContentLoaded', () => { executor() }); 
        }
    }

    initDomDependantModules() {
        let bodyElt = document.querySelector("body");
        if (!this.Util.Css.hasClass(bodyElt, 'standalone')) {
            this.commonDomDependantModules.forEach(
                (m) => {
                    m.start(this);
                }
            );
        }
    }
    
    dependenciesListener(dependencies, callback, label) {
        this.dependencyManager.dependenciesListener(dependencies, callback, label);
    }

    applicationEventsListeners() {
        this.listen('set-flight-on', () => {
            let bod = document.querySelector('body');
            if (this.Util.Css.hasClass(bod, 'no-flight')) {
                this.Util.Css.removeClass(bod, 'no-flight');
            }
        });
        this.listen('set-flight-off', () => {
            this.Util.Css.addClass(document.querySelector('body'), 'no-flight');
        });
        this.listen('flight-error', () => {
            this.dispatch('set-flight-off');
        })
    }


    //analyticsAdapter and interface
    statsEventListenersMapper() {
        this.listen('stats-ready', () => { this.trackView() });
    }
    trackView(viewName, data) {
        let title = viewName ? viewName : document.title;
        this.analyticsAdapter.logView(title, data);
    }
    trackEvent(eventName, data) {
        this.analyticsAdapter.logEvent(eventName, data);
    }
    trackGeneral(eventName, data) {
        this.analyticsAdapter.logGeneral(eventName, data);
    }


    //SETTERS
    setTranslations(data) {
        this.data.set('translations', data);
        this.dispatch('translations-ready');
    }
    setAnalyticsAdapter(analyticsAdapter) {
        this.analyticsAdapter = analyticsAdapter;
        this.statsEventListenersMapper();
        this.dispatch('stats-ready');
    }
    
    setUser(user) {
        this.currentUser = user;
        this.dispatch('user-ready');
    }
    
    //
    hasConfig(flag) {
        return this.data.get('configurationMask') & flag;
    }

    getLocale() {
        return document.querySelector('html').getAttribute('lang');
    };

    getLanguage() {
        let locales = this.getLocale().split('_');
        return locales[0];
    };

}