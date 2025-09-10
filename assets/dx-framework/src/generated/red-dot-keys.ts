
/**
 * 红点系统键常量生成文件
 * 
 * 自动生成，请勿手动修改
 * 
 * 使用方式：
 * 1. 导入需要的常量：import { RedDotKeys, RedDotType, RedDotTypeMap } from './red-dot-keys'
 * 2. 使用RedDotKeys获取字符串键，RedDotType用于编辑器枚举，RedDotTypeMap用于枚举值到字符串的映射
 * 3. 使用isValidRedDotKey验证键的有效性
 */

export const RedDotKeys = {
  ROOT: 'root' as const,
  ROOT_TASK: 'root.task' as const,
  ROOT_TASK_DAILY: 'root.task.daily' as const,
  ROOT_TASK_DAILY_DAILY1: 'root.task.daily.daily1' as const,
  ROOT_TASK_DAILY_DAILY2: 'root.task.daily.daily2' as const,
  ROOT_TASK_ACHIEVEMENT: 'root.task.achievement' as const,
  ROOT_TASK_ACHIEVEMENT_ACHIEVEMENT1: 'root.task.achievement.achievement1' as const,
  ROOT_TASK_ACHIEVEMENT_ACHIEVEMENT2: 'root.task.achievement.achievement2' as const,
  ROOT_MAIL: 'root.mail' as const,
  ROOT_MAIL_MAIL1: 'root.mail.mail1' as const,
  ROOT_MAIL_MAIL2: 'root.mail.mail2' as const
} as const;

export const RedDotType = cc.Enum({
  ROOT: 0,
  ROOT_TASK: 1,
  ROOT_TASK_DAILY: 2,
  ROOT_TASK_DAILY_DAILY1: 3,
  ROOT_TASK_DAILY_DAILY2: 4,
  ROOT_TASK_ACHIEVEMENT: 5,
  ROOT_TASK_ACHIEVEMENT_ACHIEVEMENT1: 6,
  ROOT_TASK_ACHIEVEMENT_ACHIEVEMENT2: 7,
  ROOT_MAIL: 8,
  ROOT_MAIL_MAIL1: 9,
  ROOT_MAIL_MAIL2: 10
})

export const RedDotTypeMap = {
  [RedDotType.ROOT]: 'root',
  [RedDotType.ROOT_TASK]: 'root.task',
  [RedDotType.ROOT_TASK_DAILY]: 'root.task.daily',
  [RedDotType.ROOT_TASK_DAILY_DAILY1]: 'root.task.daily.daily1',
  [RedDotType.ROOT_TASK_DAILY_DAILY2]: 'root.task.daily.daily2',
  [RedDotType.ROOT_TASK_ACHIEVEMENT]: 'root.task.achievement',
  [RedDotType.ROOT_TASK_ACHIEVEMENT_ACHIEVEMENT1]: 'root.task.achievement.achievement1',
  [RedDotType.ROOT_TASK_ACHIEVEMENT_ACHIEVEMENT2]: 'root.task.achievement.achievement2',
  [RedDotType.ROOT_MAIL]: 'root.mail',
  [RedDotType.ROOT_MAIL_MAIL1]: 'root.mail.mail1',
  [RedDotType.ROOT_MAIL_MAIL2]: 'root.mail.mail2'
}

export type RedDotKey = typeof RedDotKeys[keyof typeof RedDotKeys];

// 类型守卫函数
export function isValidRedDotKey(key) {
  return Object.values(RedDotKeys).includes(key);
}

// 工具函数：获取所有键
export function getAllRedDotKeys() {
  return Object.values(RedDotKeys);
}

// 工具函数：检查键是否存在
export function hasRedDotKey(key) {
  return isValidRedDotKey(key);
}
