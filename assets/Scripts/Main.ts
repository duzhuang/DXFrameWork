import Log from "../Core/Log/Log";
import ResLoad from "../Core/ResLoad/ResLoad";
import { UILayer } from "../Core/UI/UILayer";
import UIManager from "../Core/UI/UIManager";
import FrameLoading from "../Core/Utils/FrameLoadingTool";
import ObjectPoolTool from "../Core/Utils/ObjectPoolTool";
import ResManager from "../Core/Utils/ResManagerTool";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    

    @property({ type: cc.Prefab, tooltip: '' })
    prefabRect: cc.Prefab = null;

    @property({ type: cc.Node, tooltip: '' })
    nodeContent: cc.Node = null;

    private m_resManager: ResManager = null;

    private m_frameLoading: FrameLoading = null;

    private m_objectPoolTool: ObjectPoolTool = null;

    protected onLoad(): void {
        this.m_resManager = new ResManager();
        this.m_frameLoading = new FrameLoading();
        this.m_objectPoolTool = new ObjectPoolTool();

        this.m_objectPoolTool.setMaxPoolSize(10);

        this.m_objectPoolTool.prewarm(this.prefabRect, 10);
    }

    protected start(): void {
        
    }


    onClickLoadSpr() {

        this.m_resManager.loadRes("Sprites/spr_2", cc.SpriteFrame, true, (err, asset) => {
            if (err) {
                console.error("ResManager loadRes error:", err);
                return;
            }
            const node = new cc.Node();
            node.addComponent(cc.Sprite).spriteFrame = asset;
            node.parent = this.node;
            node.setPosition(0, 200);
        })

        this.m_resManager.loadRes("Sprites/spr_2", cc.SpriteFrame, true, (err, asset) => {
            if (err) {
                console.error("ResManager loadRes error:", err);
                return;
            }
            const node = new cc.Node();
            node.addComponent(cc.Sprite).spriteFrame = asset;
            node.parent = this.node;
            node.setPosition(0, 400);
        })

        // ResLoad.instance.loadRes("Sprites/spr_2", cc.SpriteFrame, (err, asset) => {
        //     if (err) {
        //         console.error("ResLoad loadRes error:", err);
        //         return;
        //     }
        //     const node = new cc.Node();
        //     node.addComponent(cc.Sprite).spriteFrame = asset;
        //     node.parent = this.node;
        //     node.setPosition(0, 200);
        // })

        // ResLoad.instance.loadRes("Sprites/spr_2", cc.SpriteFrame, (err, asset) => {
        //     if (err) {
        //         console.error("ResLoad loadRes error:", err);
        //         return;
        //     }
        //     const node = new cc.Node();
        //     node.addComponent(cc.Sprite).spriteFrame = asset;
        //     node.parent = this.node;
        //     node.setPosition(0, 400);
        // })
    }

    onClickLoadSprAsync() {

        this.laodSprAsync();
    }

    private async laodSprAsync() {
        // try {
        //     const promise1 =  this.m_resManager.loadResAsync<cc.SpriteFrame>("Sprites/spr_3", cc.SpriteFrame, true);
        //     const promise2 =  this.m_resManager.loadResAsync<cc.SpriteFrame>("Sprites/spr_3", cc.SpriteFrame, true);

        //     const [sprFrame1,sprFrame2] = await Promise.all([promise1, promise2]);

        //     const node = new cc.Node();
        //     node.addComponent(cc.Sprite).spriteFrame = sprFrame1;
        //     node.parent = this.node;
        //     node.setPosition(0, -400);

        //     const node2 = new cc.Node();
        //     node2.addComponent(cc.Sprite).spriteFrame = sprFrame2;
        //     node2.parent = this.node;
        //     node2.setPosition(0, -200);
        // } catch (err) {
        //     console.error("ResManager loadResAsync error:", err);
        // }

        const promise1 = ResLoad.instance.loadResAsync<cc.SpriteFrame>("Sprites/spr_3", cc.SpriteFrame);
        const promise2 = ResLoad.instance.loadResAsync<cc.SpriteFrame>("Sprites/spr_3", cc.SpriteFrame);
        const [sprFrame1, sprFrame2] = await Promise.all([promise1, promise2]);
        const node = new cc.Node();
        node.addComponent(cc.Sprite).spriteFrame = sprFrame1;
        node.parent = this.node;
        node.setPosition(0, -400);

        const node2 = new cc.Node();
        node2.addComponent(cc.Sprite).spriteFrame = sprFrame2;
        node2.parent = this.node;
        node2.setPosition(0, -200);
    }

    private m_isClear = false;

    onClickLoadPrefab() {
        UIManager.instance.openUI({ uiName: "prefabUI1", prefabPath: "Prefabs/prefabUI1", layer: UILayer.NORMAL });
    }

    onClickClosePrefab() {
        UIManager.instance.closeUI("prefabUI1");
    }
}
