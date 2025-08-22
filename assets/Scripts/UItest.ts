const { ccclass, property } = cc._decorator;

@ccclass
export default class UItest extends cc.Component {

    @property({ type: cc.Node, tooltip: 'Mask节点' })
    maskNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: 'Content节点' })
    contentNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: 'Item节点' })
    itemNode: cc.Node[] = [];

    // onLoad () {}

    start() {

        
        console.log("visibleSizeH",cc.view.getVisibleSize().height);
        console.log("visibleSizeW",cc.view.getVisibleSize().width);

        console.log("nodeH",this.node.height );        
        console.log("nodeW",this.node.width );
        console.log("maskNodeH",this.maskNode.height );
        console.log("maskNodeW",this.maskNode.width );
        console.log("contentNodeH",this.contentNode.height );
        console.log("contentNodeW",this.contentNode.width );    
        
        this.createItem();
    }


    private createItem(){
        this.scheduleOnce(() => {
            for (let idx = 0; idx < this.itemNode.length; idx++) {
                let item = this.itemNode[idx];
                let worldPos = item.convertToWorldSpaceAR(cc.Vec2.ZERO);
                console.log("itemPosW",worldPos.x);
                console.log("itemPosH",worldPos.y);                
                cc.systemEvent.emit("createItem",worldPos);
            }
        }, 2);
    }

    // update (dt) {}
}
