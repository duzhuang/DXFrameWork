import { UIBase } from "../Core/UI/UIBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class prefabUI1 extends UIBase {

    uiName: string = "prefabUI1";

    init(data?: any): void {
        console.log("prefabUI1 init");
    }

    onShow(): void {
        console.log("prefabUI1 onShow");
    }

    onHide(): void {
        console.log("prefabUI1 onHide");
    }

    onClickClose(): void {
        this.close();
    }
}
