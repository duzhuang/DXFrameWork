/** 音效类型 */
export enum SoundType {
    /** 背景音乐 */
    BGM,
    /** 音效 */
    Effect
}

/** 音效配置 */
export interface ISoundConfig {
    /** 音频资源 */
    audioClip: cc.AudioClip,
    /** 音量 */
    volume: number,
    /** 是否循环播放 */
    loop: boolean,
    type: SoundType
}