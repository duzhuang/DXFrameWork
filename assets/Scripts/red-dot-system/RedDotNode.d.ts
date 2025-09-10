export default class RedDotNode {
    /**节点唯一标识 */
    private readonly m_key;
    /**节点值 */
    private m_value;
    /**父节点 */
    private m_parent;
    /**子节点 */
    private m_children;
    /**值监听器 */
    private m_listeners;
    /**是否脏数据 */
    private m_isDirty;
    /**
     * 构造函数
     * @param key 节点唯一标识
     */
    constructor(key: string);
    /**
     * 获取节点唯一标识
     * @returns 节点唯一标识
     */
    getKey(): string;
    /**
     * 添加子节点
     * @param child 子节点
     */
    addChild(child: RedDotNode): void;
    /**
     * 移除子节点
     * @param child 子节点
     */
    removeChild(child: RedDotNode): void;
    /**
     * 设置父节点
     * @param parent 父节点
     */
    setParent(parent: RedDotNode): void;
    /**
     * 获取父节点
     * @returns 父节点
     */
    getParent(): RedDotNode | null;
    /**
     * 设置节点值
     * @param value 节点值
     */
    setValue(value: number): void;
    /**
     * 标记节点脏数据
     */
    private makeDirty;
    /**
     * 更新节点值
     * @returns 是否更新成功
     */
    updateValue(): boolean;
    /**
     * 获取节点值
     * @returns 节点值
     */
    getValue(): number;
    /**
     * 从子节点更新值
     */
    updateFromChildren(): void;
    /**
     * 添加值监听器
     * @param listener 值监听器
     */
    addListener(listener: Function): void;
    /**
     * 移除值监听器
     * @param listener 值监听器
     */
    removeListener(listener: Function): void;
    /**
     * 通知值监听器
     */
    notifyListeners(): void;
}
