(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AdapterFactory = function () {
    function AdapterFactory() {
        _classCallCheck(this, AdapterFactory);
    }

    _createClass(AdapterFactory, null, [{
        key: "createAdaptee",
        value: function createAdaptee(adapteeKey) {
            this.adaptee = {};
            if (adapteeKey === "one") {
                this.adaptee = new oneAdaptee();
            } else if (adapteeKey === "two") {
                this.adaptee = new twoAdaptee();
            }
            return this.adaptee;
        }
    }]);

    return AdapterFactory;
}();

exports.default = AdapterFactory;

var AdapteeInterface = function () {
    function AdapteeInterface() {
        _classCallCheck(this, AdapteeInterface);
    }

    _createClass(AdapteeInterface, [{
        key: "get",
        value: function get(key) {
            throw "please implement me";
        }
    }, {
        key: "set",
        value: function set(key, value) {
            throw "please implement me";
        }
    }]);

    return AdapteeInterface;
}();

var oneAdaptee = function (_AdapteeInterface) {
    _inherits(oneAdaptee, _AdapteeInterface);

    function oneAdaptee() {
        _classCallCheck(this, oneAdaptee);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(oneAdaptee).apply(this, arguments));
    }

    _createClass(oneAdaptee, [{
        key: "get",
        value: function get(key) {
            console.log('get one Ad');
        }
    }, {
        key: "set",
        value: function set(key, value) {
            console.log('set one Ad', key, value);
        }
    }]);

    return oneAdaptee;
}(AdapteeInterface);

var twoAdaptee = function (_AdapteeInterface2) {
    _inherits(twoAdaptee, _AdapteeInterface2);

    function twoAdaptee() {
        _classCallCheck(this, twoAdaptee);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(twoAdaptee).apply(this, arguments));
    }

    return twoAdaptee;
}(AdapteeInterface);

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = template;
function template() {
    console.log('the template_');
}

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _template = require('./app-dependencies/template');

var _Adapter = require('./app-dependencies/Adapter');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
    function App() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, App);

        this.name = options.name || 'no name';
    }

    _createClass(App, [{
        key: 'getName',
        value: function getName() {
            //
            return "Name: " + this.name;
        }
    }]);

    return App;
}();

window.app = new App();
window.AdapterFactory = _Adapter.AdapterFactory;

},{"./app-dependencies/Adapter":1,"./app-dependencies/template":2}]},{},[3])