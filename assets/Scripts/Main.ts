import { Log } from "../core/log/index";
import { EventCenter } from "../core/event/index";

import ResLoad from "../core/resource/loader/ResourceLoader";
import { UIConfig } from "../core/ui/config/UIConfig";
import { UILayer } from "../core/ui/layer/UILayer";
import UIManager from "../core/ui/manager/UIManager";
import FrameLoading from "../core/Utils/FrameLoadingTool";


import { HttpClient, WSClient } from "../core/network/index";

import { ResourceManager } from "../core/resource/index";

import { SoundController } from "../core/audio/index";

import { ObjectPool } from "../core/pool/index";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    

    @property({ type: cc.Prefab, tooltip: '' })
    prefabRect: cc.Prefab = null;

    @property({ type: cc.Node, tooltip: '' })
    nodeContent: cc.Node = null;  

    private m_resManager: ResourceManager = null;

    private m_frameLoading: FrameLoading = null;

    private m_objectPoolTool: ObjectPool = null;

    protected onLoad(): void {
        this.m_resManager = new ResourceManager();
        this.m_frameLoading = new FrameLoading();
        this.m_objectPoolTool = new ObjectPool();

        this.m_objectPoolTool.setMaxPoolSize(10);

        this.m_objectPoolTool.prewarm(this.prefabRect, 10);
    }

    protected start(): void {

        SoundController

        EventCenter.onEvent("TestEvent", this.onTestEvent, this);

       Log.log("Main start 测试 Log 文件的导出是否成功");

        let httpClient = new HttpClient();
        let wsClient = new WSClient();
    }   

    protected onDestroy(): void {
        EventCenter.offEvent("TestEvent", this.onTestEvent, this);
    }

    private onTestEvent(data: any) {

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

    async onClickLoadPrefab() {
        const uiConfig: UIConfig = {
            uiID: "prefabUI1",
            prefabPath: "Prefabs/prefabUI1",
            layer: UILayer.PopUp,   
            cache: true,
        }
        await UIManager.instance.open(uiConfig);      
    }

    async onClickClosePrefab() {
        await UIManager.instance.close("prefabUI1", true);
    }
}
