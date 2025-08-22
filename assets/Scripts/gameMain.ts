const { ccclass, property } = cc._decorator;

@ccclass
export default class gameMain extends cc.Component {

    protected onLoad(): void {        
        cc.systemEvent.on("createItem", this.onEventCreateItem, this);
    }

    private onEventCreateItem(worldPos:cc.Vec3){
        this.createNodeWithWorldPos(worldPos);
    }

    start() {     
    }

    private createItem() {        
        //左下角
        this.createNodeWithWorldPos(new cc.Vec3(0, 1334, 0));
        //中心位置
        this.createNodeWithWorldPos(new cc.Vec3(374, 667, 0));
        //右上角
        this.createNodeWithWorldPos(new cc.Vec3(750, 0, 0));
    }  
    
    private createNodeWithWorldPos(worldPos: cc.Vec3) {
        const localPos: cc.Vec3 = this.node.convertToNodeSpaceAR(worldPos);
        const node = this.generateNode();
        node.parent = this.node;
        node.setPosition(localPos);
        node.getComponent(cc.Sprite).spriteFrame = this.createSpriteFrame();        
    }

    private generateNode(){
        const node = new cc.Node();  
        node.addComponent(cc.Sprite);      
        return node;
    }
    

    private createSpriteFrame(){
        const texture = new cc.Texture2D();
        const data = new Uint8Array(4);
        data[0] = 255;
        data[1] = 0;
        data[2] = 0;
        data[3] = 255;

        texture.initWithData(data, cc.Texture2D.PixelFormat.RGBA8888, 20, 20);
        const spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);
        return spriteFrame;
    }
}
