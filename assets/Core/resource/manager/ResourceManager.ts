import ResourceLoader from "../loader/ResourceLoader";
import ResourceCache from "../cache/ResourceCache";

export default class ResourceManager {
    private m_resLoader: ResourceLoader = ResourceLoader.instance;
    private m_resCache: ResourceCache = new ResourceCache();

    constructor() {
        this.m_resCache = new ResourceCache();
    }

    /**
     * 加载资源（支持缓存）
     * @param path 路径
     * @param type 资源类型
     * @param useCache 是否使用缓存
     * @param callback 回调函数
     * @returns 
     */
    public loadRes(
        path: string,
        type: typeof cc.Asset,
        useCache: boolean = true,
        callback?: (err: Error | null, asset: any) => void
    ) {
        //如果使用缓存,先从缓存中获取资源
        if (useCache) {
            const cacheAsset = this.m_resCache.getCacheRes(path);
            if (cacheAsset) {
                callback?.(null, cacheAsset);
                return;
            }
        }

        this.m_resLoader.loadRes(path, type, (err, asset) => {
            if (err) {
                console.error("ResourceManager loadRes error:", err);
                callback(err, null);
                return;
            }
            if (useCache) {
                this.m_resCache.setCacheRes(path, asset);
            }
            callback?.(null, asset);
        })
    }

    /**
     * 异步加载资源（支持缓存）
     * @param path 路径
     * @param type 资源类型
     * @param useCache 是否使用缓存（默认：true 使用缓存）
     * @returns
     */
    public async loadResAsync<T extends cc.Asset>(
        path: string,
        type: typeof cc.Asset,
        useCache: boolean = true
    ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            // 如果使用缓存且缓存中存在，直接返回
            if (useCache) {
                const cacheAsset = this.m_resCache.getCacheRes(path) as T;
                if (cacheAsset) {
                    resolve(cacheAsset);
                    return;
                }
            }

            //从资源加载器加载
            this.m_resLoader.loadResAsync(path, type).
                then((asset: T) => {
                    if (useCache) {
                        this.m_resCache.setCacheRes(path, asset);
                    }
                    resolve(asset);
                })
                .catch(reject);
        })
    }

    public destroy(): void {
        this.m_resCache.destroy();
    }

    /**
     * 获取缓存中的资源
     * @param path 资源路径
     */
    public getCachedRes(path: string): cc.Asset | undefined {
        return this.m_resCache.getCacheRes(path);
    }

    /**
     * 手动移除单个缓存资源
     * @param path 资源路径
     */
    public removeCachedRes(path: string): boolean {
        return this.m_resCache.removeCacheRes(path);
    }
}