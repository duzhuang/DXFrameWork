import ResManager from "../Core/Utils/ResManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    private m_resManager: ResManager = null;

    protected onLoad(): void {
        this.m_resManager = new ResManager();
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
        })
    }

    onClickLoadSprAsync() {

        this.laodSprAsync();
    }

    private async laodSprAsync() {
        try {
            const sprFrame = await this.m_resManager.loadResAsync<cc.SpriteFrame>("Sprites/spr_3", cc.SpriteFrame, true);
            const node = new cc.Node();
            node.addComponent(cc.Sprite).spriteFrame = sprFrame;
            node.parent = this.node;
            node.setPosition(0, -400);
        } catch (err) {
            console.error("ResManager loadResAsync error:", err);
        }
    }

    onClickLoadPrefab() {
        this.m_resManager.loadRes("Prefabs/prefabRect", cc.Prefab, true, (err, asset) => {
            if (err) {
                console.error("ResManager loadRes error:", err);
                return;
            }
            const node = cc.instantiate(asset);
            node.parent = this.node;
            node.setPosition(0, 300);
        })
    }
}
