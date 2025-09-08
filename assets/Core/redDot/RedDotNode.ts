import RedDotSystem from "./RedDotSystem";

//RedDotNode.ts
export default class RedDotNode {
    /**节点唯一标识 */
    private readonly m_key: string;
    /**节点值 */
    private m_value: number = 0;
    /**父节点 */
    private m_parent: RedDotNode | null = null;
    /**子节点 */
    private m_children: RedDotNode[] = [];
    /**值监听器 */
    private m_listeners: Function[] = [];
    /**是否脏数据 */
    private m_isDirty: boolean = false;

    /**
     * 构造函数
     * @param key 节点唯一标识
     */
    public constructor(key: string) {
        this.m_key = key;
    }


    /**
     * 获取节点唯一标识
     * @returns 节点唯一标识
     */
    public getKey(): string {
        return this.m_key;
    }

    /**
     * 添加子节点
     * @param child 子节点
     */
    public addChild(child: RedDotNode): void {
        if (!child) {
            console.error('RedDotNode addChild child is null');
            return;
        }
        if (this.m_children.includes(child)) return;
        this.m_children.push(child);
        child.m_parent = this;
    }

    /**
     * 移除子节点
     * @param child 子节点
     */
    public removeChild(child: RedDotNode): void {
        if (!this.m_children) {
            console.error('RedDotNode removeChild children is null');
            return;
        }
        let index: number = this.m_children.indexOf(child);
        if (index == -1) return;
        this.m_children.splice(index, 1);
    }

    /**
     * 设置父节点
     * @param parent 父节点
     */
    public setParent(parent: RedDotNode): void {
        if (!parent) {
            console.error('RedDotNode setValue parent is null');
            return;
        }
        this.m_parent = parent;
    }

    /**
     * 获取父节点
     * @returns 父节点
     */
    public getParent(): RedDotNode | null {
        return this.m_parent;
    }

    /**
     * 设置节点值
     * @param value 节点值
     */
    public setValue(value: number): void {
        if (this.m_children.length > 0) {
            console.warn(`非叶子节点不应直接设置值: ${this.m_key}`);
            return;
        }
        if (this.m_value === value) return;
        this.m_value = value;
        this.makeDirty();
    }

    /**
     * 标记节点脏数据
     */
    private makeDirty(): void {
        if (this.m_isDirty) return;
        this.m_isDirty = true;

        // 获取红点系统实例并添加脏节点
        const redDotSystem = RedDotSystem.instance;
        redDotSystem.addDirtyNode(this);

        // 通知父节点更新
        if (this.m_parent) {
            this.m_parent.makeDirty();
        }
    }

    /**
     * 更新节点值
     * @returns 是否更新成功
     */
    public updateValue(): boolean {
        if (!this.m_isDirty) return false;

        //叶子节点不需要计算，直接返回
        if (this.m_children.length === 0) {
            this.m_isDirty = false;
            return true;
        }

        const oldValue: number = this.m_value;
        this.m_value = this.m_children.reduce((sum, child) => sum + child.getValue(), 0);
        this.m_isDirty = false;

        return oldValue !== this.m_value;
    }

    /**
     * 获取节点值
     * @returns 节点值
     */
    public getValue(): number {
        return this.m_value;
    }

    /**
     * 从子节点更新值
     */
    public updateFromChildren(): void {
        let newVaule: number = 0;
        for (const child of this.m_children) {
            newVaule += child.getValue();
        }
        this.setValue(newVaule);        
    }

    /**
     * 添加值监听器
     * @param listener 值监听器
     */
    public addListener(listener: Function): void {
        if (!listener) {
            console.error('RedDotNode addListener listener is null');
            return;
        }
        if (this.m_listeners.includes(listener)) return;

        this.m_listeners.push(listener);
    }

    /**
     * 移除值监听器
     * @param listener 值监听器
     */
    public removeListener(listener: Function): void {
        if (!this.m_listeners) {
            console.error('RedDotNode removeListener listeners is null');
            return;
        }
        let index: number = this.m_listeners.indexOf(listener);
        if (index == -1) return;
        this.m_listeners.splice(index, 1);
    }

    /**
     * 通知值监听器
     */
    public notifyListeners(): void {
        if (!this.m_listeners) return;
        this.m_listeners.forEach(listener=>listener(this.m_value));        
    }
}