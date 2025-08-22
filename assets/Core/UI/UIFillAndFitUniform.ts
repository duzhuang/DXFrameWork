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
        const visibleSize = cc.view.getVisibleSize();
        if (this.maskNode) {
            this.maskNode.setContentSize(visibleSize);
        }

        const design = cc.view.getDesignResolutionSize();
        console.log("设计分辨率", design);

        const scaleX = visibleSize.width / design.width;
        const scaleY = visibleSize.height / design.height;
        const unifomScale = Math.min(scaleX, scaleY);

        if (this.contentNode) {
            this.contentNode.setScale(unifomScale);
        }

        this.contentNode.setPosition(cc.Vec2.ZERO);
    }
}