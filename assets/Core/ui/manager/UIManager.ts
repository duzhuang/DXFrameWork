import { UIConfig } from "../config/UIConfig";
import { UIWorkflow } from "../workflow/UIWorkflow";
import { LayerManager } from "./LayerManager";

export class UIManager {

    private static m_instance: UIManager;

    public static get instance(): UIManager {
        if (!UIManager.m_instance) {
            UIManager.m_instance = new UIManager();
        }
        return UIManager.m_instance;
    }

    /** 保存已打开的 uiName → 节点 */
    private m_uiMap: Map<string, cc.Node> = new Map();
    /** 各 UI 的配置表 */
    private m_configMap: Record<string, UIConfig> = {};
    /** 正在打开的锁 */
    private m_openingLocks: Map<string, Promise<cc.Node>> = new Map();
    /** 正在关闭的锁 */
    private m_closingLocks: Map<string, Promise<void>> = new Map();

    /**
     * 初始化UI管理器
     */
    private constructor() {
        const uiRoot = this.initUIRoot();
        this.initLayer(uiRoot);
    }

    /**
     * 初始化UI根节点
     */
    private initUIRoot(): cc.Node {
        let uiRoot: cc.Node = null;
        const root = cc.find('Canvas/UIRoot');
        if (root) {
            uiRoot = root;
        } else {
            const uiRootNode = new cc.Node('UIRoot');
            uiRootNode.setContentSize(cc.winSize);
            uiRootNode.setPosition(cc.Vec2.ZERO);
            const canvas = cc.director.getScene()!.getChildByName('Canvas');
            canvas.addChild(uiRootNode);
            uiRoot = uiRootNode;
        }
        return uiRoot;
    }

    /**
     * 初始化层级容器
     */
    private initLayer(uiRoot: cc.Node) {
        if (!cc.isValid(uiRoot)) return;
        LayerManager.instance.initialize(uiRoot);
    }


    /**
     * 打开UI
     * @param uiConfig UI配置
     * @param params 打开参数
     * @returns 打开的节点
     */
    public async open(uiConfig: UIConfig, params?: any): Promise<cc.Node> {

        const id = uiConfig.uiID;

        // 1、如果已经有一次 open 在跑，直接返回那次的 Promise
        if (this.m_openingLocks.has(id)) {
            console.log(`UI ${id} 正在打开中`);
            return this.m_openingLocks.get(id)!;
        }

        //2、启动真正的打开流程
        const promise = (async () => {
            // - 如果已经打开，返回已有实例
            if (this.m_uiMap.has(uiConfig.uiID)) {
                const node = this.m_uiMap.get(uiConfig.uiID);
                await UIWorkflow.instance.open(uiConfig, params);
                return node;
            }

            // - 如果没有配置，返回null
            if (!this.m_configMap[uiConfig.uiID]) {
                this.m_configMap[uiConfig.uiID] = uiConfig;
            }

            // 打开UI
            const uiNode: cc.Node = await UIWorkflow.instance.open(uiConfig, params);

            if (!cc.isValid(uiNode)) return null;

            this.m_uiMap.set(uiConfig.uiID, uiNode);
            return uiNode;
        })();

        //3、上锁
        this.m_openingLocks.set(id, promise);

        try {
            return await promise;
        } finally {
            // 4、解锁
            this.m_openingLocks.delete(id);
        }
    }

    /**
     * 关闭UI 
     * @param uiID UI配置ID
     * @param destroy 是否强制销毁 默认为false
     */
    public async close(uiID: string, destroy: boolean = false) {
        //1、找不到 config/节点，直接 return
        const uiConfig = this.m_configMap[uiID];
        if (!uiConfig) return;

        const uiNode = this.m_uiMap.get(uiID);
        if (!uiNode) return;

        //2、如果已经有一次 close 在跑，直接返回那次的 Promise
        if (this.m_closingLocks.has(uiID)) {
            console.log(`UI ${uiID} 正在关闭中`);
            return this.m_closingLocks.get(uiID)!;
        }

        //3、启动真正的关闭流程
        const promise = (async () => {
            await UIWorkflow.instance.close(uiConfig, uiNode, destroy);
            // 移除
            if (destroy || !uiConfig.cache) {
                this.m_uiMap.delete(uiID);
            }
        })();

        //4、上锁
        this.m_closingLocks.set(uiID, promise);

        try {
            await promise;
        } finally {
            // 5、解锁
            this.m_closingLocks.delete(uiID);
        }
    }

    public closeAll() {

    }
}