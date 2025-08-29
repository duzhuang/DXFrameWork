interface PoolableComponent {
    onRecycle?: () => void;
    onSpawn?: () => void;
}

export default class ObjectPool {

    /**对象池map */
    private m_poolMap: Map<string, cc.NodePool> = new Map();
    /**最大数量 */
    private m_maxPoolSize: number = 50;

    public setMaxPoolSize(size: number) {
        this.m_maxPoolSize = size;
    }

    /**
     * 预生成指定数量的节点
     * @param prefab 预制体
     * @param count 数量
     */
    public prewarm(prefab: cc.Prefab, count: number) {
        if (!prefab) throw new Error("Prefab cannot be null or undefined!");
        const pool = this.getPool(prefab);
        const maxCount = Math.min(count, this.m_maxPoolSize);
        for (let i = pool.size(); i < maxCount; i++) {
            const node = cc.instantiate(prefab);
            node.active = false;
            pool.put(node);
        }
    }

    /**
     * 获取对象池
     * @param prefab 
     * @returns 对象池
     */
    private getPool(prefab: cc.Prefab): cc.NodePool {
        if (!prefab) throw new Error("Prefab cannot be null or undefined");
        const key = this.getKey(prefab);
        let pool = this.m_poolMap.get(key);
        if (!pool) {
            pool = new cc.NodePool();
            this.m_poolMap.set(key, pool);
        }
        return pool;
    }

    private getKey(prefab: cc.Prefab): string {
        return prefab.data.uuid;
    }

    /**
     * 从对象池获取节点（自动处理节点激活状态）
     * @param prefab 预制体
     * @returns 准备好的节点
     */
    public getNode(prefab: cc.Prefab): cc.Node | undefined {
        if (!prefab) {
            console.error("Prefab cannot be null or undefined!");
            return;
        }

        const pool = this.getPool(prefab);
        const node = pool.size() > 0 ? pool.get() : cc.instantiate(prefab);

        node.active = true;
        this.executeSpawnLogic(node);
        return node;
    }

    /*
    * 回收节点到对象池（自动处理父节点和状态重置）
    * @param node 要回收的节点
    * @param prefab 对应的预制体
    */
    public recycleNode(node: cc.Node, prefab: cc.Prefab): void {
        if (!node || !prefab) {
            console.error("Node and prefab cannot be null or undefined!");
            return;
        }

        if(!cc.isValid(node)) {
            console.error("Node is invalid!");
            return;
        }

        this.executeRecycleLogic(node);
        node.removeFromParent();
        node.active = false;
        let pool = this.getPool(prefab);
        if (pool.size() < this.m_maxPoolSize) {
            pool.put(node);
        } else {
            node.destroy();
        }
    }

    /**
     * 执行spawn逻辑
     * @param node
     */
    private executeSpawnLogic(node: cc.Node) {
        // 如果频繁执行，可考虑缓存结果
        const comps = node.getComponents(cc.Component);
        for (let index = 0; index < comps.length; index++) {
            const comp = comps[index];
            if (this.isPoolableComponent(comp)) {
                comp.onSpawn?.();
                break;// 如果确定每个节点只有一个目标组件可提前退出
            }

        }
    }

    /**
     * 执行recycle逻辑
     * @param node
     */
    private executeRecycleLogic(node: cc.Node) {
        node.getComponents(cc.Component).forEach((comp) => {
            if (this.isPoolableComponent(comp)) {
                comp.onRecycle?.();
            }         
        })
    }   

    // 新增类型守卫
    private isPoolableComponent(comp: any): comp is PoolableComponent {
        return comp && (typeof comp.onSpawn === "function" || typeof comp.onRecycle === "function");
    }


    /**
    * 清理指定预制体的对象池
    * @param prefab 
    */
    public clearPool(prefab: cc.Prefab): void {
        if (!prefab) {
            console.error("Prefab cannot be null or undefined!");
            return;
        }

        const key = this.getKey(prefab);
        const pool = this.m_poolMap.get(key);

        if (pool) {
            pool.clear();
            this.m_poolMap.delete(key);
        }
    }

    /**
    * 清理所有对象池
    */
    public clear(): void {
        //清空map
        this.m_poolMap.clear();
    }
}