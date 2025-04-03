/**
 * 随机种子
 */
let randomSeed = Date.now();

/**
 * 计数器
 */
let counter = 0;

/**
 * 基于当前时间戳生成一个唯一的 id，
 */
export function generateUniqueId(length = 7): string {
  // 基于当前时间戳生成伪随机
  let msAsBase = randomSeed % Math.pow(36, length);

  // 如果毫秒数小于 100，则取反，保证至少 3 位数
  if (msAsBase < Math.pow(36, length - 1)) {
    msAsBase = Math.pow(36, length - 1) - msAsBase;
  }

  counter++;

  return (msAsBase + counter).toString(36);
}
