import ResLoad from "../ResLoad/ResLoad";
import UIAnimationComponent from "./UIAnimationComponent";
import { UIBase } from "./UIBase";
import { UIConfig } from "./UIConfig";
import { UILayer } from "./UILayer";

export default class UIManager {

    private static m_instance: UIManager;
    /**UI根节点 */
    private uiRoot!: cc.Node;
    /**层级容器 */
    private layers: Map<UILayer, cc.Node> = new Map();
    /**活跃UI */
    private activeViews: Map<string, cc.Node> = new Map();
    /**对象池 */
    private nodePools: Map<string, cc.NodePool> = new Map();
    /**UI配置 */
    private uiConfigs: Map<string, UIConfig> = new Map();

    public static get instance(): UIManager {
        if (!UIManager.m_instance) {
            UIManager.m_instance = new UIManager();
        }
        return UIManager.m_instance;
    }

    constructor() {
        this.uiRoot = new cc.Node('UIRoot');
        const widgetCom = this.uiRoot.addComponent(cc.Widget);
        widgetCom.isAlignTop = true;
        widgetCom.isAlignBottom = true;
        widgetCom.isAlignLeft = true;
        widgetCom.isAlignRight = true;
        widgetCom.top = 0;
        widgetCom.bottom = 0;
        widgetCom.left = 0;
        widgetCom.right = 0;
        cc.director.getScene()!.addChild(this.uiRoot);

        //创建层级容器
        Object.values(UILayer).forEach(layer => {
            if (typeof layer === 'number') {
                const layerNode = new cc.Node(`Layer_${layer}`);
                this.uiRoot.addChild(layerNode);
                this.layers.set(layer, layerNode);
            }
        })
    }

    public async openUI(uiConfig: UIConfig, data?: any): Promise<cc.Node> {

        if (!uiConfig.uiName || !uiConfig.prefabPath) {
            throw new Error('UIConfig is invalid');
        }

        const uiName = uiConfig.uiName;

        this.uiConfigs.set(uiName, uiConfig);

        // 已打开，返回现有实例
        if (this.activeViews.has(uiName)) {
            return this.activeViews.get(uiName)!;
        }

        // 创建UI节点
        let uiNode: cc.Node = null;
        if (this.nodePools.has(uiName)) {
            const pool = this.nodePools.get(uiName)!;
            uiNode = pool.size() > 0 ? pool.get() : await this.createUINode(uiConfig.prefabPath);
        } else {
            uiNode = await this.createUINode(uiConfig.prefabPath);
        }

        //挂载到层级容器
        const layerNode = this.layers.get(uiConfig.layer)!;
        layerNode?.addChild(uiNode);

        // 获取 UIBase 组件
        const uiBase = uiNode.getComponent(UIBase);

        if (uiBase) {
            uiBase.init(data);
        }

        uiNode.active = true;
        this.activeViews.set(uiName, uiNode);

        //动画组件
        const animationComponent = uiNode.getComponent(UIAnimationComponent);
        if (animationComponent) {
            await animationComponent.playShowAnimation();
        } else {
            uiBase.onShow();
        }

        return uiNode;
    }

    private async createUINode(prefabPath: string): Promise<cc.Node> {
        const prefab = await this.loadPrefab(prefabPath);
        const uiNode = cc.instantiate(prefab);
        return uiNode;
    }

    private async loadPrefab(prefabPath: string): Promise<cc.Prefab> {
        return ResLoad.instance.loadResAsync(prefabPath, cc.Prefab);
    }

    public closeUI(uiName: string) {
        const uiNode = this.activeViews.get(uiName);
        if (!uiNode) {
            return;
        }
        const uiBase = uiNode.getComponent(UIBase);

        if (!uiBase) {
            uiNode.destroy();
            this.activeViews.delete(uiName);
            return;
        }

        //动画组件
        const animationComponent = uiNode.getComponent(UIAnimationComponent);
        if (animationComponent) {
            animationComponent.playHideAnimation().then(() => {
                this.removeUI(uiName);
            })
        } else {
            this.removeUI(uiName);
        }
    }

    private removeUI(uiName: string) {
        //配置
        const uiConfig = this.uiConfigs.get(uiName);
        const uiNode = this.activeViews.get(uiName);
        uiNode.active = false;

        if (!uiConfig?.cache) {
            uiNode.destroy();
        } else {
            this.nodePools.get(uiName)?.put(uiNode);
        }

        this.activeViews.delete(uiName);
    }
}