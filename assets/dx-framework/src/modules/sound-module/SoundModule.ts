import { IModule, ModuleManager } from "../../core/index";
import Module from "../../decorators/Moudle";
import { ISoundConfig, SoundType } from "./ISoundConfig";

@Module('SoundModule')
export default class SoundModule implements IModule {
    /** 全局单例 */
    public static get instance(): SoundModule {
        return ModuleManager.instance.getModule('SoundModule') as SoundModule;
    }

    private m_isMusicOn: boolean = null;
    private m_isEffectOn: boolean = null;

    private m_bgmID: number | null = null;
    private m_effectIDs: Set<number> = new Set<number>();

    private readonly EFFECT_CONFIG_KEY: string = "isEffectOn";
    private readonly MUSIC_CONFIG_KEY: string = "isMusicOn";
    private readonly EFFECT_VOLUME_KEY: string = "effectVolume";
    private readonly MUSIC_VOLUME_KEY: string = "musicVolume";

    private m_effectVolume: number = 1;
    private m_musicVolume: number = 1;

    private m_currentMusic: { clip: cc.AudioClip, loop: boolean } | null = null;

    /** Scheduler ID，用于取消调度 */
    private m_fadeSchedulerId: any = null;

    constructor() { }

    // —— IModule 接口 —— //

    /** 初始化阶段（可在此读取配置） */
    public onInit(): void {
        console.log("SoundModule onInit");
        this.m_isMusicOn = this.getMusicConfig();
        this.m_isEffectOn = this.getEffectConfig();
        // 从本地存储中读取音量设置，如果没有则使用默认值
        this.m_effectVolume = this.getVolumeConfig(this.EFFECT_VOLUME_KEY, 0.8);
        this.m_musicVolume = this.getVolumeConfig(this.MUSIC_VOLUME_KEY, 0.8);

        // 设置初始音量
        cc.audioEngine.setMusicVolume(this.m_musicVolume);
        cc.audioEngine.setEffectsVolume(this.m_effectVolume);
    }

    /** 启动阶段（场景启动后调用） */
    public onStart(): void {
        console.log("SoundModule onStart");
    }

    /** 每帧更新（如果你需要在 update 里做额外逻辑可实现） */
    public onUpdate(dt: number): void {
        // scheduleFlush 已经用 scheduler 调度，无需在这里再手动 flush
    }

    /** 销毁阶段（场景切换或热重载前调用） */
    public onDestroy(): void {             
        this.stopAllEffects();
        this.stopMusic();        
        this.m_effectIDs.clear();
    }


    // —— SoundModule 专属方法 —— //

    /**
     * 切换音乐开关
     * @param isOn true:开启 false: 关闭
     */
    public switchMusic(isOn: boolean) {
        if (this.m_isMusicOn === isOn) return;

        this.m_isMusicOn = isOn;
        this.setConfig(this.MUSIC_CONFIG_KEY, isOn);

        isOn ? this.resumeMusic() : this.pauseMusic();
    }

    /**
     * 切换音效开关
     * @param isOn true:开启 false: 关闭
     */
    public switchEffect(isOn: boolean) {
        if (this.m_isEffectOn === isOn) return;

        this.m_isEffectOn = isOn;
        this.setConfig(this.EFFECT_CONFIG_KEY, isOn);

        // 关闭音效，停止播放所有音效，并清空
        if (!isOn) {
            this.stopAllEffects();
        }
    }

    /**
    * 播放音乐
    * @param musicName 音乐名称
    * @param loop 是否循环
    */
    public play(config: ISoundConfig) {
        if (!config.audioClip) {
            console.error("Invalid audio clip");
            return;
        }

        if (config.type === SoundType.BGM) {
            // 避免播放同一首音乐 
            if (this.m_currentMusic
                && this.m_currentMusic.clip === config.audioClip
                && this.m_currentMusic.loop === config.loop
            ) {
                return;
            }
            this.playMusic(config.audioClip, config.loop);
        } else if (config.type === SoundType.Effect) {
            this.playEffect(config.audioClip, config.loop, config.volume);
        }
    }

    /**
     * 暂停
     * @param soundType 
     */
    public pause(soundType: SoundType) {
        if (soundType === SoundType.BGM) {
            cc.audioEngine.pauseMusic();
        } else {
            cc.audioEngine.pauseAllEffects();
        }
    }

    /**
     * 恢复
     * @param soundType 
     */
    public resume(soundType: SoundType) {
        if (soundType === SoundType.BGM) {
            cc.audioEngine.resumeMusic();
        } else {
            cc.audioEngine.resumeAllEffects();
        }
    }

