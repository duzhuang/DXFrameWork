import UIAnimationManager from "./UIAnimationManager";

const { ccclass, property, menu } = cc._decorator;


/**
 * UI 动画类型
 */
const UIAnimationType = cc.Enum({
    FADE: 0,
    SCALE: 1,
    SLIDE_RIGHT: 2,
    SLIDE_LEFT: 3,
    SLIDE_TOP: 4,
    SLIDE_BOTTOM: 5,
});

const UIAnimationTypeMap = {
    [UIAnimationType.FADE]: "fade",
    [UIAnimationType.SCALE]: "scale",
    [UIAnimationType.SLIDE_RIGHT]: "slide-right",
    [UIAnimationType.SLIDE_LEFT]: "slide-left",
    [UIAnimationType.SLIDE_TOP]: "slide-top",
    [UIAnimationType.SLIDE_BOTTOM]: "slide-bottom",
}

@ccclass
@menu("UI/UIAnimationComponent")
export default class UIAnimationComponent extends cc.Component {
    @property({ type: UIAnimationType, tooltip: '显示动画' })
    showAnimation = UIAnimationType.FADE;

    @property({ type: UIAnimationType, tooltip: '隐藏动画' })
    hideAnimation = UIAnimationType.FADE;

    @property({ type: cc.Float, tooltip: '显示动画时长（秒）' })
    showDuration: number = 0.3;

    @property({ type: cc.Float, tooltip: '隐藏动画时长（秒）' })
    hideDuration: number = 0.3;

    @property({ type: cc.Node, tooltip: '动画节点' })
    animationNode: cc.Node = null;



    /**当前执行的动画 */
    private m_currentTween: cc.Tween<Node> | null = null;

    //当前动画是否正在执行
    private m_isPlaying: boolean = false;

    protected start(): void {

    }

    /**
     * 播放显示动画
     * @returns Promise<void>
     */
    public playShowAnimation(): Promise<void> {
        if (this.m_isPlaying) {
            return null;
        }
        this.m_isPlaying = true;

        const component = this;
        return new Promise((resolve, reject) => {
            if (component.m_currentTween) {
                component.m_currentTween.stop();
            }
            const animationPromise = UIAnimationManager.instance.show(component.node, UIAnimationTypeMap[component.showAnimation], component.animationNode, component.showDuration);
            animationPromise
                .then(() => {
                    this.m_isPlaying = false;
                    resolve();
                })
                .catch((error) => {
                    this.m_isPlaying = false;
                    reject(error);
                })
                .finally(() => {
                    this.m_isPlaying = false;
                })
        })
    }

    /**
     * 播放隐藏动画
     * @returns Promise<void>
     */
    public playHideAnimation(): Promise<void> {
        if (this.m_isPlaying) {
            return null;
        }
        this.m_isPlaying = true;

        const component = this;
        return new Promise((resolve, reject) => {
            if (component.m_currentTween) {
                component.m_currentTween.stop();
            }
            const animationPromise = UIAnimationManager.instance.hide(component.node, UIAnimationTypeMap[component.hideAnimation], component.animationNode, component.hideDuration);
            animationPromise
                .then(() => {
                    this.m_isPlaying = false;
                    resolve();
                })
                .catch((error) => {
                    this.m_isPlaying = false;
                    reject(error);
                })
                .finally(() => {
                    this.m_isPlaying = false;
                })
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