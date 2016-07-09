/* (C) 2016 Narazaka : Licensed under The MIT License - https://narazaka.net/license/MIT?2016 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GhostKernelController = exports.GhostKernel = exports.GhostKernelControllers = exports.GhostKernelRoutings = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _routableComponent = require('routable-component');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ルーティング設定クラスのリスト
 * @type {RoutableComponentRouting[]}
 */
var GhostKernelRoutings = exports.GhostKernelRoutings = [];

/**
 * コントローラクラスの連想配列
 * @type {Object<GhostKernelController>}
 */
var GhostKernelControllers = exports.GhostKernelControllers = {};

/** Ukagaka baseware ghost instance kernel */

var GhostKernel = exports.GhostKernel = function (_RoutableComponent) {
  _inherits(GhostKernel, _RoutableComponent);

  /**
   * constructor
   * @param {Object<EventEmitter>} components components
   * @param {Shiorif} components.Shiorif SHIORI interface
   * @param {Shell} components.View Shell interface
   * @param {SakuraScriptRunner} components.SakuraScriptRunner SakuraScript Runner
   * @param {NamedKernelManager} components.NamedKernelManager Named Kernel Manager
   * @param {TimerEventSource} components.TimerEventSource Timer event source
   * @param {RoutableComponentRoutes} [routes] ルーティング
   * @param {Object<class<GhostKernelController>>} [controller_classes] コントローラ
   */

  function GhostKernel(components) {
    var routes = arguments.length <= 1 || arguments[1] === undefined ? new _routableComponent.RoutableComponentRoutes(GhostKernelRoutings) : arguments[1];
    var controller_classes = arguments.length <= 2 || arguments[2] === undefined ? GhostKernelControllers : arguments[2];

    _classCallCheck(this, GhostKernel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GhostKernel).call(this, components, routes, controller_classes));

    _this.register_component('GhostKernel', _this);
    return _this;
  }

  /**
   * start kernel (emits start event)
   * @return {void}
   */


  _createClass(GhostKernel, [{
    key: 'start',
    value: function start() {
      this.emit('start');
    }

    /**
     * emits protocol version fixed event
     * @return {void}
     */

  }, {
    key: 'protocol_version_fixed',
    value: function protocol_version_fixed() {
      this.emit('protocol_version_fixed');
    }

    /**
     * emits close event
     * @return {void}
     */

  }, {
    key: 'close',
    value: function close() {
      this.emit('close');
    }
  }]);

  return GhostKernel;
}(_routableComponent.RoutableComponent);

/**
 * カーネル用のコントローラ
 * @implements {RoutableComponentController}
 */


var GhostKernelController = exports.GhostKernelController = function () {
  /**
   * コンストラクタ
   * @param {GhostKernel} kernel カーネル
   */

  function GhostKernelController(kernel) {
    _classCallCheck(this, GhostKernelController);

    this._kernel = kernel;
  }

  /**
   * カーネル
   * @type {GhostKernel}
   */


  _createClass(GhostKernelController, [{
    key: 'kernel',
    get: function get() {
      return this._kernel;
    }
  }]);

  return GhostKernelController;
}();
//# sourceMappingURL=ghost-kernel.js.map
