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

// shim
require('core-js/fn/array/iterator');
require('core-js/fn/symbol');

/**
 * ルーティング設定クラスのリスト
 * @type {RoutableComponentRouting[]}
 */
var GhostKernelRoutings = exports.GhostKernelRoutings = [];

/**
 * コントローラクラスの連想配列
 * @type {Hash<GhostKernelController>}
 */
var GhostKernelControllers = exports.GhostKernelControllers = {};

/** Ukagaka baseware ghost instance kernel */

var GhostKernel = exports.GhostKernel = function (_RoutableComponent) {
  _inherits(GhostKernel, _RoutableComponent);

  /**
   * constructor
   * @param {Object} event_source - Event source
   * @param {Shiorif} event_source.shiorif - SHIORI interface
   * @param {Shell} event_source.view - Shell interface
   * @param {SakuraScriptPlayer} event_source.ssp - Sakura Script runner
   * @param {NamedKernelManager} event_source.manager - Named Kernel Manager
   * @param {TimerEventSource} event_source.time - Timer event source
   * @param {RoutableComponentRoutes} [routes] - ルーティング
   * @param {Hash<GhostKernelController>} [controllers] - コントローラ
   */

  function GhostKernel(event_source) {
    var routes = arguments.length <= 1 || arguments[1] === undefined ? new _routableComponent.RoutableComponentRoutes(GhostKernelRoutings) : arguments[1];
    var controllers = arguments.length <= 2 || arguments[2] === undefined ? GhostKernelControllers : arguments[2];

    _classCallCheck(this, GhostKernel);

    var shiorif = event_source.shiorif;
    var view = event_source.view;
    var ssp = event_source.ssp;
    var manager = event_source.manager;
    var time = event_source.time;

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GhostKernel).call(this));

    _this._shiorif = shiorif;
    _this._view = view;
    _this._ssp = ssp;
    _this._manager = manager;
    _this._time = time;

    _this._routes = routes;
    _this.routes.setup_to(_this, controllers);
    return _this;
  }

  /**
   * SHIORI Interface
   * @type {Shiorif}
   */


  _createClass(GhostKernel, [{
    key: 'start',


    /**
     * start kernel (emits start event)
     * @return {void}
     */
    value: function start() {
      this.emit('start');
    }

    /**
     * emits version complete event
     * @return {void}
     */

  }, {
    key: 'version_complete',
    value: function version_complete() {
      this.emit('version_complete');
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
  }, {
    key: 'shiorif',
    get: function get() {
      return this._shiorif;
    }

    /**
     * View Interface
     * @type {Shell}
     */

  }, {
    key: 'view',
    get: function get() {
      return this._view;
    }

    /**
     * Sakura Script Player
     * @type {SakuraScriptPlayer}
     */

  }, {
    key: 'ssp',
    get: function get() {
      return this._ssp;
    }

    /**
     * Kernel Manager
     * @type {NamedKernelManager}
     */

  }, {
    key: 'manager',
    get: function get() {
      return this._manager;
    }

    /**
     * Timer event source
     * @type {TimerEventSource}
     */

  }, {
    key: 'time',
    get: function get() {
      return this._time;
    }

    /**
     * Kernel
     * @type {GhostKernel} kernel
     */

  }, {
    key: 'kernel',
    get: function get() {
      return this;
    }

    /**
     * Kernel event routes
     * @type {RoutableComponentRoutes}
     */

  }, {
    key: 'routes',
    get: function get() {
      return this._routes;
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
