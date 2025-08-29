/**
 * UI 动画接口
 */
interface UIAnimation {
    show: (
        node: cc.Node,
        animationNode?: cc.Node,
        duration?: number
    ) => cc.Tween;
    hide: (
        node: cc.Node,
        animationNode?: cc.Node,
        duration?: number
    ) => cc.Tween;
}

/**
 * UI 动画库
 */
export default class UIAnimationLibrary {

    private static m_instance: UIAnimationLibrary;
    /**动画 */
    private m_animations: Map<string, UIAnimation> = new Map();

    public static get instance(): UIAnimationLibrary {
        if (!UIAnimationLibrary.m_instance) {
            UIAnimationLibrary.m_instance = new UIAnimationLibrary();
        }
        return UIAnimationLibrary.m_instance;
    }

    constructor() {
        this.initDefaultAnimations();
    }

    /**
     * 显示节点
     * @param node 节点
     * @param animationName 动画名称
     * @param animationNode 动画节点
     * @param duration 动画时间
     */
    public show(node: cc.Node, animationName?: string, animationNode?: cc.Node, duration: number = 0.3): Promise<void> {
        const tween = this.getAnimation(animationName).show(node, animationNode, duration);
        node.active = true;
        return this.tweenToPromise(tween);
    }

    /**
     * 隐藏节点
     * @param node 节点
     * @param animationName 动画名称
     * @param animationNode 动画节点
     * @param duration 动画时间
     */
    public hide(node: cc.Node, animationName?: string, animationNode?: cc.Node, duration: number = 0.3): Promise<void> {
        const tween = this.getAnimation(animationName).hide(node, animationNode, duration);
        return this.tweenToPromise(
            tween
                .call(() => {
                    node.active = false;
                })
        );
    }

    /**
     * 将 tween 转换为 Promise
     * @param tween tween
     * @returns Promise
     */
    private tweenToPromise(tween: cc.Tween): Promise<void> {
        return new Promise((resolve, reject) => {
            tween
                .call(resolve)
                .start();
        });
    }

    /**
     * 注册动画
     * @param animationName 动画名称
     * @param animation 动画
     */
    public registerAnimation(animationName: string, animation: UIAnimation) {
        this.m_animations.set(animationName, animation);
    }

    /**
     * 注销动画
     * @param animationName 动画名称
     */
    public unregisterAnimation(animationName: string) {
        this.m_animations.delete(animationName);
    }

    /**
     * 获取动画
     * @param animationName 动画名称
     * 如果没有注册动画，将使用 fade 作为默认动画
     * @returns 动画
     */
    private getAnimation(animationName: string): UIAnimation {
        if (!this.m_animations.has(animationName)) {
            console.warn(`动画 "${animationName}" 未注册，将使用 fade 作为默认动画`);
            return this.m_animations.get('fade')!;
        }
        return this.m_animations.get(animationName)!;
    }


    private initDefaultAnimations() {
        this.registerAnimation('fade', {
            show: (node: cc.Node, animationNode: cc.Node, duration: number = 0.3) => {
                animationNode = animationNode || node;
                animationNode.opacity = 0;
                return cc.tween(animationNode)
                    .to(duration, { opacity: 255 })
            },
            hide: (node: cc.Node, animationNode: cc.Node, duration: number = 0.3) => {
                animationNode = animationNode || node;
                return cc.tween(animationNode)
                    .to(duration, { opacity: 0 })
                    .call(() => {
                        node.active = false;
                    })
            }
        });

        this.registerAnimation('scale', {
            show: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.3) {
                animationNode = animationNode || node;
                //原始的缩放值
                const originalSacle = animationNode.scale;
                animationNode.scale = 0;
                //执行动画
                return cc.tween(animationNode)
                    .to(duration, { scale: originalSacle }, { easing: 'backOut' })
            },
            hide: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.3) {
                animationNode = animationNode || node;
                return cc.tween(animationNode)
                    .to(duration, { scale: 0 }, { easing: 'backIn' })
                    .call(() => {
                        node.active = false;
                    })
            }
        });


        /**
         * 滑动动画
         */
        const slideConfigs = [
            { name: "slide-right", axis: "width", direction: 1 },
            { name: "slide-left", axis: "width", direction: -1 },
            { name: "slide-top", axis: "height", direction: 1 },
            { name: "slide-bottom", axis: "height", direction: -1 }
        ];

        slideConfigs.forEach(({ name, axis, direction }) => {

            this.registerAnimation(name, {

                show(node: cc.Node, animationNode: cc.Node, duration: number = 0.4) {
                    animationNode = animationNode || node;
                    const size: number = cc.view.getVisibleSize()[axis];
                    if (axis === "width") {
                        animationNode.setPosition(cc.v3(direction * (size / 2 + animationNode[axis] / 2), 0, 0));
                    } else if (axis === "height") {
                        animationNode.setPosition(cc.v3(0, direction * (size / 2 + animationNode[axis] / 2), 0));
                    }

                    return cc.tween(animationNode)
                        .to(duration, { position: cc.Vec3.ZERO }, { easing: 'cubicOut' })
                },

                hide(node: cc.Node, animationNode: cc.Node, duration: number = 0.4) {
                    animationNode = animationNode || node;
                    const size = cc.view.getVisibleSize()[axis];
                    const endPos = direction * (size / 2 + animationNode[axis] / 2);
                    //目标位置
                    let targetPos: cc.Vec3 = cc.Vec3.ZERO;
                    if (axis === "width") {
                        targetPos = cc.v3(endPos, 0, 0);
                    } else if (axis === "height") {
                        targetPos = cc.v3(0, endPos, 0);
                    }
                    return cc.tween(animationNode)
                        .to(duration, { position: targetPos }, { easing: 'cubicIn' })
                        .call(() => node.active = false);
                }

            })

        })

    }

}