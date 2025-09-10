/**
 * 红点系统键生成脚本
 * 
 * 功能：根据JSON配置自动生成红点系统的TypeScript常量、枚举和工具函数
 * 
 * 配置文件：../src/configs/red-dot-system/red-dot-system.json
 * 生成文件：../src/generated/red-dot-keys.ts
 * 
 * 使用方式：
 * 1. 配置red-dot-system.json文件，定义红点节点结构
 * 2. 运行脚本：node scripts/generate-red-dot-keys.js
 * 3. 在代码中导入生成的red-dot-keys.ts文件使用
 * 
 * 建议将脚本添加到package.json的prebuild脚本中自动执行
 */


const fs = require('fs');
const path = require('path');


// 读取配置文件
const configPath = path.join(__dirname, '../src/configs/red-dot-system/red-dot-system.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// 生成扁平化的key常量
function generateKeys(obj, prefix = '') {
  let keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keys.push(fullKey);

    if (value.children) {
      keys = keys.concat(generateKeys(value.children, fullKey));
    }
  }

  return keys;
}

const allKeys = generateKeys(config.nodes);

// 生成TypeScript文件
const tsContent = `
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
  ${allKeys.map(key => {
  const constName = key.toUpperCase().replace(/\./g, '_');
  return `${constName}: '${key}' as const`;
}).join(',\n  ')}
} as const;

export const RedDotType = cc.Enum({
  ${allKeys.map((key, index) => {
  const constName = key.toUpperCase().replace(/\./g, '_');
  return `${constName}: ${index}`;
}).join(',\n  ')}
})

export const RedDotTypeMap = {
  ${allKeys.map((key, index) => {
  const constName = key.toUpperCase().replace(/\./g, '_');
  return `[RedDotType.${constName}]: '${key}'`;
}).join(',\n  ')}
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
`;

// 确保目录存在
const outputDir = path.join(__dirname, '../src/generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 写入文件
const outputPath = path.join(outputDir, 'red-dot-keys.ts');
fs.writeFileSync(outputPath, tsContent);

console.log(`Generated ${allKeys.length} red dot keys to ${outputPath}`);