/**
 * 资源缓存
 */
export default class ResCache {

    private m_cacheMap: Map<string, cc.Asset> = new Map<string, cc.Asset>();

    /**
     * 缓存资源
     * @param path 资源路径
     * @param asset 资源
     */
    public setCacheRes(path: string, asset: cc.Asset): void {
        if (!path || !asset) {
            console.error("ResCache cacheRes function path or asset is null");
            return;
        }
        
        this.m_cacheMap.set(path, asset);
    }

    /**
     * 获取缓存资源
     * @param path 资源路径
     * @returns 资源
     */
    public getCacheRes(path: string): cc.Asset | undefined {
        if (!path) {
            console.error("ResCache getCacheRes function path is null");
            return;
        }
        return this.m_cacheMap.get(path);
    }

    /**
     * 移除缓存资源
     * @param path 资源路径
     * @returns 是否移除成功
     */
    public removeCacheRes(path: string): boolean {
        if (!path) {
            console.error("ResCache: path is null");
            return false;
        }

        const asset = this.m_cacheMap.get(path);
        if (asset) {
            this.m_cacheMap.delete(path);
            cc.assetManager.releaseAsset(asset);
            return true;
        }
        return false;
    }

    public destroy(): void {
        this.m_cacheMap.clear();        
    }

}