import RedDotNode from "./RedDotNode";
import { IRedDotConfig } from "./types";
import Module from "../../../core/Module";
import IModules from "../../../core/IModules";

//红点系统
@Module("RedDotSystem")
export default class RedDotSystem implements IModules {
    //单例类
    private static m_instance: RedDotSystem | null = null;
    public static get instance(): RedDotSystem {
        if (this.m_instance === null) {
            this.m_instance = new RedDotSystem();
        }
        return this.m_instance;
    }
    /**根节点 */
    private m_root: RedDotNode | null = null;
    /**节点字典 */
    private m_nodes: Map<string, RedDotNode> = new Map();
    /**脏节点集合 */
    private m_dirtyNodes: Set<RedDotNode> = new Set();
    /**更新调度标志 */
    private m_updateSchedule: boolean = false;

    public constructor() {
        this.m_root = new RedDotNode("root");
        this.m_nodes.set("root", this.m_root);
    }

    // -- IModules 接口 -- //

    /** 初始化阶段（可在此读取配置） */
    public onInit(): void {

    }

    /**启动阶段（场景启动后启动） */
    public onStart(): void {

    }

    /**每帧调用 */
    public onUpdate(dt: number): void {

    }

    /**销毁阶段（场景切换或热重载前调用） */
    public onDestroy(): void {
        this.m_nodes.clear();
        this.m_dirtyNodes.clear();
        this.m_updateSchedule = false;
        this.m_root = new RedDotNode('root');
        this.m_nodes.set('root', this.m_root);
    }


    // —— RedDotSystem 专属方法 —— //

    /**
     * 初始化
     * @param config 红点配置
     */
    public init(config: IRedDotConfig) {
        // 对config进行递归遍历，注册红点节点
        this.traverseDFS(config)

    }

    /**
     * 深度优先遍历
     * @param config 红点配置
     * @param parentKey 父节点key 默认为root
     */
    private traverseDFS(config: IRedDotConfig, parentKey?: string) {
        const { key, children } = config;
        this.registerNode(key, parentKey);
        if (children) {
            for (const child of children) {
                this.traverseDFS(child, key);
            }
        }
    }


    /**
     * 注册红点节点
     * @param key 节点key
     * @param parentKey 父节点key 默认为root
     * @returns 红点节点
     */
    public registerNode(key: string, parentKey?: string): RedDotNode | undefined {
        if (this.m_nodes.has(key)) {
            return this.m_nodes.get(key);
        }

        const redDotNode: RedDotNode = new RedDotNode(key);
        this.m_nodes.set(key, redDotNode);

        //如果没有指定父节点，默认添加到根节点
        const parent = parentKey ? this.m_nodes.get(parentKey) : this.m_root;
        if (parent) {
            parent.addChild(redDotNode);
        }
        return redDotNode;
    }

    /**获取节点 */
    public getNode(key: string): RedDotNode | undefined {
        return this.m_nodes.get(key);
    }

    /**设置值 */
    public setValue(key: string, value: number) {
        const redDotNode = this.getNode(key);
        if (redDotNode) {
            redDotNode.setValue(value);
            this.scheduleUpdate();
        }
    }

    /**
     * 添加脏节点
     * @param node 脏节点
     */
    public addDirtyNode(node: RedDotNode) {
        this.m_dirtyNodes.add(node);
        this.scheduleUpdate();
    }

    /**批量更新 */
    private scheduleUpdate(): void {
        if (this.m_updateSchedule) return;
        this.m_updateSchedule = true;
        setTimeout(() => {
            this.batchUpdate();
        }, 0);
    }

    private batchUpdate(): void {
        this.m_updateSchedule = false;
        if (this.m_dirtyNodes.size == 0) return;

        // 收集需要通知的节点
        const nodesToNotify: RedDotNode[] = [];

        // 按照层级排序，确保先更新子节点再更新父节点
        const sortedDirtyNodes = Array.from(this.m_dirtyNodes).sort((a, b) => {
            return b.getKey().split('_').length - a.getKey().split('_').length;
        });

        // 过滤掉根节点
        const nonRootNodes = sortedDirtyNodes.filter(node => node !== this.m_root);

        // 如果根节点存在，添加到末尾        
        nonRootNodes.push(this.m_root!);

        // 更新所有脏节点
        nonRootNodes.forEach(node => {
            if (node.updateValue()) {
                //console.log(`更新节点: ${node.getKey()}`);
                //console.log(`节点 ${node.getKey()} 更新后的值: ${node.getValue()}`);
                nodesToNotify.push(node);
            }
        });

        // 清空脏节点集合
        this.m_dirtyNodes.clear();

        // 通知所有需要通知的节点
        nodesToNotify.forEach(node => {
            node.notifyListeners();
        });
    }

    /**
     * 增加值
     * @param key 节点key
     * @param value 增加值
     */
    public increment(key: string, value: number = 1): void {
        const redDotNode = this.getNode(key);
        if (redDotNode) {
            const oldValue = redDotNode.getValue();
            redDotNode.setValue(oldValue + value);
        }
    }

    /**
     * 减少值
     * @param key 节点key
     * @param value 减少值
     */
    public decrement(key: string, value: number = 1): void {
        const redDotNode = this.getNode(key);
        if (redDotNode) {
            const oldValue = redDotNode.getValue();
            const newVaule = (oldValue - value) >= 0 ? (oldValue - value) : 0;
            redDotNode.setValue(newVaule);
        }
    }

    /**
     * 获取值
     * @param key 节点key
     * @returns 节点值
     */
    public getValue(key: string): number {
        const redDotNode = this.getNode(key);
        if (redDotNode) {
            return redDotNode.getValue();
        }
        return 0;
    }

    /**
     * 添加值监听器
     * @param key 节点key
     * @param listener 值监听器
     */
    public addListener(key: string, listener: Function) {
        const redDotNode = this.getNode(key);
        if (redDotNode) {
            redDotNode.addListener(listener);
        }
    }

    /**
     * 移除值监听器
     * @param key 节点key
     * @param listener 值监听器
     */
    public removeListener(key: string, listener: Function) {
        const redDotNode = this.getNode(key);
        if (redDotNode) {
            redDotNode.removeListener(listener);
        }
    }

    /**强制立即更新 */
    public forceUpdate() {
        this.batchUpdate();
    }
}