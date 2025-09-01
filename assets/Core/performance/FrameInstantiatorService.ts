
/**类型 */
type InstantiateSource = cc.Prefab | cc.Node;

/**任务接口 */
interface ITask {
    source: InstantiateSource;
    total: number;
    done: number;
    callback: (node: cc.Node, index: number) => void;
}

/**
 * 分帧实例化调度器
 */
export default class FrameInstantiatorService {
    private static m_instance: FrameInstantiatorService;

    /** 单例获取 */
    public static get instance(): FrameInstantiatorService {
        if (!this.m_instance) {
            this.m_instance = new FrameInstantiatorService();
        }
        return this.m_instance;
    }

    /** 任务队列 */
    private m_tasks: ITask[] = [];
    /** 是否已在调度中 */
    private m_scheduled = false;

    /** 每帧初始最大实例化数 */
    private m_maxPerFrame = 5;
    /** 每帧实例化上限 */
    private readonly m_maxPerFrameCap = 20;
    /** 单帧时间预算（ms） */
    private readonly m_frameBudget = 8;

    /** FPS 调整阈值 */
    private readonly m_reduceFps = 30;
    private readonly m_increaseFps = 50;

    /** 引擎 Scheduler */
    private m_scheduler: cc.Scheduler = cc.director.getScheduler();

    private constructor() { }


    /**
     * 添加实例化任务
     * @param source 要实例化的源，可传 Prefab 或已有 Node  
     * @param count 需要实例化的个数  
     * @param callback 每实例化一个新节点触发，参数 (node, index)  
     */
    public addTask(
        source: InstantiateSource,
        count: number,
        callback: (node: cc.Node, index: number) => void,
    ): void {
        if (!source || count <= 0) {
            console.error('FrameInstantiatorService.addTask 参数错误', source, count);
            return;
        }

        this.m_tasks.push({ source, total: count, done: 0, callback });
        this.startSchedule();
    }

    /** 清空所有任务并停止调度 */
    public clear(): void {
        this.m_tasks.length = 0;
        if (this.m_scheduled) {
            this.m_scheduled = false;
            this.stopSchedule();
        }
    }

    /** 启动每帧调度 */
    private startSchedule() {
        if (this.m_scheduled) return;
        cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, this.step, this);
    }

    /** 停止每帧调度 */
    private stopSchedule() {
        cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, this.step, this);
        this.m_scheduled = false;
    }


    /** 每帧执行入口 */
    private step(): void {
        if (this.m_tasks.length === 0) {
            this.stopSchedule();
            return;
        }

        //时间预算起点
        const startTime = new Date().getTime();
        let createdThisFrame = 0;

        //当前帧率 & 动态调整每帧上限
        const deltaTime = cc.director.getDeltaTime();
        const fps = deltaTime > 0 ? 1 / deltaTime : 60;
        if (fps < this.m_reduceFps && this.m_maxPerFrame > 1) {
            this.m_maxPerFrame--;
        } else if (fps > this.m_increaseFps && this.m_maxPerFrame < this.m_maxPerFrameCap) {
            this.m_maxPerFrame++;
        }

        // 执行实例化，直到满足任一条件退出
        while (
            this.m_tasks.length > 0 &&
            createdThisFrame < this.m_maxPerFrame &&
            (new Date().getTime() - startTime) < this.m_frameBudget
        ) {
            const task = this.m_tasks[0];
            const node: cc.Node = cc.instantiate(task.source) as cc.Node;
            task.callback?.(node, task.done);
            task.done++;
            createdThisFrame++;

            if (task.done >= task.total) {
                this.m_tasks.shift();
            }
        }
    }
}