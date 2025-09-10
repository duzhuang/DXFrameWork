import IModules from "./IModules";

export default class ModuleManager {

    private static m_instance: ModuleManager | null = null;
    public static get instance(): ModuleManager {
        if (this.m_instance === null) {
            this.m_instance = new ModuleManager();
        }
        return this.m_instance;
    }

    private constructor() { }

    /**模块记录 */
    private m_modules: Map<string, IModules> = new Map<string, IModules>();
    /**是否开始 */
    private m_isStarted: boolean = false;

    /** 
     * 注册模块化实例
     * @param name 模块名
     * @param module 模块实例
     */
    public registerModule(name: string, module: IModules): void {
        if (this.m_modules.has(name)) return;
        this.m_modules.set(name, module);
        module.onInit && module.onInit();
        //如果已过 onStart 阶段，新注册的可立即执行 onStart
        if (this.m_isStarted) {
            module.onStart && module.onStart();
        }
    }

    /**
     * 注销模块
     * @param name 模块名
     */
    public unregisterModule(name: string): void {
        if (!this.m_modules.has(name)) return;
        const module = this.m_modules.get(name)!;
        module.onDestroy && module.onDestroy();
        this.m_modules.delete(name);
    }

    /**
     * 启动所有模块
     * 在应用主入口调用，一次触发所有模块的 onStart
     */
    public startAll() {
        if (this.m_isStarted) return;
        this.m_isStarted = true;
        this.m_modules.forEach((module) => {
            module.onStart && module.onStart();
        })
    }

    /**
     * 每帧更新所有模块
     * @param dt  delta time
     */
    public updateAll(dt: number) {
        this.m_modules.forEach((module) => {
            module.onUpdate && module.onUpdate(dt);
        })
    }

    /**
     * 销毁所有模块
     * 场景切换 或 热重载前，依次销毁所有模块
     */
    public destroyAll() {
        this.m_modules.forEach((module) => {
            module.onDestroy && module.onDestroy();
        })
        this.m_modules.clear();
        this.m_isStarted = false;
    }

}