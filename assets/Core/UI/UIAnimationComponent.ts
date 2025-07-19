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
    private m_currentTween: cc.Tween<Node> | null = null;

    protected start(): void {
        
    }

    /**
     * 播放显示动画
     * @returns Promise<void>
     */
    public playShowAnimation(): Promise<void> {
        const component = this;
        return new Promise((resolve, reject) => {
            if (component.m_currentTween) {
                component.m_currentTween.stop();
            }

            const animation = UIAnimationManager.instance.getAnimation(component.showAnimation);

            component.m_currentTween = animation.show(component.node, component.showDuration);

            if (component.m_currentTween) {
                component.m_currentTween.call(() => {
                    component.m_currentTween = null;
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
            if (component.m_currentTween) {
                component.m_currentTween.stop();
            }
            const animation = UIAnimationManager.instance.getAnimation(component.hideAnimation);
            component.m_currentTween = animation.hide(component.node, component.hideDuration);

            if (component.m_currentTween) {
                component.m_currentTween.call(() => {
                    component.m_currentTween = null;
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
        if (this.m_currentTween) {
            this.m_currentTween.stop();
            this.m_currentTween = null;
        }
    }
}