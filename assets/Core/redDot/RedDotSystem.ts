import RedDotNode from "./RedDotNode";
import IRedDotConfig from "./IRedDotConfig";

//红点系统
export default class RedDotSystem {
    //单例类
    private static m_instance: RedDotSystem = null;
    public static get instance(): RedDotSystem {
        if (!this.m_instance) {
            this.m_instance = new RedDotSystem();
        }
        return this.m_instance;
    }
    /**根节点 */
    private m_root: RedDotNode = null;
    /**节点字典 */
    private m_nodes: Map<string, RedDotNode> = new Map();

    private constructor() {
        this.m_root = new RedDotNode("root");
        this.m_nodes.set("root", this.m_root);
    }

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
        for (const child of children) {
            this.traverseDFS(child, key);
        }
    }



    /**
     * 注册红点节点
     * @param key 节点key
     * @param parentKey 父节点key 默认为root
     * @returns 红点节点
     */
    public registerNode(key: string, parentKey?: string): RedDotNode {
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
    public getNode(key: string): RedDotNode {
        return this.m_nodes.get(key);
    }

    /**设置值 */
    public setValue(key: string, value: number) {
        const redDotNode = this.getNode(key);
        if (redDotNode) {
            redDotNode.setValue(value);
        }
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
}