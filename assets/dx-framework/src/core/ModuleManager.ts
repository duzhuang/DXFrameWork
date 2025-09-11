import IModule from "./IModule";

export default class ModuleManager {

    private static m_instance: ModuleManager | null = null;
    public static get instance(): ModuleManager {
        if (this.m_instance == null) {
            this.m_instance = new ModuleManager();
        }
        return this.m_instance;
    }

    private constructor() {

    }

    /**模块记录表 */
    private m_modules: Map<string, IModule> = new Map<string, IModule>();
    /**是否已经启动 */
    private m_isStarted: boolean = false;


    /**
     * 注册模块
     * @param token 模块名称
     * @param ctor 模块构造函数
     */
    public registerModuleByConstructor<T extends { new(...args: any[]): IModule }>(token: string, ctor: T): void {
        if (this.m_modules.has(token)) {
            console.warn("模块已注册", token);
            return;
        }

        const module = new ctor();
        this.m_modules.set(token, module);
    }

    /**
     * 注册模块
     * @param name 模块名称
     * @param module 模块实例
     */
    public registerModule(name: string, module: IModule): void {
        if (this.m_modules.has(name)) {
            console.warn("模块已注册", name);
            return;
        }

        this.m_modules.set(module.constructor.name, module);
        module.onInit && module.onInit();

        // 模块初始化完成后，调用 onStart 方法
        if (this.m_isStarted) {
            module.onStart && module.onStart();
        }
    }

    /**
     * 注销模块
     * @param name 模块名称
     */
    public unregisterModule(name: string): void {
        if (!this.m_modules.has(name)) {
            console.warn("模块未注册", name);
            return;
        }

        const module = this.m_modules.get(name);
        module.onDestroy && module.onDestroy();
        this.m_modules.delete(name);
    }

    /**
     * 在引用主入口调用，一次触发所有模块 start
     */
    public startAll() {
        this.m_isStarted = true;
        this.m_modules.forEach(module => {
            module.onStart && module.onStart();
        });
    }

    /**
     * 每帧调用，一次触发所有模块 update
     * @param dt  delta time
     */
    public updateAll(dt: number) {
        this.m_modules.forEach(module => {
            module.onUpdate && module.onUpdate(dt);
        });
    }

    public destroyAll() {
        this.m_modules.forEach(module => {
            module.onDestroy && module.onDestroy();
        });
        this.m_modules.clear();
        this.m_isStarted = false;
    }

    public getModule<T extends IModule>(token: string): T {
        return this.m_modules.get(token) as T;
    }

    public getAllModules(): Map<string, IModule> {
        return this.m_modules;
    }
}