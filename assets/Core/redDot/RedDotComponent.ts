import RedDotSystem from "./RedDotSystem";

const { ccclass, property, menu } = cc._decorator;

@ccclass()
@menu('UI/RedDot/RedDotComponent')
export default class RedDotComponent extends cc.Component {
    @property({ tooltip: '关联的红点键值' })
    public redDotKey = "";

    @property({ type: cc.Node, tooltip: '红点节点' })
    public redDot: cc.Node = null!;

    @property()
    _showCount = true;

    @property({ tooltip: '是否显示数字' })
    set showCount(value: boolean) {
        this._showCount = value;
    }
    get showCount(): boolean {
        return this._showCount;
    }

    @property({
        type: cc.Label, visible() {
            return this._showCount;
        }, tooltip: '数字标签'
    })
    public countLabel: cc.Label = null!;

    /** 红点值改变回调 */
    private onChangeListener: Function | null = null;

    protected onLoad(): void {
        if (!this.redDotKey) {
            console.error("RedDotComponent: redDotKey is empty!");
            return;
        }

        this.onChangeListener = (value) => {
            this.updateRedDot(value);
        }

        const system = RedDotSystem.instance;
        system.addListener(this.redDotKey, this.onChangeListener);

        //初始化状态
        const value = system.getValue(this.redDotKey);
        this.updateRedDot(value);
    }

    protected start(): void {

    }

    protected onDestroy(): void {

    }

    /**
     * 更新红点状态
     * @param value 红点值
     */
    public updateRedDot(value: number) {
        if (this.redDot) {
            this.redDot.active = value > 0;
        }

        this.countLabel.node.active = this.showCount;       

        if (this.countLabel && this.showCount) {
            this.countLabel.string = value > 99 ? '99+' : value.toString();
            this.countLabel.node.active = value > 0;
        }
    }
}