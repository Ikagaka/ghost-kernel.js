import {RoutableComponent, RoutableComponentRoutes} from 'routable-component';

/**
 * ルーティング設定クラスのリスト
 * @type {RoutableComponentRouting[]}
 */
export const GhostKernelRoutings = [];

/**
 * コントローラクラスの連想配列
 * @type {Object<GhostKernelController>}
 */
export const GhostKernelControllers = {};

/** Ukagaka baseware ghost instance kernel */
export class GhostKernel extends RoutableComponent {
  /**
   * constructor
   * @param {Object<EventEmitter>} components components
   * @param {Shiorif} components.Shiorif SHIORI interface
   * @param {Shell} components.View Shell interface
   * @param {NamedKernelManager} components.NamedKernelManager Named Kernel Manager
   * @param {TimerEventSource} components.TimerEventSource Timer event source
   * @param {RoutableComponentRoutes} [routes] ルーティング
   * @param {Object<class<GhostKernelController>>} [controller_classes] コントローラ
   */
  constructor(components, routes = new RoutableComponentRoutes(GhostKernelRoutings), controllerClasses = GhostKernelControllers) {
    super(components, routes, controllerClasses);
    this.registerComponent('GhostKernel', this);
  }

  /**
   * start kernel (emits start event)
   * @return {void}
   */
  start() {
    this.emit('start');
  }

  /**
   * emits protocol version fixed event
   * @return {void}
   */
  protocol_version_fixed() {
    this.emit('protocol_version_fixed');
  }

  /**
   * emits close event
   * @return {void}
   */
  close() {
    this.emit('close');
  }
}

/**
 * カーネル用のコントローラ
 * @implements {RoutableComponentController}
 */
export class GhostKernelController {
  /**
   * コンストラクタ
   * @param {GhostKernel} kernel カーネル
   */
  constructor(kernel) {
    this._kernel = kernel;
  }

  /**
   * カーネル
   * @type {GhostKernel}
   */
  get kernel() { return this._kernel; }
}
