var ModuleManager = /** @class */ (function () {
    function ModuleManager() {
        /**模块记录 */
        this.m_modules = new Map();
        /**是否开始 */
        this.m_isStarted = false;
    }
    Object.defineProperty(ModuleManager, "instance", {
        get: function () {
            if (this.m_instance === null) {
                this.m_instance = new ModuleManager();
            }
            return this.m_instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 注册模块化实例
     * @param name 模块名
     * @param module 模块实例
     */
    ModuleManager.prototype.registerModule = function (name, module) {
        if (this.m_modules.has(name))
            return;
        this.m_modules.set(name, module);
        module.onInit && module.onInit();
        //如果已过 onStart 阶段，新注册的可立即执行 onStart
        if (this.m_isStarted) {
            module.onStart && module.onStart();
        }
    };
    /**
     * 注销模块
     * @param name 模块名
     */
    ModuleManager.prototype.unregisterModule = function (name) {
        if (!this.m_modules.has(name))
            return;
        var module = this.m_modules.get(name);
        module.onDestroy && module.onDestroy();
        this.m_modules.delete(name);
    };
    /**
     * 启动所有模块
     * 在应用主入口调用，一次触发所有模块的 onStart
     */
    ModuleManager.prototype.startAll = function () {
        if (this.m_isStarted)
            return;
        this.m_isStarted = true;
        this.m_modules.forEach(function (module) {
            module.onStart && module.onStart();
        });
    };
    /**
     * 每帧更新所有模块
     * @param dt  delta time
     */
    ModuleManager.prototype.updateAll = function (dt) {
        this.m_modules.forEach(function (module) {
            module.onUpdate && module.onUpdate(dt);
        });
    };
    /**
     * 销毁所有模块
     * 场景切换 或 热重载前，依次销毁所有模块
     */
    ModuleManager.prototype.destroyAll = function () {
        this.m_modules.forEach(function (module) {
            module.onDestroy && module.onDestroy();
        });
        this.m_modules.clear();
        this.m_isStarted = false;
    };
    ModuleManager.m_instance = null;
    return ModuleManager;
}());
export default ModuleManager;
