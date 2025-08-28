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
 * UI 动画管理类
 */
export default class UIAnimationManager {

    private static m_instance: UIAnimationManager;
    /**动画 */
    private m_animations: Map<string, UIAnimation> = new Map();

    public static get instance(): UIAnimationManager {
        if (!UIAnimationManager.m_instance) {
            UIAnimationManager.m_instance = new UIAnimationManager();
        }
        return UIAnimationManager.m_instance;
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
        animationNode = animationNode || node;
        node.active = true;

        const tween = this.getAnimation(animationName).show(node, animationNode, duration);
        return new Promise((resolve) => {
            tween
                .call(() => resolve())
                .start();
        });
    }

    /**
     * 隐藏节点
     * @param node 节点
     * @param animationName 动画名称
     * @param animationNode 动画节点
     * @param duration 动画时间
     */
    public hide(node: cc.Node, animationName?: string, animationNode?: cc.Node, duration: number = 0.3): Promise<void> {
        animationNode = animationNode || node;
        return new Promise((resolve) => {
            const tween = this.getAnimation(animationName).hide(node, animationNode, duration);
            tween
                .call(() => {
                    resolve();
                    node.active = false;
                })
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

        this.registerAnimation('slide-right', {
            show: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.4) {
                animationNode = animationNode || node;
                //开始位置(当前屏幕有右边的尺寸)
                const visibleSize: cc.Size = cc.view.getVisibleSize();
                const allWidth = visibleSize.width / 2 + animationNode.width / 2;
                const startPos = new cc.Vec3(allWidth, 0, 0);
                animationNode.setPosition(startPos);
                return cc.tween(animationNode)
                    .to(duration, { position: cc.Vec3.ZERO }, { easing: 'cubicOut' })
            },
            hide: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.4) {
                animationNode = animationNode || node;
                //结束位置(当前屏幕有右边的尺寸)
                const visibleSize: cc.Size = cc.view.getVisibleSize();
                const allWidth = visibleSize.width / 2 + animationNode.width / 2;
                const endPos = new cc.Vec3(allWidth, 0, 0);
                return cc.tween(animationNode)
                    .to(duration, { position: endPos }, { easing: 'cubicIn' })
                    .call(() => {
                        node.active = false;
                    })
            }
        });

        this.registerAnimation('slide-left', {
            show: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.4) {
                animationNode = animationNode || node;
                //开始位置(当前屏幕有左边的尺寸)
                const visibleSize: cc.Size = cc.view.getVisibleSize();
                const allWidth = visibleSize.width / 2 + animationNode.width / 2;
                const startPos = new cc.Vec3(-allWidth, 0, 0);
                animationNode.setPosition(startPos);
                return cc.tween(animationNode)
                    .to(duration, { position: cc.Vec3.ZERO }, { easing: 'cubicOut' })
            },
            hide: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.4) {
                animationNode = animationNode || node;
                //结束位置(当前屏幕有左边的尺寸)
                const visibleSize: cc.Size = cc.view.getVisibleSize();
                const allWidth = visibleSize.width / 2 + animationNode.width / 2;
                const endPos = new cc.Vec3(-allWidth, 0, 0);
                return cc.tween(animationNode)
                    .to(duration, { position: endPos }, { easing: 'cubicIn' })
                    .call(() => {
                        node.active = false;
                    })
            }
        });

        this.registerAnimation('slide-top', {
            show: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.4) {
                animationNode = animationNode || node;
                //开始位置(当前屏幕有上边的尺寸)
                const visibleSize: cc.Size = cc.view.getVisibleSize();
                const allHeight = visibleSize.height / 2 + animationNode.height / 2;
                const startPos = new cc.Vec3(0, allHeight, 0);
                animationNode.setPosition(startPos);
                return cc.tween(animationNode)
                    .to(duration, { position: cc.Vec3.ZERO }, { easing: 'cubicOut' })
            },
            hide: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.4) {
                animationNode = animationNode || node;
                //结束位置(当前屏幕有上边的尺寸)
                const visibleSize: cc.Size = cc.view.getVisibleSize();
                const allHeight = visibleSize.height / 2 + animationNode.height / 2;
                const endPos = new cc.Vec3(0, allHeight, 0);
                return cc.tween(animationNode)
                    .to(duration, { position: endPos }, { easing: 'cubicIn' })
                    .call(() => {
                        node.active = false;
                    })
            }
        });

        this.registerAnimation('slide-bottom', {
            show: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.4) {
                animationNode = animationNode || node;
                //开始位置(当前屏幕有下边的尺寸)
                const visibleSize: cc.Size = cc.view.getVisibleSize();
                const allHeight = visibleSize.height / 2 + animationNode.height / 2;
                const startPos = new cc.Vec3(0, -allHeight, 0);
                animationNode.setPosition(startPos);
                return cc.tween(animationNode)
                    .to(duration, { position: cc.Vec3.ZERO }, { easing: 'cubicOut' })
            },
            hide: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.4) {
                animationNode = animationNode || node;
                //结束位置(当前屏幕有下边的尺寸)
                const visibleSize: cc.Size = cc.view.getVisibleSize();
                const allHeight = visibleSize.height / 2 + animationNode.height / 2;
                const endPos = new cc.Vec3(0, -allHeight, 0);
                return cc.tween(animationNode)
                    .to(duration, { position: endPos }, { easing: 'cubicIn' })
                    .call(() => {
                        node.active = false;
                    })
            }
        });
    }

}