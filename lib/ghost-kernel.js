/* (C) 2016 Narazaka : Licensed under The MIT License - https://narazaka.net/license/MIT?2016 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GhostKernelController = exports.GhostKernel = exports.GhostKernelControllers = exports.GhostKernelRoutings = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _routableComponent = require('routable-component');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  (0, _inherits3.default)(GhostKernel, _RoutableComponent);

  /**
   * constructor
   * @param {Object<EventEmitter>} components components
   * @param {Shiorif} components.Shiorif SHIORI interface
   * @param {Named} components.Named Shell Named interface
   * @param {NamedKernelManager} components.NamedKernelManager Named Kernel Manager
   * @param {TimerEventSource} components.TimerEventSource Timer event source
   * @param {RoutableComponentRoutes} [routes] ルーティング
   * @param {Object<class<GhostKernelController>>} [controller_classes] コントローラ
   */

  function GhostKernel(components) {
    var routes = arguments.length <= 1 || arguments[1] === undefined ? new _routableComponent.RoutableComponentRoutes(GhostKernelRoutings) : arguments[1];
    var controllerClasses = arguments.length <= 2 || arguments[2] === undefined ? GhostKernelControllers : arguments[2];
    (0, _classCallCheck3.default)(this, GhostKernel);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(GhostKernel).call(this, components, routes, controllerClasses));

    _this.registerComponent('GhostKernel', _this);
    return _this;
  }

  /**
   * start kernel (emits start event)
   * @return {void}
   */


  (0, _createClass3.default)(GhostKernel, [{
    key: 'start',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.components.NanikaStorage.ghost_descript(this.namedId);

              case 2:
                this._ghostDescript = _context.sent;

                this._namedId = this.components.NamedKernelManager.namedId(this);
                this.emit('start');

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function start() {
        return _ref.apply(this, arguments);
      }

      return start;
    }()

    /**
     * emits change_shell event
     * @param {string} shellname シェル名
     * @return {void}
     */

  }, {
    key: 'changeShell',
    value: function changeShell(shellname) {
      this.emit('change_shell', shellname);
    }

    /**
     * emits change_balloon event
     * @param {string} balloonname バルーン名
     * @return {void}
     */

  }, {
    key: 'changeBalloon',
    value: function changeBalloon(balloonname) {
      this.emit('change_balloon', balloonname);
    }

    /**
     * emits close event
     * @param {string} reason 理由
     * @param {boolean} all OnCloseAllにあたるならtrue
     * @return {void}
     */

  }, {
    key: 'close',
    value: function close(reason, all) {
      this.emit('close', reason, all);
    }

    /**
     * emits halt event
     * @param {string} reason 理由
     * @return {void}
     */

  }, {
    key: 'halt',
    value: function halt(reason) {
      this.emit('halt', reason);
    }
  }, {
    key: 'profile',
    value: function profile(newProfile) {
      return this.components.NanikaStorage.ghost_profile(this.namedId, newProfile);
    }
  }, {
    key: 'namedId',
    get: function get() {
      return this._namedId;
    }
  }, {
    key: 'ghostDescript',
    get: function get() {
      return this._ghostDescript;
    }
  }, {
    key: 'shellDescript',
    get: function get() {
      return this.components.Named.shell.descript;
    }
  }, {
    key: 'balloonDescript',
    get: function get() {
      return this.components.Named.balloon.descript;
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
    (0, _classCallCheck3.default)(this, GhostKernelController);

    this._kernel = kernel;
  }

  /**
   * カーネル
   * @type {GhostKernel}
   */


  (0, _createClass3.default)(GhostKernelController, [{
    key: 'kernel',
    get: function get() {
      return this._kernel;
    }
  }]);
  return GhostKernelController;
}();
//# sourceMappingURL=ghost-kernel.js.map
