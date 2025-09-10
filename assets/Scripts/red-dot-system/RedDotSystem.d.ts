import RedDotNode from "./RedDotNode";
import { IRedDotConfig } from "./types";
import IModules from "./core/IModules";
export default class RedDotSystem implements IModules {
    private static m_instance;
    static get instance(): RedDotSystem;
    /**根节点 */
    private m_root;
    /**节点字典 */
    private m_nodes;
    /**脏节点集合 */
    private m_dirtyNodes;
    /**更新调度标志 */
    private m_updateSchedule;
    constructor();
    /** 初始化阶段（可在此读取配置） */
    onInit(): void;
    /**启动阶段（场景启动后启动） */
    onStart(): void;
    /**每帧调用 */
    onUpdate(dt: number): void;
    /**销毁阶段（场景切换或热重载前调用） */
    onDestroy(): void;
    /**
     * 初始化
     * @param config 红点配置
     */
    init(config: IRedDotConfig): void;
    /**
     * 深度优先遍历
     * @param config 红点配置
     * @param parentKey 父节点key 默认为root
     */
    private traverseDFS;
    /**
     * 注册红点节点
     * @param key 节点key
     * @param parentKey 父节点key 默认为root
     * @returns 红点节点
     */
    registerNode(key: string, parentKey?: string): RedDotNode | undefined;
    /**获取节点 */
    getNode(key: string): RedDotNode | undefined;
    /**设置值 */
    setValue(key: string, value: number): void;
    /**
     * 添加脏节点
     * @param node 脏节点
     */
    addDirtyNode(node: RedDotNode): void;
    /**批量更新 */
    private scheduleUpdate;
    private batchUpdate;
    /**
     * 增加值
     * @param key 节点key
     * @param value 增加值
     */
    increment(key: string, value?: number): void;
    /**
     * 减少值
     * @param key 节点key
     * @param value 减少值
     */
    decrement(key: string, value?: number): void;
    /**
     * 获取值
     * @param key 节点key
     * @returns 节点值
     */
    getValue(key: string): number;
    /**
     * 添加值监听器
     * @param key 节点key
     * @param listener 值监听器
     */
    addListener(key: string, listener: Function): void;
    /**
     * 移除值监听器
     * @param key 节点key
     * @param listener 值监听器
     */
    removeListener(key: string, listener: Function): void;
    /**强制立即更新 */
    forceUpdate(): void;
}
