// 动画的贝塞尔曲线和其对应的函数
export const ease = {
  // easeOutQuint
  swipe: {
    style: 'cubic-bezier(0.23, 1, 0.32, 1)',
    fn: function (t) {
      return 1 + (--t * t * t * t * t)
    }
  },
  // easeOutQuard
  // 超过边缘回弹的动画曲线
  swipeBounce: {
    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fn: function (t) {
      return t * (2 - t)
    }
  },
  // easeOutQuart
  bounce: {
    style: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    fn: function (t) {
      return 1 - (--t * t * t * t)
    }
  }
}
