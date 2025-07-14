/**
 * 日志工具类
 */
export default class Log {
    /**默认开启堆栈*/
    public static ENABLE_STACK_TRACE = true;
    /**
     * 日志级别
     * DEBUG: 调试日志
     * PROD: 生产日志
     */
    public static LOG_LEVEL: 'DEBUG' | 'PROD' = 'DEBUG';

    /**日志级别权重 */
    private static readonly LEVEL_WEIGHTS = {
        ERROR: 4,
        WARNING: 3,
        NET: 2,
        BUSINESS: 2,
        TRACE: 1
    };

    public static readonly LOG_CONFIG = {
        NET: "网络日志",
        MODEL: "数据日志",
        BUSINESS: "业务日志",
        VIEW: "视图日志",
        CONFIG: "配置日志",
        TRACE: "标准日志",
        ERROR: "错误日志",
        WARNING: "警告日志",
    } as const;

    // 使用 Map 统一管理样式
    private static readonly STYLE_MAP = new Map([
        ['NET', 'color:#00ffff;'],
        ['MODEL', 'color:#ff6100;'],
        ['BUSINESS', 'color:#00ff00;'],
        ['VIEW', 'color:#ff00ff;'],
        ['CONFIG', 'color:#808080;'],
        ['TRACE', 'color:#808080;'],
        ['ERROR', 'color:#ff0000;font-weight:bold;'],
        ['WARNING', 'color:#ffff00;font-weight:bold;']
    ]);

    public static log(msg: any, type: keyof typeof Log.LOG_CONFIG = "TRACE", description?: string) {
        try {
            // 生产环境过滤低级别日志
            if (Log.LOG_LEVEL === 'PROD') {
                const weight = Log.LEVEL_WEIGHTS[type] || 0;
                if (weight < 2) return;
            }
            const style = this.STYLE_MAP.get(type) || '';
            this.print(type, style, msg, description);
        } catch (err) {
            console.error("Log log error:", err);
        }
    }



    private static print(type: keyof typeof Log.LOG_CONFIG, style: string, msg: any, description?: string) {
        const backLog = console.log || cc.log;
        const timestamp = this.getLogTimestamp();
        const typeName = Log.LOG_CONFIG[type];
        const stackInfo = Log.ENABLE_STACK_TRACE ? this.getStackInfo() : '';

        // 统一格式模板
        const parts = [
            `%c${timestamp}[${typeName}]${stackInfo}`,
            style
        ];

        if (description) parts.push(`\n  ↳ ${description}:`);
        parts.push(msg);

        backLog.apply(null, parts);
    }


    /**获取当前的时间戳 */
    private static getLogTimestamp(): string {
        const date = new Date();
        const pad = (num: number) => num.toString().padStart(2, '0');
        const padMs = (num: number) => num.toString().padStart(3, '0');
        return `[${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${padMs(date.getMilliseconds())}]`;
    }


    private static getStackInfo(): string {
        try {
            const stack = new Error().stack?.split('\n') || [];
            // 跳过当前调用栈的前3层（Error创建、getStackInfo、log方法）
            const targetLine = stack[4]?.trim() || '';

            // 通用解析方案：提取 "at [function] ([file]:line:column)" 格式
            const match = targetLine.match(/at\s+(.+?)\s+\(?(.+?):(\d+):(\d+)\)?/);
            if (!match) return '';

            const [, functionName, filePath, line] = match;
            const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

            return `[${fileName} → ${functionName || 'anonymous'}:${line}]`;
        } catch {
            return '[StackParseError]';
        }
    }

}