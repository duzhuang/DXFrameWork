import ResLoad from "../Core/ResLoad/ResLoad";
import FrameLoading from "../Core/Utils/FrameLoading";
import ResManager from "../Core/Utils/ResManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property({ type: cc.Prefab, tooltip: '' })
    prefabRect: cc.Prefab = null;

    @property({ type: cc.Node, tooltip: '' })
    nodeContent: cc.Node = null;

    private m_resManager: ResManager = null;

    private m_frameLoading: FrameLoading = null;

    protected onLoad(): void {
        this.m_resManager = new ResManager();
        this.m_frameLoading = new FrameLoading();
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

    onClickLoadPrefab() {
        this.m_frameLoading.addTask(this.prefabRect, 100, (node: cc.Node, index: number) => {
            node.parent = this.nodeContent;
            node.getComponentInChildren(cc.Label).string = index + "";
        })
    }
}
