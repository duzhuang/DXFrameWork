
//RedDotNode.ts
export default class RedDotNode {
    /**节点唯一标识 */
    private key: string;
    /**节点值 */
    private value: number = 0;
    /**父节点 */
    private parent: RedDotNode | null = null;
    /**子节点 */
    private children: RedDotNode[] = [];
    /**值监听器 */
    private listeners: Function[] = [];

    /**
     * 构造函数
     * @param key 节点唯一标识
     */
    public constructor(key: string) {
        this.key = key;
    }


    /**
     * 获取节点唯一标识
     * @returns 节点唯一标识
     */
    public getKey(): string {
        return this.key;
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
        if (this.children.includes(child)) return;
        this.children.push(child);
        child.parent = this;
    }

    /**
     * 移除子节点
     * @param child 子节点
     */
    public removeChild(child: RedDotNode): void {
        if (!this.children) {
            console.error('RedDotNode removeChild children is null');
            return;
        }
        let index: number = this.children.indexOf(child);
        if (index == -1) return;
        this.children.splice(index, 1);
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
        this.parent = parent;
    }

    /**
     * 获取父节点
     * @returns 父节点
     */
    public getParent(): RedDotNode | null {
        return this.parent;
    }

    /**
     * 设置节点值
     * @param value 节点值
     */
    public setValue(value: number): void {
        if (this.value == value) return;
        this.value = value;
        this.notifyListeners();
        if (this.parent) {
            this.parent.updateFromChildren();
        }
    }

    /**
     * 获取节点值
     * @returns 节点值
     */
    public getValue(): number {
        return this.value;
    }

    /**
     * 从子节点更新值
     */
    public updateFromChildren(): void {
        let newVaule: number = 0;
        for (const child of this.children) {
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
        if (this.listeners.includes(listener)) return;

        this.listeners.push(listener);
    }

    /**
     * 移除值监听器
     * @param listener 值监听器
     */
    public removeListener(listener: Function): void {
        if (!this.listeners) {
            console.error('RedDotNode removeListener listeners is null');
            return;
        }
        let index: number = this.listeners.indexOf(listener);
        if (index == -1) return;
        this.listeners.splice(index, 1);
    }

    /**
     * 通知值监听器
     */
    private notifyListeners(): void {
        if (!this.listeners) return;
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i](this.value);
        }
    }
}