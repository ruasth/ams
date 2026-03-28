export function padZero(num) {
  num = Math.floor(num)
  // num.toString().padStart(2, '0')
  return num < 10 ? '0' + num : num
}
