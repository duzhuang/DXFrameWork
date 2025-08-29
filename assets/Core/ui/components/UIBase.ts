import { UIManager } from "../manager/UIManager";


const { ccclass, property } = cc._decorator;

@ccclass
export abstract class UIBase extends cc.Component {

    /** UI 唯一标识，与 UIConfig 中的 key 保持一致 */
    abstract viewName: string;

    /**
     * 创建并注入数据时调用
     * @param data 打开时传入的数据
     */
    public initialize(data?: any): void {
        // 默认空实现，子类可覆盖
    }

    /**
     * 打开动画或加载完成后调用
     */
    public onOpened(): void {
        // 默认空实现，子类可覆盖
    }

    /**
     * 关闭动画完成后调用
     */
    public onClosed(): void {
        // 默认空实现，子类可覆盖
    }

    /**
     * 节点即将/已被销毁前调用，用于资源清理
     */
    public onCleanup(): void {
        // 默认空实现，子类可覆盖
    }

    /**
     * 触发关闭流程的统一接口
     */
    public closeView(): void {
        UIManager.instance.close(this.viewName);
    }
}
