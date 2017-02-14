import Observable from "./utils/Observable";

export default class ApplicationContainer extends Observable {
    constructor(data, utils, commonDomDependantModules) {
        super();

        this.data = data;
        this.Util = utils;
        this.commonDomDependantModules = commonDomDependantModules;

        this.applicationEventsListeners();
        this.dependenciesDispatchMapper();
        
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
    setBearer(bearer) {
        this.data.set('Bearer', bearer);
    }

    // Dependencies management
    readyDependencies = [];
    dependenciesListeners = [];
    dependenciesRef = ['translations', 'user', 'passengerTypes', 'travelClasses', 'stats'];
    dependenciesListener(dependencies, callback, label) {
        if (this.dependenciesAreReady(dependencies)){
            callback();
        } else {
            this.dependenciesListeners.push({dependencies, callback, label});
        }
    }
    dependenciesDispatchMapper() {
        this.dependenciesRef.forEach(
            (ref) => (this.listen(ref+'-ready', () => this.dispatch('dependency-ready', ref)))
        );
        this.listen('dependency-ready', (dependencyRef) => {
            this.readyDependencies.push(dependencyRef);
            this.dispatchDependencyReady();
        })
    }
    dispatchDependencyReady() {
        this.dependenciesListeners.forEach((waiter, index) => {
            if (this.dependenciesAreReady(waiter.dependencies)) {
                try {
                    waiter.callback();
                    this.dependenciesListeners.splice(index, 1);
                } catch (e) {
                    console.log('Waiter callback failed', waiter, e);
                    throw e;
                }
            }
        });
    }
    dependenciesAreReady(wanted) {
        let need = [];
        wanted.forEach((wanted_value) => {
            if (!this.dependencyIsReady(wanted_value)) {
                need.push(wanted_value);
            }
        });
        return need.length === 0;
    }
    dependencyIsReady(ref) {
        return this.readyDependencies.find((v) => (v === ref));
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