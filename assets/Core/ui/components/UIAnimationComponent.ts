import { UIAnimationLibrary } from "../index";


const { ccclass, property, menu } = cc._decorator;

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
export class UIAnimationComponent extends cc.Component {
    @property({ type: UIAnimationType, tooltip: '显示动画' })
    showAnimation = UIAnimationType.FADE;

    @property({ type: UIAnimationType, tooltip: '隐藏动画' })
    hideAnimation = UIAnimationType.FADE;

    @property({ type: cc.Float, tooltip: '显示动画时长（秒）' })
    showDuration = 0.3;

    @property({ type: cc.Float, tooltip: '隐藏动画时长（秒）' })
    hideDuration = 0.3;

    @property({ type: cc.Node, tooltip: '动画节点' })
    animationNode: cc.Node = null;

    // 当前是否正在播放动画
    private m_isPlaying = false;

    /**
     * 播放“显示”动画
     */
    public playShowAnimation(): Promise<void> {
        if (this.m_isPlaying) {
            return Promise.reject(new Error('动画正在执行中'));
        }
        this.m_isPlaying = true;

        const key = UIAnimationTypeMap[this.showAnimation];
        return UIAnimationLibrary.instance.show(
            this.node,
            key,
            this.animationNode,
            this.showDuration
        ).finally(() => {
            this.m_isPlaying = false;
        });
    }

    /**
     * 播放“隐藏”动画
     */
    public playHideAnimation(): Promise<void> {
        if (this.m_isPlaying) {
            return Promise.reject(new Error('动画正在执行中'));
        }
        this.m_isPlaying = true;

        const key = UIAnimationTypeMap[this.hideAnimation];
        return UIAnimationLibrary.instance.hide(
            this.node,
            key,
            this.animationNode,
            this.hideDuration
        ).finally(() => {
            this.m_isPlaying = false;
        });
    }
}
