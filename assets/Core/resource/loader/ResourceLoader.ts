/**
 * 资源加载单例
 * 支持并发加载
 * 2、同时加载多个资源
 */
export default class ResourceLoader {

    private static m_instance: ResourceLoader;

    /**加载队列：记录正在加载的资源 */
    private m_loadingQueue: Map<string, Promise<any>> = new Map();

    public static get instance(): ResourceLoader {
        if (!this.m_instance) {
            this.m_instance = new ResourceLoader();
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
            const err = new Error("ResourceLoader loadRes function path or type is null");
            console.error(err.message);
            callback?.(err, null); // 传递错误
            return;
        }

        //检查是否正在加载
        if (this.m_loadingQueue.has(path)) {                
            //添加到现有的加载队列
            this.m_loadingQueue.get(path)!.then((asset) => {
                callback?.(null, asset);
            }).catch((err) => {
                callback?.(err, null);
            })
            return;
        }

        //创建新的加载队列
        const loadTask = new Promise<any>((resolve, reject) => {
            cc.resources.load(path, type, (err, asset) => {
                //无论加载成功失败，从加载队列中移除
                this.m_loadingQueue.delete(path);
                if (err) {
                    reject(err);
                    return;
                }
                resolve(asset);
            })
        })

        //添加到加载队列
        this.m_loadingQueue.set(path, loadTask);

        //执行加载任务
        loadTask.then((asset) => {
            callback?.(null, asset);
        }).catch((err) => {
            callback?.(err, null);
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
            const err = new Error("ResourceLoader loadResAsync function path or type is null");
            console.error(err.message);
            return Promise.reject(err);
        }

        //检查是否正在加载
        if (this.m_loadingQueue.has(path)) {             
            return this.m_loadingQueue.get(path)! as Promise<T>;
        }

        //创建新的加载任务
        const loadTask = new Promise<T>(async (resolve, reject) => {
            try {
                const asset = await this.loadInternal<T>(path, type);
                resolve(asset);
            } catch (err) {
                reject(err);
            } finally {
                this.m_loadingQueue.delete(path);
            }
        })

        //添加到加载队列
        this.m_loadingQueue.set(path, loadTask);

        return loadTask;
    }

    /**
     * 加载资源（内部使用）
     * @param path 资源路径
     * @param type 资源类型
     * @returns
     */
    private loadInternal<T extends cc.Asset>(
        path: string,
        type: typeof cc.Asset,
    ) {
        return new Promise<T>((resolve, reject) => {
            cc.resources.load(path, type, (err, asset: T) => {
                if (err) {
                    console.error("ResourceLoader loadResAsync error:", err);
                    reject(err);
                    return;
                }
                resolve(asset);
            })
        })
    }


    /**
    * 取消所有加载中的请求
    */
    public cancelAll(): void {
        // 注意：这会导致所有等待中的Promise被拒绝
        this.m_loadingQueue.forEach((promise, path) => {
            promise.catch(() => { });
        });
        this.m_loadingQueue.clear();
    }

}