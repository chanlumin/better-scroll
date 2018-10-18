import { inBrowser } from './env'

//  大多数电脑显示器的刷新频率是60Hz，大概相当于每秒钟重绘60次。大多数浏览器都会对重绘操作加以限制，
// 不超过显示器的重绘频率，因为即使超过那个频率用户体验也不会有提升。因此，最平滑动画的最佳循环间隔是
// 1000ms/60，约等于16.6ms。
// http://www.w3cplus.com/javascript/requestAnimationFrame.html
const DEFAULT_INTERVAL = 100 / 60
// => 1.6666666666666667

function noop() {
}

//  requestAnimationFrame优雅降低
export const requestAnimationFrame = (() => {
  if (!inBrowser) {
    /* istanbul ignore if */
    return noop
  }
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    // if all else fails, use setTimeout
    function (callback) {
      return window.setTimeout(callback, (callback.interval || DEFAULT_INTERVAL) / 2) // make interval as precise as possible.
    }
})()

export const cancelAnimationFrame = (() => {
  if (!inBrowser) {
    /* istanbul ignore if */
    return noop
  }
  return window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    function (id) {
      window.clearTimeout(id)
    }
})()