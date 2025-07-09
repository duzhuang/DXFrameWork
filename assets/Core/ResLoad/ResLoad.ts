/**
 * 资源加载单例
 */
export default class ResLoad {
    private static m_instance: ResLoad;

    public static get instance(): ResLoad {
        if (!this.m_instance) {
            this.m_instance = new ResLoad();
        }
        return this.m_instance;
    }

    /**
     * 加载资源
     * @param path 资源路径
     * @param type 资源类型
     * @param callback 回调函数
     */
    public loadRes(
        path: string,
        type: typeof cc.Asset,
        callback?: (err: Error | null, asset: any) => void
    ): void {
        if (!path || !type) {
            const err = new Error("ResLoad loadRes function path or type is null");
            console.error(err.message);
            callback?.(err, null); // 传递错误
            return;
        }
        cc.resources.load(path, type, (err, asset) => {
            if (err) {
                console.error("ResLoad loadRes function err:", err);
                callback(err, null);
                return;
            }
            callback?.(null, asset)
        })
    }

    /**
     * 异步加载资源
     * @param path 资源路径
     * @param type 资源类型
     * @returns
     */
    public async loadResAsync<T extends cc.Asset>(
        path: string,
        type: typeof cc.Asset
    ): Promise<T> {
        if (!path || !type) {            
            const err = new Error("ResLoad loadResAsync function path or type is null");            
            console.error(err.message);
            return Promise.reject(err);
        }

        return new Promise<T>((resolve, reject) => {
            cc.resources.load(path, type, (err, asset: T) => {
                if (err) {
                    console.error("ResLoad loadResAsync error:", err);
                    reject(err);
                    return;
                }
                resolve(asset);
            })
        })
    }

}