export function momentum(current, start, time, lowerMargin, upperMargin, wrapperSize, options) {
  // 距离
  let distance = current - start
  // s/t => v
  let speed = Math.abs(distance) / time

  // 加速度, 项目高度, 运动时间, wheel?, 运动时间
  // 这个配置是为了做 picker 组件用的，默认为 false，如果开启则需要配置一个 Object，例如：{selectedIndex: 0, rotate: 25, adjustTime: 400}
  let {deceleration, itemHeight, swipeBounceTime, wheel, swipeTime} = options
  // 设置 momentum 动画的动画时长。
  // swipeBounceTime 设置当运行 momentum 动画时，超过边缘后的回弹整个动画时间。 默认值：500
  let duration = swipeTime 
  let rate = wheel ? 4 : 15
  // current + (current - start) / time * deceleration * (符号)
  // 默认的减速度为0.0006
  // ?? 惯性运动的最终位移是  当前位移+ 速度除以减速度?
  let destination = current + speed / deceleration * (distance < 0 ? -1 : 1)
  // console.log(current, destination)

  // 处理 picker需要移动的位移
  if (wheel && itemHeight) {
    destination = Math.round(destination / itemHeight) * itemHeight
  }

  // console.log(lowerMargin, upperMargin, wrapperSize)
  if (destination < lowerMargin) {
    // 存在wrapperSize取到 destination 重新计算 否则取loweMargin
    destination = wrapperSize ? Math.max(lowerMargin - wrapperSize / 4, lowerMargin - (wrapperSize / rate * speed)) : lowerMargin
    duration = swipeBounceTime
  } else if (destination > upperMargin) {
    destination = wrapperSize ? Math.min(upperMargin + wrapperSize / 4, upperMargin + wrapperSize / rate * speed) : upperMargin
    duration = swipeBounceTime
  }

  return {
    destination: Math.round(destination),
    duration
  }
}
