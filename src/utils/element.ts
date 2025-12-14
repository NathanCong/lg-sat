/**
 * 通过 className 获取元素
 */
export function getElementByClassName(className: string) {
  return document.querySelector(`.${className}`)
}

/**
 * 获取元素宽度
 */
export function getElementWidth(element: Element | null) {
  if (!element) {
    return 0
  }
  const width = element.getBoundingClientRect().width
  const computedStyle = getComputedStyle(element)
  const marginLeft = parseFloat(computedStyle.marginLeft)
  const marginRight = parseFloat(computedStyle.marginRight)
  return width + marginLeft + marginRight
}

/**
 * 获取元素高度
 */
export function getElementHeight(element: Element | null) {
  if (!element) {
    return 0
  }
  const height = element.getBoundingClientRect().height
  const computedStyle = getComputedStyle(element)
  const marginTop = parseFloat(computedStyle.marginTop)
  const marginBottom = parseFloat(computedStyle.marginBottom)
  return height + marginTop + marginBottom
}
