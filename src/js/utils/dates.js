export var Dates = {
    zeroising : function(num) {
        var numStr = num + "";
        return (numStr.length === 1) ? "0" + numStr : numStr;
    },

    convertDatetimeString: function(dateStr) {
        var date = this.getADateFromString(dateStr);
        return this.zeroising(date.getHours()) + ':' + this.zeroising(date.getMinutes());
    },

    convertDayDatetimeString: function(dateStr) {
        var date = this.getADateFromString(dateStr);

        return this.zeroising(date.getDate()) + "." +
            this.zeroising(date.getUTCMonth() + 1) + " - " +
            this.zeroising(date.getHours()) + ':' + this.zeroising(date.getMinutes());
    },

    /**
     * @param str
     * @returns {Date}
     */
    getADateFromString : function(str) {
        "use strict";
        var date = new Date(str);
        if (isNaN(date.getTime())) {
            date = this.parse(str);
        }
        return date;
    },

    convertDatetimeTimeStamp: function(dateStr) {
        return this.getADateFromString(dateStr).getTime() / 1000;
    },

    parse : function(str) {
        if (typeof str === 'undefined') {
            return new Date();
        }
        if (typeof str === 'string') {
            str = str || '';
            str = str.replace('T',' ');
            var regtime = /^(\d{4})\-?(\d{1,2})\-?(\d{1,2})/i;

            if (str.match(regtime)) {
                str = str.replace(regtime, "$2/$3/$1");
            }
            return new Date(str);
        } else if (typeof str === 'number') {
            return new Date(str);
        } else {
            return new Date();
        }
    }
};