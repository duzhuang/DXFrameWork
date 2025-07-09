import ResLoad from "../Core/ResLoad/ResLoad";
import ResCache from "../Core/Utils/ResCache";

export default class SpriteCache {

    private m_cache: ResCache = null;

    constructor() {
        this.m_cache = new ResCache();
    }

    public destroy(): void {
        this.m_cache.destroy();
        this.m_cache = null;
    }

    public getSpriteFrame(path: string, callback?: (spriteFrame: cc.SpriteFrame) => void) {
        const spriteFrame = this.m_cache.getCacheRes(path) as cc.SpriteFrame;
        if (!spriteFrame) {
            ResLoad.instance.loadRes(path, cc.SpriteFrame, (err, asset) => {
                if (err) {
                    console.error("SpriteCache getSpriteFrame error:", err);
                    callback?.(null)
                    return;
                }

                this.m_cache.setCacheRes(path, asset);
                callback?.(asset);
            })
        }

        callback && callback(spriteFrame);
    }

    public async getSpriteFrameAsync(path: string) {
        let spriteFrame = this.m_cache.getCacheRes(path) as cc.SpriteFrame;
        if (!spriteFrame) {
            const asset = await ResLoad.instance.loadResAsync(path, cc.SpriteFrame);
            this.m_cache.setCacheRes(path, asset);
            spriteFrame = asset as cc.SpriteFrame;
        }

        return spriteFrame;
    }
}