    /**
    * 设置音乐音量
    * @param volume 音量
    */
    public setMusicVolume(volume: number) {
        if (volume < 0 || volume > 1) {
            console.error("volume must be between 0 and 1");
            return;
        }
        this.m_musicVolume = volume;
        cc.audioEngine.setMusicVolume(volume);
        this.setVolumeConfig(this.MUSIC_VOLUME_KEY, volume);
    }

    /**
     * 设置音效音量
     * @param volume 音量
     */
    public setEffectVolume(volume: number) {
        if (volume < 0 || volume > 1) {
            console.error("volume must be between 0 and 1");
            return;
        }
        this.m_effectVolume = volume;
        cc.audioEngine.setEffectsVolume(volume);
        this.setVolumeConfig(this.EFFECT_VOLUME_KEY, volume);
    }


    /**
     * 获取音乐是否开启
     */
    public get isMusicOn(): boolean {
        return this.m_isMusicOn;
    }

    /**
     * 获取音效是否开启
     */
    public get isEffectOn(): boolean {
        return this.m_isEffectOn;
    }

    /**
     * 获取音乐音量
     */
    public get musicVolume(): number {
        return this.m_musicVolume;
    }

    /**
     * 获取音效音量
     */
    public get effectVolume(): number {
        return this.m_effectVolume;
    }

    // =============== 私有方法 =============== //

    /**
     * 播放音乐
     * @param musicClip 音乐资源
     * @param loop 是否循环
     */
    private playMusic(musicClip: cc.AudioClip, loop: boolean = true, volume?: number) {

        if (!this.m_isMusicOn) {
            console.warn("music is not on");
            return;
        }

        // 停止旧的背景音乐
        if (this.m_bgmID !== null) {
            cc.audioEngine.stop(this.m_bgmID);
        }

        if (volume) {
            cc.audioEngine.setMusicVolume(volume);
        }

        this.m_bgmID = cc.audioEngine.playMusic(musicClip, loop);
        this.m_currentMusic = { clip: musicClip, loop }
    }

    /**
     * 停止音乐
     */
    private stopMusic() {
        if (this.m_bgmID !== null) {
            cc.audioEngine.stop(this.m_bgmID);
            this.m_bgmID = null;
        }
        this.m_currentMusic = null;
    }


    /**
     * 播放音效
     * @param effectName 音效名称
     * @param loop 是否循环
     * @param volume 音量
     */
    private playEffect(effectClip: cc.AudioClip, loop: boolean = false, volume?: number) {
        if (!effectClip) {
            console.error("no vaild effectClip");
            return;
        }
        if (!this.m_isEffectOn) {
            console.warn("effect is not on");
            return;
        }



        const audioID = cc.audioEngine.playEffect(effectClip, loop);
        this.m_effectIDs.add(audioID);

        cc.audioEngine.setVolume(audioID, volume ?? this.m_effectVolume);

        this.cleanFinishedEffects();
    }

    /**
     * 停止所有音效
     */
    private stopAllEffects(): void {
        this.m_effectIDs.forEach(id => {
            cc.audioEngine.stopEffect(id);
        });
        this.m_effectIDs.clear();
    }

    /**
     * 清理已完成的音效
     */
    private cleanFinishedEffects(): void {
        // 定期检查并清理已完成但未正确移除的音效ID
        this.m_effectIDs.forEach(id => {
            if (!cc.audioEngine.getState(id)) {
                this.m_effectIDs.delete(id);
            }
        });
    }


    private getMusicConfig() {
        return this.getConfig(this.MUSIC_CONFIG_KEY);
    }

    private getEffectConfig() {
        return this.getConfig(this.EFFECT_CONFIG_KEY);
    }


    /**
    * 获取配置
    * @param configName 配置名称
    * @param defaultValue 默认值
    */
    private getConfig(configName: string): boolean {
        // 通用实现：可根据不同引擎扩展
        let config = cc.sys.localStorage.getItem(configName);
        if (config == null) {
            cc.sys.localStorage.setItem(configName, 'true');
            return true;
        }
        return config === 'true';
    }

    /**
     * 获取音量配置
     * @param configName 配置名称
     * @param defaultValue 默认值
     */
    private getVolumeConfig(configName: string, defaultValue: number): number {
        const volume = cc.sys.localStorage.getItem(configName);
        if (volume === null) {
            cc.sys.localStorage.setItem(configName, defaultValue.toString());
            return defaultValue;
        }
        return parseFloat(volume);
    }

    /**
     * 设置配置
     * @param configName 配置名称
     * @param value 配置值
     */
    private setConfig(configName: string, value: boolean): void {
        cc.sys.localStorage.setItem(configName, value.toString());
    }

    /**
     * 设置音量配置
     * @param configName 配置名称
     * @param value 配置值
     */
    private setVolumeConfig(configName: string, value: number): void {
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