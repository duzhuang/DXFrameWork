import { IUIBase } from "../core/ui/components/index";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PrefabUI1 extends cc.Component implements IUIBase {

    protected onLoad(): void {
        
    }

    protected start(): void {
        this.viewName = "PrefabUI1";
    }

    protected onDestroy(): void {
        this.viewName = "";
    }

    viewName: string;
    initialize(data?: any): void {
        throw new Error("Method not implemented.");
    }
    onOpened(): void {
        throw new Error("Method not implemented.");
    }
    onClosed(): void {
        throw new Error("Method not implemented.");
    }
    onCleanup(): void {
        throw new Error("Method not implemented.");
    }
    closeView(): void {
        throw new Error("Method not implemented.");
    }
    
}
