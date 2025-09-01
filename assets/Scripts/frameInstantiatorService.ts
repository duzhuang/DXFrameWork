import { FrameInstantiatorService } from "../core/performance/index";
import PrefabFrameInstantiatorItem from "./PrefabFrameInstantiatorItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class frameInstantiatorService extends cc.Component {

    @property({ type: cc.Node, tooltip: '' })
    nodeContent: cc.Node = null;

    @property({ type: cc.Prefab, tooltip: '' })
    prefabItem: cc.Prefab = null;

    @property({ type: cc.Integer, tooltip: '' })
    count: number = 0;

    protected onLoad(): void {

    }

    protected start(): void {

    }

    onClick() {
        FrameInstantiatorService.instance.addTask(this.prefabItem, this.count, (node, index) => {
            node.parent = this.nodeContent;
            let item = node.getComponent(PrefabFrameInstantiatorItem);
            item.initItem({ index: index });
        })
    }
}
