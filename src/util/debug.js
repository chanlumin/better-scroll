// bs警告框
export function warn(msg) {
  console.error(`[BScroll warn]: ${msg}`)
}

export function assert(condition, msg) {
  if (!condition) {
    throw new Error(('[BScroll] ' + msg))
  }
}