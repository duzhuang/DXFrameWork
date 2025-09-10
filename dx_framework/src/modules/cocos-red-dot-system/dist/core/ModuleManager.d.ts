import IModules from "./IModules";
export default class ModuleManager {
    private static m_instance;
    static get instance(): ModuleManager;
    private constructor();
    /**模块记录 */
    private m_modules;
    /**是否开始 */
    private m_isStarted;
    /**
     * 注册模块化实例
     * @param name 模块名
     * @param module 模块实例
     */
    registerModule(name: string, module: IModules): void;
    /**
     * 注销模块
     * @param name 模块名
     */
    unregisterModule(name: string): void;
    /**
     * 启动所有模块
     * 在应用主入口调用，一次触发所有模块的 onStart
     */
    startAll(): void;
    /**
     * 每帧更新所有模块
     * @param dt  delta time
     */
    updateAll(dt: number): void;
    /**
     * 销毁所有模块
     * 场景切换 或 热重载前，依次销毁所有模块
     */
    destroyAll(): void;
}
