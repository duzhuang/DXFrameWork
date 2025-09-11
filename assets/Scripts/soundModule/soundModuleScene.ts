import { ModuleManager } from "../../dx-framework/src/core/index";
import { SoundModule, SoundType } from "../../dx-framework/src/modules/sound-module/index";

const { ccclass, property } = cc._decorator;

@ccclass
export default class soundModuleScene extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    protected onLoad(): void {
        ModuleManager.instance.startAll();
    }

    protected start(): void {

    }

    onClickPLayBGM() {
        SoundModule.instance.play({
            audioClip: this.bgm,
            volume: 0.5,
            loop: true,
            type: SoundType.BGM
        })
    }

}
