const fs = require('fs-extra');
const path = require('path');

console.log('Starting copy-red-dot script...');

// 获取参数
const forceCopy = process.argv[2] === 'force';
console.log(`Force copy mode: ${forceCopy}`);

const rootDir = path.resolve(__dirname, '..');
const source = path.join(rootDir, 'node_modules/cocos-red-dot-system/dist');
const target = path.join(rootDir, 'assets/Scripts/red-dot-system');

console.log(`Source path: ${source}`);
console.log(`Target path: ${target}`);

// 检查源目录是否存在
if (!fs.existsSync(source)) {
  console.log('cocos-red-dot-system not found in node_modules, skipping copy');
  process.exit(0);
}

// 检查目标目录是否存在
if (fs.existsSync(target)) {
  console.log('Target directory exists');
} else {
  console.log('Target directory does not exist, will create it');
}

// 强制拷贝或检查是否需要更新
let needCopy = forceCopy;
if (!needCopy && fs.existsSync(target)) {
  console.log('Checking if update is needed...');
  const sourceStats = fs.statSync(source);
  const targetStats = fs.statSync(target);
  needCopy = sourceStats.mtime > targetStats.mtime;
  console.log(`Source modified: ${sourceStats.mtime}`);
  console.log(`Target modified: ${targetStats.mtime}`);
  console.log(`Update needed: ${needCopy}`);
}

if (needCopy) {
  console.log('Copying cocos-red-dot-system to assets/Scripts...');
  try {
    fs.removeSync(target);
    console.log('Removed existing target directory');
    fs.copySync(source, target);
    console.log('Copy completed successfully!');
    
    // 验证拷贝结果
    const copiedFiles = fs.readdirSync(target);
    console.log(`Copied ${copiedFiles.length} files/directories`);
  } catch (error) {
    console.error('Error during copy operation:', error.message);
    process.exit(1);
  }
} else {
  console.log('cocos-red-dot-system is up to date, skipping copy');
}

console.log('copy-red-dot script finished');