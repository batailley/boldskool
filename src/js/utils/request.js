export var Request = {
    /**
     *
     * @param url
     * @param data
     * @param callbackFn
     * @param errorFn
     */
    get: function(url, data, callbackFn, errorFn){
        var request = new XMLHttpRequest();
        if  ((typeof data === "object") && (data !== null)) {
            url = url + this.jsonToQueryString(data);
        }
        request.open('GET', url, true);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var data = null;
                try {
                     data = JSON.parse(request.responseText);
                } catch (error) {
                    console.log('JSON.parse failed response ', error);
                }
                callbackFn(data);
            } else {
                errorFn(request)
            }
        };

        request.onerror = function() {
            errorFn(request)
        };

        request.send(data);
    },

    promise: function (method, url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    },


    /**
     *
     * @param url
     * @param data
     * @param callbackFn
     * @param errorFn
     */
    getWithAuthorize: function(url, data, callbackFn, errorFn, bearer){
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.setRequestHeader('Authorization', 'Bearer '+bearer);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                try {
                    var data = JSON.parse(request.responseText);
                } catch (error) {
                    console.log('JSON.parse failed authorized url:'+url);
                }
                callbackFn(data);
            } else {
                errorFn(request)
            }
        };

        request.onerror = function() {
            errorFn(request)
        };

        request.send(data);
    },

    /**
     * Accepting data as object or formData
     * @param type
     * @param url
     * @param data
     * @param callbackFn
     * @param errorFn
     * @param headers
     */
    requestWithCustomHeaders: function(type, url, data, callbackFn, errorFn, headers) {
        let request = new XMLHttpRequest();
        request.open(type, url, true);
        for (let key in headers) {
            request.setRequestHeader(key, headers[key]);
        }
        let formData = this.convertToFormData(data);

        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                if (request.responseText !== "") {
                    let data = null;
                    try {
                        data = JSON.parse(request.responseText);
                    } catch (error) {
                        errorFn('JSON.parse failed authorized url:' + url);
                    }
                    callbackFn(data);
                } else {
                    callbackFn();
                }
            } else {
                errorFn(request)
            }
        };

        request.onerror = () => {
            errorFn(request)
        };

        request.send(formData);
    },

    /**
     * Accepting data as object or formData
     * @param url
     * @param data
     * @param callbackFn
     * @param errorFn
     * @param headers
     */
    postWithCustomHeaders: function(url, data, callbackFn, errorFn, headers) {
        this.requestWithCustomHeaders('POST', url, data, callbackFn, errorFn, headers);
    },
    /**
     * Accepting data as object or formData
     * @param url
     * @param data
     * @param callbackFn
     * @param errorFn
     * @param headers
     */
    getWithCustomHeaders: function(url, data, callbackFn, errorFn, headers) {
        this.requestWithCustomHeaders('GET', url, data, callbackFn, errorFn, headers);
    },

    /**
     * Accepting data as object or formData
     * @param url
     * @param data
     * @param callbackFn
     * @param errorFn
     * @param bearer
     */
    postWithAuthorize: function(url, data, callbackFn, errorFn, bearer) {
        let headers = {'Authorization' : 'Bearer '+ bearer };
        this.postWithCustomHeaders(url, data, callbackFn, errorFn, headers)
    },
    /**
     *
     * @param uri
     * @param key
     * @param value
     * @returns {string}
     */
    updateUrlParameter : function (uri, key, value) {
        // remove the hash part before operating on the uri
        var i = uri.indexOf('#');
        var hash = i === -1 ? ''  : uri.substr(i);
        uri = i === -1 ? uri : uri.substr(0, i);

        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            uri = uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            uri = uri + separator + key + "=" + value;
        }
        return uri + hash;  // finally append the hash as well
    },
    convertToFormData : function(data) {
        let formData = null;
        if (Object.prototype.toString.call(data) === '[object FormData]') {
            formData = data;
        } else if (Object.prototype.toString.call(data) === "[object Object]") {
            formData = new FormData();
            Object.keys(data).forEach((k) => {
                formData.append(k, data[k]);
            });
        }
       return formData;
    },
    /**
     *
     * @param json
     * @returns {string}
     */
    jsonToQueryString : function(json) {
        return '?' +
            Object.keys(json).map(function(key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    },

    getParameter: function(name) {
        if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) {
            return decodeURIComponent(name[1]);
        }

        return null;
    }
};