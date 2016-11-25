import {
  EventController,
  EventRoutes,
  EventRoutingConstructor,
  LazyEventRouter,
} from "lazy-event-router";
import {Operation} from "./operation";

/**
 * ルーティング設定クラスのリスト
 * @type {RoutableComponentRouting[]}
 */
export const GhostKernelRoutings: EventRoutingConstructor[] = [];

/** Ukagaka baseware ghost instance kernel */
export class GhostKernel extends LazyEventRouter {
  /**
   * constructor
   * @param components components
   * @param routes ルーティング
   */
  constructor(components: any[] = [], routes = new EventRoutes(GhostKernelRoutings)) {
    super(components, routes);
    this.registerComponent(new Operation(this));
  }

  /** カーネルの操作 */
  get operation() { return this.component(Operation); }
}

/**
 * カーネル用のコントローラ
 */
export class GhostKernelController implements EventController {
  /** カーネル */
  protected readonly kernel: GhostKernel;

  /**
   * コンストラクタ
   * @param kernel カーネル
   */
  constructor(kernel: GhostKernel) {
    this.kernel = kernel;
  }
}
