/**
 * 模块接口
 * 定义了模块的生命周期方法
 */
export default interface IModule {
    /** 在全局环境可用后立即调用，用于解析配置、建立数据结构 */
    onInit?(): void;

    /** 在第一个场景启动后调用，用于绑定 UI、启动逻辑 */
    onStart?(): void;

    /** 每帧调用，用于驱动定时、状态机等 */
    onUpdate?(dt: number): void;

    /** 场景切换或热重载前调用，用于反注册回调、清理定时器 */
    onDestroy?(): void;
}
