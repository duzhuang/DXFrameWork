/**事件类型 */
interface EventCallBack {
    /**回调函数 */
    callback: Function;
    /**回调函数的this对象 */
    target: any;
    /**是否强制执行(true 对象为节点 && 节点显示 才能触发回调) */
    force?: boolean;
    /**优先级（数值越大越先执行） */
    priority?: number;
}

/**
 * @description 事件中心 
 */
export default class EventCenter {

    /** 事件数组 */
    private static m_eventMap: Map<string, Array<EventCallBack>> = new Map<string, Array<EventCallBack>>();
    /** 事件数组 */
    private static m_eventMapOnce: Map<string, Array<EventCallBack>> = new Map<string, Array<EventCallBack>>();

    public static destroy(): void {
        this.m_eventMap.clear();
        this.m_eventMapOnce.clear();
    }

    /**
      * 发布事件
      * @param eventName 事件名称
      * @param customData 自定义数据      
      */
    public static postEvent(eventName: string, customData?: any): void {
        // 处理普通事件
        this.processEvents(this.m_eventMap, eventName, customData, false);

        // 处理一次性事件
        this.processEvents(this.m_eventMapOnce, eventName, customData, true);
    }

    /** 注册持久事件 */
    public static onEvent(
        eventName: string,
        callback: Function,
        target: any,
        force?: boolean,
        priority = 0
    ): void {
        this.addEvent(this.m_eventMap, eventName, callback, target, force, priority);
    }

    /** 注册一次性事件 */
    public static onEventOnce(
        eventName: string,
        callback: Function,
        target: any,
        force?: boolean,
        priority = 0
    ): void {
        this.addEvent(this.m_eventMapOnce, eventName, callback, target, force, priority);
    }


    /** 移除事件 */
    public static offEvent(eventName: string, callback?: Function, target?: any): void {
        // 移除特定回调
        if (callback && target) {
            this.removeEvent(this.m_eventMap, eventName, callback, target);
            this.removeEvent(this.m_eventMapOnce, eventName, callback, target);
        }
        // 移除整个事件类型
        else {
            this.m_eventMap.delete(eventName);
            this.m_eventMapOnce.delete(eventName);
        }
    }


    /** 检查事件是否存在 */
    public static hasEvent(eventName: string): boolean {
        return this.m_eventMap.has(eventName) || this.m_eventMapOnce.has(eventName);
    }


    // =============== 私有方法 =============== //

    /** 添加事件到指定集合 */
    private static addEvent(
        map: Map<string, EventCallBack[]>,
        eventName: string,
        callback: Function,
        target: any,
        force?: boolean,
        priority = 0
    ): void {
        if (!map.has(eventName)) {
            map.set(eventName, []);
        }

        const events = map.get(eventName)!;

        // 避免重复添加
        const exists = events.some(e =>
            e.callback === callback && e.target === target
        );

        if (!exists) {
            const newEvent: EventCallBack = { callback, target, force, priority };
            // 按优先级插入排序（降序）
            const index = events.findIndex(e => (e.priority || 0) < priority);
            if (index === -1) {
                events.push(newEvent);
            } else {
                events.splice(index, 0, newEvent);
            }
        }
    }


    /** 处理事件执行 */
    private static processEvents(
        map: Map<string, EventCallBack[]>,
        eventName: string,
        customData: any,
        isOnce: boolean,        
    ): void {        

        const events = map.get(eventName);
        if (!events?.length) return;

        // 创建执行副本（避免回调中修改原数组）
        const executeList = isOnce ? [...events] : events.slice();

        // 清空一次性事件列表
        if (isOnce) {
            events.length = 0;
        }

        // 顺序执行（已按优先级排序）
        for (const event of executeList) {
            try {
                // 通用激活检查
                if (event.force && !this.isTargetActive(event.target)) {
                    continue;
                }

                event.callback.call(event.target, customData);
            } catch (e) {
                console.error(`Event ${eventName} error:`, e);
            }
        }
    }


    /** 移除事件 */
    private static removeEvent(
        map: Map<string, EventCallBack[]>,
        eventName: string,
        callback: Function,
        target: any
    ): void {
        const events = map.get(eventName);
        if (!events) return;

        const index = events.findIndex(
            e => e.callback === callback && e.target === target
        );

        if (index !== -1) {
            events.splice(index, 1);
            if (events.length === 0) {
                map.delete(eventName);
            }
        }
    }

    /** 通用目标激活状态检查 */
    private static isTargetActive(target: any): boolean {
        // 通用实现：可根据不同引擎扩展
        return target.node && target.node.activeInHierarchy
    }

}