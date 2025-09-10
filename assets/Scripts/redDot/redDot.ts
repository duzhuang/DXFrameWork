import { EventCenter } from "../../core/event/index";
import { IRedDotConfig, RedDotSystem } from "../red-dot-system";

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
        this.registerEvent();
        //this.initRedDotSystem();
        this.initRedDotSystemByConfig(this.redDotConfig);
    }

    private registerEvent(): void {
        EventCenter.onEvent("redDotChange", this.onRedDotChange, this);
    }

    protected start(): void {

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
        redDotSystem.registerNode('l1');

        redDotSystem.registerNode('l1_1', 'l1');
        redDotSystem.registerNode('l1_1_1', 'l1_1');
        redDotSystem.registerNode('l1_1_2', 'l1_1');

        redDotSystem.registerNode("l1_2", "l1");
        redDotSystem.registerNode("l1_2_1", "l1_2");
        redDotSystem.registerNode("l1_2_2", "l1_2");

        redDotSystem.registerNode("l3");
        redDotSystem.registerNode("l3_1", "l3");
        redDotSystem.registerNode("l3_1_1", "l3_1");
    }
}
