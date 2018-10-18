// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/performance
// 备注: 单纯的调用当前方法的时间间隔是window.performance.now 
// 从某一个window.performance.now 表示从某一个时刻+ window.performance.now 时间与Date.now()相等
// 而window.performance的时间精确度最多可以到微妙 如果浏览器支持，最少可以到毫秒
export function getNow() {
  return window.performance && window.performance.now ? (window.performance.now() + window.performance.timing.navigationStart) : +new Date()
}
/**
 * 浅复制 
 * @param {Array} target 目标数组
 * @param  {...any} rest 服药复制的数组
 */
export function extend(target, ...rest) {
  for (let i = 0; i < rest.length; i++) {
    let source = rest[i]
    for (let key in source) {
      target[key] = source[key]
    }
  }
  return target
}

/**
 * 判断是未定义的数值, 未定义的定义是
 * 等于空置 或者等于undefined的值
 * @param {...any} v 变量
 */
export function isUndef(v) {
  return v === undefined || v === null
}
/**
 * @param {Number} x x轴的坐标
 * @param {Number} y y轴的坐标
 */
export function getDistance(x, y) {
  return Math.sqrt(x * x + y * y)
}
