import { EventCenter } from "../../core/event/index";
import { ModuleManager } from "../../dx-framework/src/core/index";
import { RedDotKeys } from "../../dx-framework/src/generated/red-dot-keys";
import { IRedDotConfig, RedDotSystem } from "../../dx-framework/src/modules/red-dot-system/index";


const { ccclass, property } = cc._decorator;

@ccclass
export default class redDot extends cc.Component {

    /**配置 */
    private redDotConfig: IRedDotConfig = {
        key: "root",
        children: [
            {
                key: "l1",
                children: [
                    {
                        key: "l1_1",
                        children: [
                            {
                                key: "l1_1_1",
                                children: []
                            },
                            {
                                key: "l1_1_2",
                                children: []
                            }
                        ]
                    },
                    {
                        key: "l1_2",
                        children: [
                            {
                                key: "l1_2_1",
                                children: []
                            },
                            {
                                key: "l1_2_2",
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                key: "l3",
                children: [
                    {
                        key: "l3_1",
                        children: []
                    },
                    {
                        key: "l3_2",
                        children: []
                    }
                ]
            }
        ]
    }

    protected onLoad(): void {

        ModuleManager.instance.startAll();

        this.registerEvent();
        this.initRedDotSystem();
        //this.initRedDotSystemByConfig(this.redDotConfig);
    }

    private registerEvent(): void {
        EventCenter.onEvent("redDotChange", this.onRedDotChange, this);
    }

    protected start(): void {

    }

    protected update(dt: number): void {
        ModuleManager.instance.updateAll(dt);
    }

    protected onDestroy(): void {
        EventCenter.offEvent("redDotChange", this.onRedDotChange, this);
    }

    /**红点值改变 */
    private onRedDotChange(data: { key: string, value: number }): void {
        const redDot = RedDotSystem.instance.getNode(data.key);
        if (redDot) {
            if (data.value > 0) {
                RedDotSystem.instance.increment(data.key, data.value);
            } else {
                RedDotSystem.instance.decrement(data.key, -data.value);
            }
        }
    }


    /**
     * 初始化红点系统
     * @param config 红点配置
     */
    private initRedDotSystemByConfig(config: IRedDotConfig): void {
        if (!config) {
            console.error("initRedDotSystemByConfig config is null");
            return;
        }

        RedDotSystem.instance.init(config);
    }

    /**
     * 初始化红点系统
     */
    private initRedDotSystem(): void {
        const redDotSystem = RedDotSystem.instance;
        redDotSystem.registerNode(RedDotKeys.ROOT);

        redDotSystem.registerNode(RedDotKeys.ROOT_TASK);
        redDotSystem.registerNode(RedDotKeys.ROOT_TASK_DAILY, RedDotKeys.ROOT_TASK);
        redDotSystem.registerNode(RedDotKeys.ROOT_TASK_DAILY_DAILY1, RedDotKeys.ROOT_TASK_DAILY);
        redDotSystem.registerNode(RedDotKeys.ROOT_TASK_DAILY_DAILY2, RedDotKeys.ROOT_TASK_DAILY);

        redDotSystem.registerNode(RedDotKeys.ROOT_TASK_ACHIEVEMENT, RedDotKeys.ROOT_TASK);
        redDotSystem.registerNode(RedDotKeys.ROOT_TASK_ACHIEVEMENT_ACHIEVEMENT1, RedDotKeys.ROOT_TASK_ACHIEVEMENT);
        redDotSystem.registerNode(RedDotKeys.ROOT_TASK_ACHIEVEMENT_ACHIEVEMENT2, RedDotKeys.ROOT_TASK_ACHIEVEMENT);

        redDotSystem.registerNode(RedDotKeys.ROOT_MAIL);
        redDotSystem.registerNode(RedDotKeys.ROOT_MAIL_MAIL1, RedDotKeys.ROOT_MAIL);
        redDotSystem.registerNode(RedDotKeys.ROOT_MAIL_MAIL2, RedDotKeys.ROOT_MAIL);

    }
}
