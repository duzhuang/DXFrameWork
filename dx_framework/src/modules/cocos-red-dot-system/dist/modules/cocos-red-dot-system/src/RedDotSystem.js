var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import RedDotNode from "./RedDotNode";
import Module from "../../../core/Module";
//红点系统
var RedDotSystem = /** @class */ (function () {
    function RedDotSystem() {
        /**根节点 */
        this.m_root = null;
        /**节点字典 */
        this.m_nodes = new Map();
        /**脏节点集合 */
        this.m_dirtyNodes = new Set();
        /**更新调度标志 */
        this.m_updateSchedule = false;
        this.m_root = new RedDotNode("root");
        this.m_nodes.set("root", this.m_root);
    }
    RedDotSystem_1 = RedDotSystem;
    Object.defineProperty(RedDotSystem, "instance", {
        get: function () {
            if (this.m_instance === null) {
                this.m_instance = new RedDotSystem_1();
            }
            return this.m_instance;
        },
        enumerable: false,
        configurable: true
    });
    // -- IModules 接口 -- //
    /** 初始化阶段（可在此读取配置） */
    RedDotSystem.prototype.onInit = function () {
    };
    /**启动阶段（场景启动后启动） */
    RedDotSystem.prototype.onStart = function () {
    };
    /**每帧调用 */
    RedDotSystem.prototype.onUpdate = function (dt) {
    };
    /**销毁阶段（场景切换或热重载前调用） */
    RedDotSystem.prototype.onDestroy = function () {
        this.m_nodes.clear();
        this.m_dirtyNodes.clear();
        this.m_updateSchedule = false;
        this.m_root = new RedDotNode('root');
        this.m_nodes.set('root', this.m_root);
    };
    // —— RedDotSystem 专属方法 —— //
    /**
     * 初始化
     * @param config 红点配置
     */
    RedDotSystem.prototype.init = function (config) {
        // 对config进行递归遍历，注册红点节点
        this.traverseDFS(config);
    };
    /**
     * 深度优先遍历
     * @param config 红点配置
     * @param parentKey 父节点key 默认为root
     */
    RedDotSystem.prototype.traverseDFS = function (config, parentKey) {
        var key = config.key, children = config.children;
        this.registerNode(key, parentKey);
        if (children) {
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var child = children_1[_i];
                this.traverseDFS(child, key);
            }
        }
    };
    /**
     * 注册红点节点
     * @param key 节点key
     * @param parentKey 父节点key 默认为root
     * @returns 红点节点
     */
    RedDotSystem.prototype.registerNode = function (key, parentKey) {
        if (this.m_nodes.has(key)) {
            return this.m_nodes.get(key);
        }
        var redDotNode = new RedDotNode(key);
        this.m_nodes.set(key, redDotNode);
        //如果没有指定父节点，默认添加到根节点
        var parent = parentKey ? this.m_nodes.get(parentKey) : this.m_root;
        if (parent) {
            parent.addChild(redDotNode);
        }
        return redDotNode;
    };
    /**获取节点 */
    RedDotSystem.prototype.getNode = function (key) {
        return this.m_nodes.get(key);
    };
    /**设置值 */
    RedDotSystem.prototype.setValue = function (key, value) {
        var redDotNode = this.getNode(key);
        if (redDotNode) {
            redDotNode.setValue(value);
            this.scheduleUpdate();
        }
    };
    /**
     * 添加脏节点
     * @param node 脏节点
     */
    RedDotSystem.prototype.addDirtyNode = function (node) {
        this.m_dirtyNodes.add(node);
        this.scheduleUpdate();
    };
    /**批量更新 */
    RedDotSystem.prototype.scheduleUpdate = function () {
        var _this = this;
        if (this.m_updateSchedule)
            return;
        this.m_updateSchedule = true;
        setTimeout(function () {
            _this.batchUpdate();
        }, 0);
    };
    RedDotSystem.prototype.batchUpdate = function () {
        var _this = this;
        this.m_updateSchedule = false;
        if (this.m_dirtyNodes.size == 0)
            return;
        // 收集需要通知的节点
        var nodesToNotify = [];
        // 按照层级排序，确保先更新子节点再更新父节点
        var sortedDirtyNodes = Array.from(this.m_dirtyNodes).sort(function (a, b) {
            return b.getKey().split('_').length - a.getKey().split('_').length;
        });
        // 过滤掉根节点
        var nonRootNodes = sortedDirtyNodes.filter(function (node) { return node !== _this.m_root; });
        // 如果根节点存在，添加到末尾        
        nonRootNodes.push(this.m_root);
        // 更新所有脏节点
        nonRootNodes.forEach(function (node) {
            if (node.updateValue()) {
                //console.log(`更新节点: ${node.getKey()}`);
                //console.log(`节点 ${node.getKey()} 更新后的值: ${node.getValue()}`);
                nodesToNotify.push(node);
            }
        });
        // 清空脏节点集合
        this.m_dirtyNodes.clear();
        // 通知所有需要通知的节点
        nodesToNotify.forEach(function (node) {
            node.notifyListeners();
        });
    };
    /**
     * 增加值
     * @param key 节点key
     * @param value 增加值
     */
    RedDotSystem.prototype.increment = function (key, value) {
        if (value === void 0) { value = 1; }
        var redDotNode = this.getNode(key);
        if (redDotNode) {
            var oldValue = redDotNode.getValue();
            redDotNode.setValue(oldValue + value);
        }
    };
    /**
     * 减少值
     * @param key 节点key
     * @param value 减少值
     */
    RedDotSystem.prototype.decrement = function (key, value) {
        if (value === void 0) { value = 1; }
        var redDotNode = this.getNode(key);
        if (redDotNode) {
            var oldValue = redDotNode.getValue();
            var newVaule = (oldValue - value) >= 0 ? (oldValue - value) : 0;
            redDotNode.setValue(newVaule);
        }
    };
    /**
     * 获取值
     * @param key 节点key
     * @returns 节点值
     */
    RedDotSystem.prototype.getValue = function (key) {
        var redDotNode = this.getNode(key);
        if (redDotNode) {
            return redDotNode.getValue();
        }
        return 0;
    };
    /**
     * 添加值监听器
     * @param key 节点key
     * @param listener 值监听器
     */
    RedDotSystem.prototype.addListener = function (key, listener) {
        var redDotNode = this.getNode(key);
        if (redDotNode) {
            redDotNode.addListener(listener);
        }
    };
    /**
     * 移除值监听器
     * @param key 节点key
     * @param listener 值监听器
     */
    RedDotSystem.prototype.removeListener = function (key, listener) {
        var redDotNode = this.getNode(key);
        if (redDotNode) {
            redDotNode.removeListener(listener);
        }
    };
    /**强制立即更新 */
    RedDotSystem.prototype.forceUpdate = function () {
        this.batchUpdate();
    };
    var RedDotSystem_1;
    //单例类
    RedDotSystem.m_instance = null;
    RedDotSystem = RedDotSystem_1 = __decorate([
        Module("RedDotSystem")
    ], RedDotSystem);
    return RedDotSystem;
}());
export default RedDotSystem;
