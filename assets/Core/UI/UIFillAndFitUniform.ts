const { ccclass, property, menu } = cc._decorator;

/**
 * 填充和适配统一组件
 * 1. 填充Mask节点
 * 2. 适配 content 节点
 */
@ccclass('UIFillAndFitUniform')
@menu('UI/UIFillAndFitUniform')
export default class UIFillAndFitUniform extends cc.Component {
    @property({ type: cc.Node, tooltip: 'Mask节点' })
    maskNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: 'Content节点' })
    contentNode: cc.Node = null;

    onLoad() {
        this.updateLayout();
    }

    start() {

    }

    /**更新布局 */
    private updateLayout() {


        if (cc.isValid(this.maskNode)) {

            // 此函数是为了在 浏览器 中进行预览时，能够正常显示
            // 因为在浏览器中，canvas 的大小是根据设备的像素比来确定的，而在 Cocos Creator 中，canvas 的大小是根据设计分辨率来确定的
            // 所以在浏览器中预览时，需要将 canvas 的大小乘以设备的像素比，才能正常显示
            let canvasSize: cc.Size = null;
            if (CC_PREVIEW) {
                const devicePixelRatio = cc.view.getDevicePixelRatio();
                const originalSize = cc.view.getVisibleSize();
                canvasSize = new cc.Size(originalSize.width * devicePixelRatio, originalSize.height * devicePixelRatio);
            } else {
                canvasSize = cc.view.getVisibleSize();
            }
            this.maskNode.width = canvasSize.width;
            this.maskNode.height = canvasSize.height;
            this.maskNode.setPosition(cc.Vec2.ZERO);
        }


        if (cc.isValid(this.contentNode)) {
            const visibleSize = cc.view.getVisibleSize();
            const design = cc.view.getDesignResolutionSize();
            const scaleX = visibleSize.width / design.width;
            const scaleY = visibleSize.height / design.height;
            const unifomScale = Math.min(scaleX, scaleY);

            if (this.contentNode) {
                this.contentNode.setScale(unifomScale);
            }
            this.contentNode.setPosition(cc.Vec2.ZERO);
        }
    }
}