// IUIBase.ts
export default interface IUIBase {
    /** UI 唯一标识，与 UIConfig 中的 key 保持一致 */
    viewName: string;
    
    /**
     * 创建并注入数据时调用
     * @param data 打开时传入的数据
     */
    initialize(data?: any): void;

    /**
     * 打开动画或加载完成后调用
     */
    onOpened(): void;

    /**
     * 关闭动画完成后调用
     */
    onClosed(): void;

    /**
     * 节点即将/已被销毁前调用，用于资源清理
     */
    onCleanup(): void;

    /**
     * 触发关闭流程的统一接口
     */
    closeView(): void;
}