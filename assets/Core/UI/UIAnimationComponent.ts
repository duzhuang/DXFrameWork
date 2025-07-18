import UIAnimationManager from "./UIAnimationManager";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/UIAnimationComponent")
export default class UIAnimationComponent extends cc.Component {
    @property({ tooltip: '显示动画' })
    showAnimation: string = 'fade';

    @property({ tooltip: '隐藏动画' })
    hideAnimation: string = 'fade';

    @property({ type: cc.Float, tooltip: '显示动画时长（秒）' })
    showDuration: number = 0.3;

    @property({ type: cc.Float, tooltip: '隐藏动画时长（秒）' })
    hideDuration: number = 0.3;

    /**当前执行的动画 */
    private currentTween: cc.Tween<Node> | null = null;

    /**
     * 播放显示动画
     * @returns Promise<void>
     */
    public playShowAnimation(): Promise<void> {
        const component = this;
        return new Promise((resolve, reject) => {
            if (component.currentTween) {
                component.currentTween.stop();
            }

            const animation = UIAnimationManager.instance.getAnimation(component.showAnimation);

            component.currentTween = animation.show(component.node, component.showDuration);

            if (component.currentTween) {
                component.currentTween.call(() => {
                    component.currentTween = null;
                    resolve();
                })
                .start();
            } else {
                resolve();
            }
        })
    }

    /**
     * 播放隐藏动画
     * @returns Promise<void>
     */
    public playHideAnimation(): Promise<void> {
        const component = this;
        return new Promise((resolve, reject) => {
            if (component.currentTween) {
                component.currentTween.stop();
            }
            const animation = UIAnimationManager.instance.getAnimation(component.hideAnimation);
            component.currentTween = animation.hide(component.node, component.hideDuration);

            if (component.currentTween) {                                
                component.currentTween.call(() => {
                    component.currentTween = null;
                    resolve();
                })                
                .start();
            } else {
                resolve();
            }
        })
    }

    /**
     * 停止当前动画
     */
    public stopCurrnetAnimation(): void {
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
        }
    }
}