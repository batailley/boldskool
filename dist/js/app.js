(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.template = template;
function template() {
    console.info('_the template method has been called_');
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _template = require('./app-dependencies/template');

var _Adapter = require('./patterns/Adapter');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
    function App() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, App);

        this.name = options.name || 'no name';
        (0, _template.template)();
        this.adapter = (0, _Adapter.adapterFactory)('one');
    }

    _createClass(App, [{
        key: 'init',
        value: function init() {
            this.getName();
            this.adapter.set('key', 'example');
        }
    }, {
        key: 'getName',
        value: function getName() {
            return "The App Name is: " + this.name;
        }
    }]);

    return App;
}();

exports.default = App;


window.app = new App({
    name: "the demo app"
});

window.app.init();

},{"./app-dependencies/template":1,"./patterns/Adapter":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.adapterFactory = adapterFactory;

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function adapterFactory(adapterKey) {
    var adapter = {};
    if (adapterKey === "one") {
        adapter = new oneAdapter();
    } else if (adapterKey === "two") {
        adapter = new twoAdapter();
    }
    return adapter;
}

var AdapterInterface = function () {
    function AdapterInterface() {
        _classCallCheck(this, AdapterInterface);
    }

    _createClass(AdapterInterface, [{
        key: "get",
        value: function get(key) {
            throw new Error("please implement me");
        }
    }, {
        key: "set",
        value: function set(key, value) {
            throw new Error("please implement me");
        }
    }]);

    return AdapterInterface;
}();

exports.default = AdapterInterface;

var oneAdapter = function (_AdapterInterface) {
    _inherits(oneAdapter, _AdapterInterface);

    function oneAdapter() {
        var _Object$getPrototypeO;

        _classCallCheck(this, oneAdapter);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(oneAdapter)).call.apply(_Object$getPrototypeO, [this].concat(args)));
    }

    _createClass(oneAdapter, [{
        key: "get",
        value: function get(key) {
            console.info('get one from adapter', key);
        }
    }, {
        key: "set",
        value: function set(key, value) {
            console.info('set one to adapter', key, value);
        }
    }]);

    return oneAdapter;
}(AdapterInterface);

exports.default = oneAdapter;

var twoAdapter = function (_AdapterInterface2) {
    _inherits(twoAdapter, _AdapterInterface2);

    function twoAdapter() {
        var _Object$getPrototypeO2;

        _classCallCheck(this, twoAdapter);

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(twoAdapter)).call.apply(_Object$getPrototypeO2, [this].concat(args)));
    }

    return twoAdapter;
}(AdapterInterface);

},{}]},{},[2])