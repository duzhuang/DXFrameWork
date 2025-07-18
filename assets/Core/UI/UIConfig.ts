import { UILayer } from "./UILayer";

export interface UIConfig {
    uiName: string;       // UI 唯一标识
    prefabPath: string;   // prefab路径
    layer: UILayer;       // 所在层级
    cache?: boolean;      // 是否缓存实例
    priority?: number,    // 优先级
}