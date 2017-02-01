import Observable from "./utils/Observable";
import socketEvents from "./socketEvents";

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

    //USER Manager setup & interface
    userManagerEventListenersMapper() {
        this.userManager.getUserAndDependencies();
        this.userManager.listen('user-ready', (user) => (this.setUser(user)));
        this.userManager.listen('user-updated', (user) => (this.setUser(user)));
        this.userManager.listen('bearer-updated', (bearer) => (this.setBearer(bearer)));
        this.userManager.listen('travelClasses-ready', (classes) => (this.setTravelClasses(classes)));
        this.userManager.listen('passengerTypes-ready', (types) => (this.setPassengerTypes(types)));
    }

    /**
     *
     * @param data object or formData
     * @returns Promise
     */
    updateUser(data) {
       return this.userManager.updateUser(data);
    }
    refreshUserAvatar() {
        var avatars = document.querySelectorAll('.useravatar');
        [].forEach.call(avatars, (a) => {
            if (!this.hasConfig(this.configurationFlags.USER_PROFILE)) {
                a.classList.add('no-profile');
            }

            if (this.currentUser.avatar_src !== "") {
                a.style.backgroundImage = "url("+this.currentUser.avatar_src+")";
            }
            a.style.opacity = 1;
        });
    }

    alertHeadphones() {
        if (this.Util.Cookies.getCookie('alertHeadphones')) {
            return;
        }
        let alert = document.querySelector('.alert-headphones-overlay');
        if (alert) {
            alert.style.display = 'block';
            let closeButton = document.querySelector('.alert.alert-headphones button');
            closeButton.addEventListener('click', () => {
                alert.style.display = 'none';
                this.Util.Cookies.setCookie('alertHeadphones', true, 1);
            });
        }
    }
    alertAuth() {
        if (!this.hasConfig(this.configurationFlags.USER_PROFILE) || this.Util.Cookies.getCookie('alertAuth')) {
            return;
        }
        let alert = document.querySelector('.alert.alert-auth');
        if (alert) {
            alert.style.display = 'block';
            this.Util.Cookies.setCookie('alertAuth', true, 1);
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
    socketEventListenersMapper() {
        this.socketManager.listen(socketEvents.FLIGHT_ERROR, (data) => {
            this.dispatch('set-flight-off');
        });
        this.socketManager.listen(socketEvents.STATUS_BOARDING, (data) => {
            this.dispatch('set-flight-off');
        });
        this.socketManager.listen(socketEvents.STATUS_TAXI_IN, (data) => {
            this.dispatch('set-flight-off');
        });
        this.socketManager.listen(socketEvents.STATUS_ASCENT, (data) => {
            this.fetchFlight();
        });
        this.socketManager.listen(socketEvents.STATUS_CRUISE, (data) => {
            this.fetchFlight();
        });
        this.socketManager.listen(socketEvents.STATUS_DESCENT, (data) => {
            this.fetchFlight();
        });
        this.socketManager.listen(socketEvents.STATUS_TAXI_OUT, (data) => {
            this.dispatch('set-flight-off');
        });
        this.socketManager.listen(socketEvents.STATUS_DEPLANING, (data) => {
            this.dispatch('set-flight-off');
            this.flightData = null;
        });
        this.socketManager.listen(socketEvents.PUBLIC_ANNOUNCE, (data) => {
            this.toggleAnnounce(data);
        });
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


    //FlightManager setup and interface
    flightManagerEventListenersMapper() {
        this.flightManager.listen('trip-ready', () => {
            this.flightData = this.flightManager.tripData;
            this.dispatch('set-flight-on');
            this.dispatch('flight-ready');
        });
        this.flightManager.listen('trip-updated', () => {
            this.dispatch('flight-updated');
            this.dispatch('set-flight-on');
        });
        this.flightManager.listen('trip-fetch-error', () => {
                this.flightData = null;
                this.dispatch('flight-error');
                this.dispatch('set-flight-off');
            }
        );
    }
    fetchFlight(){
        this.flightManager.fetch();
    }
    getFlight() {
        return this.flightManager.tripData;
    }

    toggleAnnounce(calling) {
        for (let i in this.parts) {
            let part = this.parts[i];
            if (part.toggleAnnounce != undefined && typeof part.toggleAnnounce === 'function') {
                part.toggleAnnounce(calling);
            }
        }

        var announce = document.getElementById('announce-overlay');
        if (announce) {
            announce.style.display = calling ? 'block' : 'none';
        }
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
    setFlightManager(flightManager) {
        this.flightManager = flightManager;
        this.flightManagerEventListenersMapper();
        this.fetchFlight();
        this.dispatch('set-flight-on');
    }
    setSocketManager(socketManager) {
        if (socketManager) {
            this.socketManager = socketManager;
            this.socketEventListenersMapper();
            this.dispatch('socket-ready');
        }
    }
    setUser(user) {
        this.currentUser = user;
        this.refreshUserAvatar();
        this.dispatch('user-ready');
    }
    setBearer(bearer) {
        this.data.set('Bearer', bearer);
    }
    setPassengerTypes(types) {
        this.data.set('passengerTypes', types);
        this.dispatch('passengerTypes-ready');
    }
    setTravelClasses(classes) {
        this.data.set('travelClasses', classes);
        this.dispatch('travelClasses-ready');
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

    getPwdFromFile(fn) {
        return configuration.prefix + md5(fn)
    };

    forceFlightError() {
        this.flightManager.dispatch('trip-fetch-error');
    }
}