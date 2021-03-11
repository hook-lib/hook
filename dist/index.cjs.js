'use strict';

require('core-js/modules/es.reflect.construct.js');
var _classCallCheck = require('@babel/runtime/helpers/classCallCheck');
var _createClass = require('@babel/runtime/helpers/createClass');
var _inherits = require('@babel/runtime/helpers/inherits');
var _possibleConstructorReturn = require('@babel/runtime/helpers/possibleConstructorReturn');
var _getPrototypeOf = require('@babel/runtime/helpers/getPrototypeOf');
var _isPlainObject = require('lodash/isPlainObject');
var _merge = require('lodash/merge');
require('core-js/modules/es.array.for-each.js');
require('core-js/modules/web.dom-collections.for-each.js');
require('core-js/modules/es.object.keys.js');
var HookEvent = require('@hook/event');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _classCallCheck__default = /*#__PURE__*/_interopDefaultLegacy(_classCallCheck);
var _createClass__default = /*#__PURE__*/_interopDefaultLegacy(_createClass);
var _inherits__default = /*#__PURE__*/_interopDefaultLegacy(_inherits);
var _possibleConstructorReturn__default = /*#__PURE__*/_interopDefaultLegacy(_possibleConstructorReturn);
var _getPrototypeOf__default = /*#__PURE__*/_interopDefaultLegacy(_getPrototypeOf);
var _isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(_isPlainObject);
var _merge__default = /*#__PURE__*/_interopDefaultLegacy(_merge);
var HookEvent__default = /*#__PURE__*/_interopDefaultLegacy(HookEvent);

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf__default['default'](Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf__default['default'](this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn__default['default'](this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Hook = /*#__PURE__*/function (_HookEvent) {
  _inherits__default['default'](Hook, _HookEvent);

  var _super = _createSuper(Hook);

  function Hook() {
    var _this;

    _classCallCheck__default['default'](this, Hook);

    _this = _super.apply(this, arguments);
    _this._readonlySetters = {};
    _this._setterdata = {};
    return _this;
  }

  _createClass__default['default'](Hook, [{
    key: "_getSetterData",
    value: function _getSetterData(setterName) {
      var caches = this._setterdata;

      if (!caches[setterName]) {
        caches[setterName] = {};
      }

      return caches[setterName];
    }
  }, {
    key: "set",
    value: function set(key, value) {
      return this.generateSetter('set')(key, value);
    }
  }, {
    key: "get",
    value: function get(field) {
      return this.generateGetter('set')(field);
    }
  }, {
    key: "generateSetter",
    value: function generateSetter(setterName, setterReadonlys) {
      var _this2 = this;

      var datas = this._getSetterData(setterName);

      if (setterReadonlys) {
        this.setReadOnlyProps(setterName, setterReadonlys);
      }

      return function (key, value) {
        var readOnlys = _this2.getReadonlyProps(setterName);

        if (_isPlainObject__default['default'](key)) {
          var config = key;
          Object.keys(readOnlys).forEach(function (prop) {
            if (typeof config[prop] !== 'undefined') {
              delete config[prop];

              _this2.emit('HOOK_ERROR', {
                code: 300002,
                message: 'can not set readonly props',
                detail: {
                  method: setterName,
                  prop: prop,
                  value: config[prop]
                }
              });
            }
          });

          _merge__default['default'](datas, config);
        } else if (typeof key === 'string' && typeof value !== 'undefined') {
          if (!readOnlys[key]) {
            datas[key] = value;
          } else {
            _this2.emit('HOOK_ERROR', {
              code: 300001,
              message: 'can not set readonly prop',
              detail: {
                method: setterName,
                prop: key,
                value: value
              }
            });
          }
        }

        return _this2;
      };
    }
  }, {
    key: "generateGetter",
    value: function generateGetter(setterName) {
      var datas = this._getSetterData(setterName);

      return function (field) {
        if (field) {
          return datas[field];
        }

        return datas;
      };
    }
  }, {
    key: "getReadonlyProps",
    value: function getReadonlyProps(setterName) {
      var caches = this._readonlySetters;

      if (!caches[setterName]) {
        caches[setterName] = {};
      }

      return caches[setterName];
    }
  }, {
    key: "setReadOnlyProps",
    value: function setReadOnlyProps(setterName) {
      var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cache = this.getReadonlyProps(setterName);
      Object.keys(props).forEach(function (key) {
        if (props[key]) {
          cache[key] = true;
        } else {
          delete cache[key];
        }
      });
      return this;
    }
  }]);

  return Hook;
}(HookEvent__default['default']);

module.exports = Hook;
//# sourceMappingURL=index.cjs.js.map
