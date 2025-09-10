import RedDotSystem from "./RedDotSystem";
//RedDotNode.ts
var RedDotNode = /** @class */ (function () {
    /**
     * 构造函数
     * @param key 节点唯一标识
     */
    function RedDotNode(key) {
        /**节点值 */
        this.m_value = 0;
        /**父节点 */
        this.m_parent = null;
        /**子节点 */
        this.m_children = [];
        /**值监听器 */
        this.m_listeners = [];
        /**是否脏数据 */
        this.m_isDirty = false;
        this.m_key = key;
    }
    /**
     * 获取节点唯一标识
     * @returns 节点唯一标识
     */
    RedDotNode.prototype.getKey = function () {
        return this.m_key;
    };
    /**
     * 添加子节点
     * @param child 子节点
     */
    RedDotNode.prototype.addChild = function (child) {
        if (!child) {
            console.error('RedDotNode addChild child is null');
            return;
        }
        if (this.m_children.includes(child))
            return;
        this.m_children.push(child);
        child.m_parent = this;
    };
    /**
     * 移除子节点
     * @param child 子节点
     */
    RedDotNode.prototype.removeChild = function (child) {
        if (!this.m_children) {
            console.error('RedDotNode removeChild children is null');
            return;
        }
        var index = this.m_children.indexOf(child);
        if (index == -1)
            return;
        this.m_children.splice(index, 1);
    };
    /**
     * 设置父节点
     * @param parent 父节点
     */
    RedDotNode.prototype.setParent = function (parent) {
        if (!parent) {
            console.error('RedDotNode setValue parent is null');
            return;
        }
        this.m_parent = parent;
    };
    /**
     * 获取父节点
     * @returns 父节点
     */
    RedDotNode.prototype.getParent = function () {
        return this.m_parent;
    };
    /**
     * 设置节点值
     * @param value 节点值
     */
    RedDotNode.prototype.setValue = function (value) {
        if (this.m_children.length > 0) {
            console.warn("\u975E\u53F6\u5B50\u8282\u70B9\u4E0D\u5E94\u76F4\u63A5\u8BBE\u7F6E\u503C: ".concat(this.m_key));
            return;
        }
        if (this.m_value === value)
            return;
        this.m_value = value;
        this.makeDirty();
    };
    /**
     * 标记节点脏数据
     */
    RedDotNode.prototype.makeDirty = function () {
        if (this.m_isDirty)
            return;
        this.m_isDirty = true;
        // 获取红点系统实例并添加脏节点
        var redDotSystem = RedDotSystem.instance;
        redDotSystem.addDirtyNode(this);
        // 通知父节点更新
        if (this.m_parent) {
            this.m_parent.makeDirty();
        }
    };
    /**
     * 更新节点值
     * @returns 是否更新成功
     */
    RedDotNode.prototype.updateValue = function () {
        if (!this.m_isDirty)
            return false;
        //叶子节点不需要计算，直接返回
        if (this.m_children.length === 0) {
            this.m_isDirty = false;
            return true;
        }
        var oldValue = this.m_value;
        this.m_value = this.m_children.reduce(function (sum, child) { return sum + child.getValue(); }, 0);
        this.m_isDirty = false;
        return oldValue !== this.m_value;
    };
    /**
     * 获取节点值
     * @returns 节点值
     */
    RedDotNode.prototype.getValue = function () {
        return this.m_value;
    };
    /**
     * 从子节点更新值
     */
    RedDotNode.prototype.updateFromChildren = function () {
        var newVaule = 0;
        for (var _i = 0, _a = this.m_children; _i < _a.length; _i++) {
            var child = _a[_i];
            newVaule += child.getValue();
        }
        this.setValue(newVaule);
    };
    /**
     * 添加值监听器
     * @param listener 值监听器
     */
    RedDotNode.prototype.addListener = function (listener) {
        if (!listener) {
            console.error('RedDotNode addListener listener is null');
            return;
        }
        if (this.m_listeners.includes(listener))
            return;
        this.m_listeners.push(listener);
    };
    /**
     * 移除值监听器
     * @param listener 值监听器
     */
    RedDotNode.prototype.removeListener = function (listener) {
        if (!this.m_listeners) {
            console.error('RedDotNode removeListener listeners is null');
            return;
        }
        var index = this.m_listeners.indexOf(listener);
        if (index == -1)
            return;
        this.m_listeners.splice(index, 1);
    };
    /**
     * 通知值监听器
     */
    RedDotNode.prototype.notifyListeners = function () {
        var _this = this;
        if (!this.m_listeners)
            return;
        this.m_listeners.forEach(function (listener) { return listener(_this.m_value); });
    };
    return RedDotNode;
}());
export default RedDotNode;
