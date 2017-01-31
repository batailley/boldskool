export var Event = {
    listen: function(event, fct){
        this._ugoEvents = this._ugoEvents || {};
        this._ugoEvents[event] = this._ugoEvents[event] || [];
        if (this._ugoEvents[event].indexOf(fct) == -1) {
            this._ugoEvents[event].push(fct);
        }
    },
    listenOnce: function(event, fct){
        this._ugoEventsOnce = this._ugoEventsOnce || {};
        this._ugoEventsOnce[event] = this._ugoEventsOnce[event] || [];
        if (this._ugoEventsOnce[event].indexOf(fct) == -1) {
            this._ugoEventsOnce[event].push(fct);
        }
    },
    hasListener: function(event, fct){
        let res = false;
        this._ugoEvents = this._ugoEvents || {};
        if(event in this._ugoEvents !== false) {
            res = res || this._ugoEvents[event].indexOf(fct) != -1;
        }
        if(event in this._ugoEventsOnce !== false) {
            res = res || this._ugoEventsOnce[event].indexOf(fct) != -1;
        }
        return res;
    },
    removeListener: function(event, fct){
        this._ugoEvents = this._ugoEvents || {};
        if(event in this._ugoEvents !== false) {
            const fctIndex = this._ugoEvents[event].indexOf(fct);
            if (fctIndex != -1) {
                this._ugoEvents[event].splice(fctIndex, 1);
            }
        }
        this._ugoEventsOnce = this._ugoEventsOnce || {};
        if(event in this._ugoEventsOnce !== false) {
            const fctOnceIndex = this._ugoEventsOnce[event].indexOf(fct);
            if (fctOnceIndex != -1) {
                this._ugoEventsOnce[event].splice(fctOnceIndex, 1);
            }
        }
    },
    dispatch: function(event /* , args... */){
        this._ugoEvents = this._ugoEvents || {};
        let i = 0;
        if(event in this._ugoEvents !== false) {
            for(i = 0; i < this._ugoEvents[event].length; i++) {
                this._ugoEvents[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }

        this._ugoEventsOnce = this._ugoEventsOnce || {};
        if(event in this._ugoEventsOnce !== false) {
            let callbacks = this._ugoEventsOnce[event];
            this._ugoEventsOnce[event] = [];
            for(i = 0; i < callbacks.length; i++) {
                callbacks[i].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    },
    mixin: function(destObject){
        var props = ['listen', 'listenOnce', 'hasListener', 'removeListener', 'dispatch'];
        return this.mixinIn(this, destObject, props);
    },
    mixinIn: function(origObject, destObject, methods) {
        for (var i = 0; i < methods.length; i++) {
            if (typeof destObject === 'function') {
                destObject.prototype[methods[i]] = origObject[methods[i]];
            } else {
                destObject[methods[i]] = origObject[methods[i]];
            }
        }
        return destObject;
    }
};