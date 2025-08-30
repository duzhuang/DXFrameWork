
import { UILayer } from "../layer/UILayer";

export default class LayerManager {

    private static m_instance: LayerManager;
    public static get instance(): LayerManager {
        if (!this.m_instance) {
            this.m_instance = new LayerManager();
        }
        return this.m_instance;
    }

    /** 存储 UILayer → Node 的映射 */
    private layerMap: Map<UILayer, cc.Node> = new Map();

    /** UI 根节点引用，必须先调用 initialize() */
    private uiRoot: cc.Node | null = null;

    /**私有构造函数，外部无法实例化 */
    private constructor() {

    }

    /**
    * 初始化：在 UIManager 创建完 uiRoot 之后调用
    * @param uiRoot UI 根节点
    */
    public initialize(uiRoot: cc.Node): void {
        this.uiRoot = uiRoot;
        this.layerMap.clear();

        // 初始化所有 UILayer 层级节点
        // 遍历 UILayer 枚举值

        for (const layer of Object.keys(UILayer) as (keyof typeof UILayer)[]) {
            if (typeof UILayer[layer] === "number") {            
                const layerNode = new cc.Node(`${layer}`);
                layerNode.setContentSize(cc.winSize);
                layerNode.setPosition(cc.v2(0, 0));
                this.uiRoot.addChild(layerNode);
                this.layerMap.set(UILayer[layer], layerNode);
            }
        }
    }

    /**
     * 获取指定 UILayer 的节点
     * @param layer UILayer 枚举值
     * @returns 对应的节点
     */
    public getLayerNode(layer: UILayer): cc.Node {
        if (!this.uiRoot) {
            throw new Error("LayerManager 尚未初始化，请先调用 initialize(uiRoot)");
        }

        const layerNode = this.layerMap.get(layer);
        if (!layerNode) {
            throw new Error(`未找到 UILayer: ${layer}`);
        }
        return layerNode;
    }

}