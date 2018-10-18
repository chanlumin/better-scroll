import { inBrowser, isWeChatDevTools } from './env'
import { extend } from './lang'

let elementStyle = inBrowser && document.createElement('div').style

/**
 * transfromName兼容性处理,返回当前浏览器支持的transformName
 */
let vendor = (() => {
  if (!inBrowser) {
    return false
  }
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

/**
 * 添加浏览器样式支持
 * @param {String} style 传入的样式字符串
 */
function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  // 标准情况下 不用fix直接返回style 只fix transitionEnd
  if (vendor === 'standard') {
    if (style === 'transitionEnd') {
      return 'transitionend'
    }
    return style
  }
  // 如果支持的是webkit 那么如下 
  // transform => webkit + T + ransform => webkitTransform
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
// passive 选项的默认值始终为false。但是，这引入了处理某些触摸事件（以及其他）
// 的事件监听器在尝试处理滚动时阻止浏览器的主线程的可能性，从而导致滚动处理期间性能可能大大降低
// capture => 会在该类型的事件捕获阶段传播到该 EventTarget 时触发
export function addEvent(el, type, fn, capture) {
  el.addEventListener(type, fn, {passive: false, capture: !!capture})
}

export function removeEvent(el, type, fn, capture) {
  el.removeEventListener(type, fn, {passive: false, capture: !!capture})
}

/**
 * 获取元素对象到文档的顶部和文档的左边的距离
 * 返回 {left, top}
 * @param {Element} el 元素对象
 */
export function offset(el) {
  let left = 0
  let top = 0

  while (el) {
    left -= el.offsetLeft
    top -= el.offsetTop
    el = el.offsetParent
  }

  return {
    left,
    top
  }
}

/**
 * 获取到元素到body的offset
 * @param {Element} el 传入DOM Element
 */
export function offsetToBody(el) {
  let rect = el.getBoundingClientRect()
  // window.pageXOffset=> window.scrollX
  // window.pageYOffset => window.scrollY 兼容性好一点
  return {
    left: -(rect.left + window.pageXOffset),
    top: -(rect.top + window.pageYOffset)
  }
}
// '-' + webkit + '-'
export const cssVendor = (vendor && vendor !== 'standard') ? '-' + vendor.toLowerCase() + '-' : ''

let transform = prefixStyle('transform')
let transition = prefixStyle('transition')

export const hasPerspective = inBrowser && prefixStyle('perspective') in elementStyle
// fix issue #361
export const hasTouch = inBrowser && ('ontouchstart' in window || isWeChatDevTools)
export const hasTransform = transform !== false
export const hasTransition = inBrowser && transition in elementStyle

export const style = {
  transform,
  transition,
  transitionTimingFunction: prefixStyle('transitionTimingFunction'),
  transitionDuration: prefixStyle('transitionDuration'),
  transitionDelay: prefixStyle('transitionDelay'),
  transformOrigin: prefixStyle('transformOrigin'),
  transitionEnd: prefixStyle('transitionEnd')
}

export const TOUCH_EVENT = 1
export const MOUSE_EVENT = 2

export const eventType = {
  touchstart: TOUCH_EVENT,
  touchmove: TOUCH_EVENT,
  touchend: TOUCH_EVENT,

  mousedown: MOUSE_EVENT,
  mousemove: MOUSE_EVENT,
  mouseup: MOUSE_EVENT
}

/**
 * 计算元素的rect中的=> left top width height 值
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect
 * rect的left top  所以else那个判断是返回的值 是错误的呀 ?? 
 * @param {Node} el 传入的element
 */
export function getRect(el) {
  if (el instanceof window.SVGElement) {
    let rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}
/**
 * 如果el对象中的exception都存在于exceptions中的话,为真
 * 否则为假
 * @param {Element} el 
 * @param {Object} exceptions 
 */
export function preventDefaultException(el, exceptions) {
  for (let i in exceptions) {
    if (exceptions[i].test(el[i])) {
      return true
    }
  }
  return false
}
// 创建一个tap的event事件 记录距离视口X轴和距离视口Y轴的位置
// https://developer.mozilla.org/zh-CN/docs/Web/API/Document/createEvent#Notes
export function tap(e, eventName) {
  let ev = document.createEvent('Event')
  // 创建HTML事件
  ev.initEvent(eventName, true, true)
  ev.pageX = e.pageX
  ev.pageY = e.pageY
  e.target.dispatchEvent(ev)
}

/**
 * 创建click事件并在元素上触发这个事件
 * @param {Node} e 元素 
 * @param {event} event 事件默认是click 
 */
export function click(e, event = 'click') {
  let eventSource
  // 非touch事件eventSource获取
  if (e.type === 'mouseup' || e.type === 'mousecancel') {
    eventSource = e
  } else if (e.type === 'touchend' || e.type === 'touchcancel') {
    // touch事件 eventSource获取
    eventSource = e.changedTouches[0]
  }
  let posSrc = {}
  if (eventSource) {
    // 鼠标相对于屏幕坐标的水平位移
    posSrc.screenX = eventSource.screenX || 0
    posSrc.screenY = eventSource.screenY || 0
    // MouseEvent.clientX 是只读属性， 它提供事件发生时的应用客户端区域的水平坐标 (与页面坐标不同)。
    // 例如，不论页面是否有水平滚动，当你点击客户端区域的左上角时，鼠标事件的 clientX 值都将为 0 
    posSrc.clientX = eventSource.clientX || 0
    posSrc.clientY = eventSource.clientY || 0
  }
  let ev
  const bubbles = true
  const cancelable = true
  if (typeof MouseEvent !== 'undefined') {
    try {
      // 创建鼠标事件
      ev = new MouseEvent(event, extend({
        bubbles,
        cancelable
      }, posSrc))
    } catch (e) {
      // 创建普通事件
      createEvent()
    }
  } else {
    // 创建普通事件 
    createEvent()
  }

  function createEvent() {
    ev = document.createEvent('Event')
    ev.initEvent(event, bubbles, cancelable)
    extend(ev, posSrc)
  }

  // forwardedTouchEvent set to true in case of the conflict with fastclick
  ev.forwardedTouchEvent = true
  ev._constructed = true
  e.target.dispatchEvent(ev)
}

/**
 * 创建双击事件
 * @param {Node} e 元素节点
 */
export function dblclick(e) {
  click(e, 'dblclick')
}

/**
 * 
 * @param {Node} el DOM元素插入节点
 * @param {Node} target 被插入节点
 */
export function prepend(el, target) {
  // 存在第一个节点insertBefore
  if (target.firstChild) {
    before(el, target.firstChild)
  } else {
    // 没有子元素节点,直接作为子元素节点append上去
    target.appendChild(el)
  }
}

export function before(el, target) {
  target.parentNode.insertBefore(el, target)
}

/**
 * 删除元素节点
 * @param {Node} el DOM元素节点
 * @param {Node} child 被删除的对象
 */
export function removeChild(el, child) {
  el.removeChild(child)
}
