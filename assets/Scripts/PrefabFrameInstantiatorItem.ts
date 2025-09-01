const { ccclass, property } = cc._decorator;

@ccclass
export default class PrefabFrameInstantiatorItem extends cc.Component {

    @property({ type: cc.Label, tooltip: '' })
    lblText: cc.Label = null;

    protected onLoad(): void {

    }

    protected start(): void {

    }


    public initItem(data: { index: number }) {
        this.lblText.string = data.index.toString();
    }

}
