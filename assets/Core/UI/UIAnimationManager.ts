/**
 * UI 动画接口
 */
interface UIAnimation {
    show: (node: cc.Node, animationNode: cc.Node, duration: number) => void;
    hide: (node: cc.Node, animationNode: cc.Node, duration: number) => void;
}

/**
 * UI 动画管理类
 */
export default class UIAnimationManager {

    private static m_instance: UIAnimationManager;
    /**动画 */
    private m_animations: Map<string, any> = new Map();

    public static get instance(): UIAnimationManager {
        if (!UIAnimationManager.m_instance) {
            UIAnimationManager.m_instance = new UIAnimationManager();
        }
        return UIAnimationManager.m_instance;
    }

    constructor() {
        this.initDefaultAnimations();
    }

    registerAnimation(animationName: string, animation: UIAnimation) {
        this.m_animations.set(animationName, animation);
    }

    getAnimation(animationName: string): any {
        if (!this.m_animations.has(animationName)) {
            console.warn(`Animation ${name} not registered, using default`);
            return this.m_animations.get('fade');
        }
        return this.m_animations.get(animationName);
    }

    private initDefaultAnimations() {
        this.registerAnimation('fade', {
            show: (node: cc.Node, animationNode: cc.Node, duration: number = 0.3) => {
                node.opacity = 0;
                return cc.tween(node)
                    .to(duration, { opacity: 255 })
            },
            hide: (node: cc.Node, animationNode: cc.Node, duration: number = 0.3) => {
                return cc.tween(node)
                    .to(duration, { opacity: 0 })
                    .call(() => {
                        node.active = false;
                    })
            }
        });

        this.registerAnimation('scale', {
            show: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.3) {
                let doActionNode:cc.Node = node;
                if(node.uuid !== animationNode.uuid){
                    doActionNode = animationNode;
                }

                doActionNode.scale = 0;                        
                return cc.tween(doActionNode)
                    .to(duration, { scale: 1 }, { easing: 'backOut' })
            },
            hide: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.3) {
                let doActionNode:cc.Node = node;
                if(node.uuid !== animationNode.uuid){
                    doActionNode = animationNode;
                }
                return cc.tween(doActionNode)
                    .to(duration, { scale: 0 }, { easing: 'backIn' })
                    .call(() => {
                        node.active = false;
                    })
            }
        });

        this.registerAnimation('slide-right', {
            show: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.4) {
                const startPos = new cc.Vec3(1000, 0, 0);
                node.setPosition(startPos);
                return cc.tween(node)
                    .to(duration, { position: cc.Vec3.ZERO }, { easing: 'cubicOut' })
            },
            hide: function (node: cc.Node, animationNode: cc.Node, duration: number = 0.4) {
                const endPos = new cc.Vec3(1000, node.position.y, node.position.z);
                return cc.tween(node)
                    .to(duration, { position: endPos }, { easing: 'cubicIn' })
                    .call(() => {
                        node.active = false;
                    })
            }
        });
    }
}