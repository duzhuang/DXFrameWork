import { ResourceManager } from "../../resource";
import { UIAnimationComponent } from "../components/UIAnimationComponent";
import { UIBase } from "../components/UIBase";
import { UIConfig } from "../config/UIConfig";
import { LayerManager } from "../manager/LayerManager";
import { IUIWorkflow } from "./IUIWorkflow";


export class UIWorkflow implements IUIWorkflow {

    private static m_instance: UIWorkflow;
    public static get instance(): UIWorkflow {
        if (!this.m_instance) {
            this.m_instance = new UIWorkflow();
        }
        return this.m_instance;
    }

    // 打开UI
    private m_opening: Map<string, Promise<cc.Node>> = new Map();
    // 关闭UI
    private m_closing: Map<string, Promise<void>> = new Map();
    // 资源管理器
    private m_resManagerTool: ResourceManager = new ResourceManager();
    // 已激活或缓存的节点，key = UIConfig.uiID 
    private m_activeNodes: Map<string, cc.Node> = new Map();

    /**
     * 打开UI
     * @param config UI配置
     * @param data 数据
     * @returns UI节点
     */
    public async open(config: UIConfig, data?: any): Promise<cc.Node> {
        const uiID = config.uiID;

        // 1、检查是否已经上锁
        if (this.m_opening.has(uiID)) {
            return this.m_opening.get(uiID);
        }

        // 2、启动真正的打开流程
        const openPromise: Promise<cc.Node> = (async () => {
            // 已激活或缓存的节点，直接播放打开动画
            if (this.m_activeNodes.has(uiID)) {
                const node = this.m_activeNodes.get(uiID);
                const uiNode = await this.playShow(node, data);
                return uiNode;
            }

            // 未激活的节点，创建并播放打开动画
            const uiNode = await this.createNodeAndPlayShow(config, data);
            return uiNode;
        })() as Promise<cc.Node>;

        // 3、上锁
        this.m_opening.set(uiID, openPromise);

        try {
            const node = await openPromise;
            // 缓存节点
            this.m_activeNodes.set(uiID, node);
            return node;
        } finally {
            // 4、解锁
            this.m_opening.delete(uiID);
        }
    }

    /**
     * 播放打开动画
     * @param node UI节点
     * @param data 数据
     * @returns UI节点
     */
    private async playShow(node: cc.Node, data: any): Promise<cc.Node> {
        node.active = true;

        const uiBase = node.getComponent(UIBase);
        uiBase?.initialize(data);

        // 打开动画
        const uiAnimationComponent = node.getComponent(UIAnimationComponent);
        if (uiAnimationComponent && uiAnimationComponent.enabled) {
            await uiAnimationComponent.playShowAnimation();
        }

        // 打开动画执行结束
        uiBase?.onOpened();

        return node;
    }

    /**
     * 创建节点并播放打开动画
     * @param config UI配置
     * @param data 数据
     * @returns UI节点
     */
    private async createNodeAndPlayShow(config: UIConfig, data?: any): Promise<cc.Node> {
        const node = await this.acquireNode(config);
        if (!node) return null;

        // 初始化节点
        node.setPosition(cc.Vec2.ZERO);
        LayerManager.instance.getLayerNode(config.layer).addChild(node);

        // 初始化UI
        const uiBase = node.getComponent(UIBase);
        uiBase?.initialize(data);

        // 打开动画
        const uiAnimationComponent = node.getComponent(UIAnimationComponent);
        if (uiAnimationComponent && uiAnimationComponent.enabled) {
            await uiAnimationComponent.playShowAnimation();
        }

        // 打开动画执行结束
        uiBase?.onOpened();

        // 打开完成
        return node;
    }


    /**
     * 关闭UI
     * @param uiConfig UI配置
     * @param uiNode UI节点
     * @returns 是否销毁节点
     */
    public async close(uiConfig: UIConfig, uiNode: cc.Node, destroy: boolean = false): Promise<void> {
        const uiID = uiConfig.uiID;
        if (!cc.isValid(uiNode)) return;
        const node = this.m_activeNodes.get(uiID);
        if (!node || !cc.isValid(node)) return;

        // 1、检查是否已经上锁
        if (this.m_closing.has(uiID)) {
            return this.m_closing.get(uiID)!;
        }

        // 2、启动真正的关闭流程
        const closePromise: Promise<void> = (async () => {
            const node = uiNode;
            if (!node) return;

            // 关闭动画
            const uiAnimationComponent = node.getComponent(UIAnimationComponent);
            await uiAnimationComponent?.playHideAnimation();

            // 关闭动画执行结束
            const uiBase = node.getComponent(UIBase);
            uiBase?.onClosed();

            // 判断节点时销毁 还是 隐藏
            if (!destroy && uiConfig.cache) {
                node.active = false;
            } else {
                node.removeFromParent();
                node.destroy();
                this.m_activeNodes.delete(uiID);
            }
        })();

        // 3、上锁
        this.m_closing.set(uiID, closePromise);

        try {
            await closePromise;
        } finally {
            // 4、解锁
            this.m_closing.delete(uiID);
        }
    }

    /**
     * 申请节点
     * @param config UI配置
     * @returns UI节点
     */
    private async acquireNode(config: UIConfig): Promise<cc.Node> {
        const loadPrefab: cc.Prefab = await this.m_resManagerTool.loadResAsync(config.prefabPath, cc.Prefab, false);
        if (!loadPrefab) return null;
        const node = cc.instantiate(loadPrefab);
        return node;
    }
}