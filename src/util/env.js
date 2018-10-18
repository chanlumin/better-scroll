// ssr support
export const inBrowser = typeof window !== 'undefined'
// 如果在浏览器的环境的话获取ua并且转换为小写字母
export const ua = inBrowser && navigator.userAgent.toLowerCase()
export const isWeChatDevTools = ua && /wechatdevtools/.test(ua)
export const isAndroid = ua && ua.indexOf('android') > 0
