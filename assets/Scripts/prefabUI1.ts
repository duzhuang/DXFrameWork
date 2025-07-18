import { UIBase } from "../Core/UI/UIBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class prefabUI1 extends UIBase {

    uiName: string = "prefabUI1";

    init(data?: any): void {
        console.log("prefabUI1 init");
    }


    onClickClose(): void {
        this.close();
    }
}
