import UIManager from "./UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export abstract class UIBase extends cc.Component {

    /**UI 唯一标识（与UIConig 的 key 一致） */
    abstract uiName: string;

    /**
     * 初始化方法（数据传递入口）
     * @param data 数据
     */
    init(data?: any): void {

    }

    /**
     * 打开动画完成回调
     */
    onShow(): void {
    }

    /**
     * 关闭动画完成回调
     */
    onHide(): void {

    }

    /**
     * 销毁回调
     */
    onDestroy(): void {

    }

    /**
     * 关闭UI
     */
    close(): void {
        UIManager.instance.closeUI(this.uiName);
    }

}