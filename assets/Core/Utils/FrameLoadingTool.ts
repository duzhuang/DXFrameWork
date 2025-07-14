/**
 * 分帧实例化管理器
 */
export default class FrameLoadingTool {
    /**队列 */
    private m_loadingQueue: {
        source: cc.Prefab | cc.Node,
        count: number,
        callback?: (node: cc.Node, index: number) => void,
    }[] = [];

    /**当前任务 */
    private m_currentTask: {
        source: cc.Prefab | cc.Node,
        count: number,
        callback?: (node: cc.Node, index: number) => void,
        created: number
    } | null = null;

    /**最大预加载数量 */
    private MAX_PRELOAD_FRAME: number = 5;
    /**最大预加载数量最大值 */
    private MAX_PRELOAD_FRAME_MAX = 20;
    // 新增：帧时间预算（ms）
    private FRAME_TIME_BUDGET = 8;
    /**减少生成数量的帧数线 */
    private REDUCE_FRAME = 30;
    /**增加生成数量的帧数线 */
    private INCREASE_FRAME = 50;

    /**是否正在运行 */
    private m_isRuning: boolean = false;



    public addTask(
        source: cc.Prefab | cc.Node,
        count: number,
        callback?: (node: cc.Node, index: number) => void
    ): void {
        if (!source || count <= 0) {
            console.error("FrameLoading addTask function source or count is null");
            return;
        }

        this.m_loadingQueue.push({
            source,
            count,
            callback,
        })

        if (!this.m_isRuning) {
            this.runTask();
        }
    }

    /**
     * 执行任务
     */
    private runTask(): void {
        this.m_isRuning = true;
        if (this.m_loadingQueue.length === 0) {
            this.m_isRuning = false;
            return;
        }

        this.scheduleFrameLoading();
    }

    /**
     * 调度帧加载
     */
    private scheduleFrameLoading(): void {
        if (!this.m_currentTask && this.m_loadingQueue.length > 0) {
            const task = this.m_loadingQueue.shift();
            this.m_currentTask = {
                source: task!.source,
                count: task!.count,
                callback: task!.callback,
                created: 0,
            }
        }

        this.executeFrameLoading();
    }

    /**
     * 执行帧加载
     */
    private executeFrameLoading(): void {
        if (!this.m_currentTask) return;
        //动态调整加载大小
        this.adjustLoadingSize();
        //获取当前帧开始时间
        const startTime = Date.now();
        //当前加载的数量
        let currentFrameCount = 0;
        while (this.m_currentTask.created < this.m_currentTask.count) {
            //实例化节点
            const node = cc.instantiate(this.m_currentTask.source) as cc.Node;
            //执行回调
            this.m_currentTask.callback?.(node, this.m_currentTask.created);
            this.m_currentTask.created++;
            currentFrameCount++;

            //如果当前帧加载数量达到最大预加载数量，跳出循环
            if (currentFrameCount >= this.MAX_PRELOAD_FRAME) {
                break;
            }
            //如果当前帧时间超过预算，跳出循环
            if (Date.now() - startTime > this.FRAME_TIME_BUDGET) {
                break;
            }
        }

        //检查任务状态
        if (this.m_currentTask.created >= this.m_currentTask.count) {
            this.m_currentTask = null;
            this.m_isRuning = false;
        }

        //调度下一帧继续
        requestAnimationFrame(() => {
            this.scheduleFrameLoading();
        })
    }

    /**
     * 动态调整加载大小
     * 可以根据当前设备性能和资源需求动态调整加载大小
     * 这里只是一个简单的示例，实际应用中需要根据具体情况进行调整
     */
    private adjustLoadingSize(): void {
        const deltaTime = cc.director.getDeltaTime();
        const frameRate = 1 / deltaTime;
        if (frameRate < this.REDUCE_FRAME) {
            this.MAX_PRELOAD_FRAME = Math.max(1, this.MAX_PRELOAD_FRAME - 1);
        } else if (frameRate > this.INCREASE_FRAME && this.MAX_PRELOAD_FRAME < this.MAX_PRELOAD_FRAME_MAX) {
            this.MAX_PRELOAD_FRAME = Math.min(20, this.MAX_PRELOAD_FRAME + 1);
        }
    }

    public clear(): void {
        this.m_loadingQueue = [];
        this.m_currentTask = null;
        this.m_isRuning = false;
    }
}