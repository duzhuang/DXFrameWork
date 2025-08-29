import { ResourceCache, ResourceLoader } from "../core/resource";


export default class SpriteCache {

    private m_cache: ResourceCache = null;

    constructor() {
        this.m_cache = new ResourceCache();
    }

    public destroy(): void {
        this.m_cache.destroy();
        this.m_cache = null;
    }

    public getSpriteFrame(path: string, callback?: (spriteFrame: cc.SpriteFrame) => void) {
        const spriteFrame = this.m_cache.getCacheRes(path) as cc.SpriteFrame;
        if (!spriteFrame) {
            ResourceLoader.instance.loadRes(path, cc.SpriteFrame, (err, asset) => {
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
            const asset = await ResourceLoader.instance.loadResAsync(path, cc.SpriteFrame);
            this.m_cache.setCacheRes(path, asset);
            spriteFrame = asset as cc.SpriteFrame;
        }

        return spriteFrame;
    }
}