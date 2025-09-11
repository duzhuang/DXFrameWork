/**
 * @description 音效控制器
 */
export default class SoundController {
    private static m_instance: SoundController;
    public static get instance(): SoundController {
        if (!this.m_instance) {
            this.m_instance = new SoundController();
        }
        return this.m_instance;
    }

    private m_isMusicOn: boolean = null;
    private m_isEffectOn: boolean = null;

    constructor() {
        this.setMusic(this.getMusicConfig());
        this.setEffect(this.getEffectConfig());
    }

    public destroy(): void {
        SoundController.m_instance = null;
    }

    /**
     * 设置音乐是否开启
     * @param value true:开启 false: 关闭
     */
    public setMusic(value: boolean) {
        this.m_isMusicOn = value;
        this.setConfig('isMusicOn', value);
        if (value) {
            this.resumeMusic();
        } else {
            this.stopMusic();
        }
    }

    /**
    * 设置音效是否开启
    * @param value true:开启 false: 关闭
    */
    public setEffect(value: boolean) {
        this.m_isEffectOn = value;
        this.setConfig('isEffectOn', value);
    }

    /**
    * 停止音乐
    */
    public stopMusic() {
        this.pauseMusic();
    }

    /**
    * 播放音乐
    * @param musicName 音乐名称
    * @param loop 是否循环
    */
    public playMusic(musciClip: cc.AudioClip, loop: boolean = true) {
        if (!this.m_isMusicOn) {
            return;
        }
        cc.audioEngine.playMusic(musciClip, loop);
    }

    /**
     * 播放音效
     * @param effectName 音效名称
     * @param loop 是否循环
     * @param volume 音量
     */
    public playEffect(effectClip: cc.AudioClip, loop: boolean = false,volume:number = 1) {
        if (!this.m_isEffectOn) {
            return;
        }
        const audioID = cc.audioEngine.playEffect(effectClip, loop);
        cc.audioEngine.setVolume(audioID,volume);
    }

    /**
    * 设置音乐音量
    * @param volume 音量
    */
    public setMusicVolume(volume: number) {
        cc.audioEngine.setMusicVolume(volume);
    }

    /**
     * 设置音效音量
     * @param volume 音量
     */
    public setEffectVolume(volume: number) {
        cc.audioEngine.setEffectsVolume(volume);
    }

    // =============== 私有方法 =============== //

    private getMusicConfig() {
        return this.getConfig('isMusicOn');
    }

    private getEffectConfig() {
        return this.getConfig('isEffectOn');
    }


    /** 通用获取玩家的设置 */
    private getConfig(configName: string): boolean {
        // 通用实现：可根据不同引擎扩展
        let config = cc.sys.localStorage.getItem(configName);
        if (config == null) {
            cc.sys.localStorage.setItem(configName, 'true');
            return true;
        }
        return config === 'true';
    }

    private setConfig(configName: string, value: boolean): void {
        // 通用实现：可根据不同引擎扩展
        cc.sys.localStorage.setItem(configName, value.toString());
    }


    private pauseMusic() {
        // 通用实现：可根据不同引擎扩展
        cc.audioEngine.pauseMusic();
    }

    private resumeMusic() {
        // 通用实现：可根据不同引擎扩展
        cc.audioEngine.resumeMusic();
    }

}