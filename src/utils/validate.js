/**
 * Created by jiachenpan on 16/11/18.
 */

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 验证手机号码
 * @param str
 * @returns {boolean}
 */
export function validatMobile(str) {
  const reg = /^[1][2-9][0-9]{9}$/
  return reg.test(str)
}

/**
 * 验证费率
 * @param str
 * @returns {boolean}
 */
export function validatRates(str) {
  const reg = /^(0(\.\d{1,4})?|1(\.0{1,4})?)$/
  return reg.test(str)
}

/**
 * 验证正整数 ^[1-9]\d*$
 * @param str
 * @returns {boolean}
 * 匹配非负整数（正整数 + 0）
 */
export function validatInteger(str) {
  const reg = /^[1-9]\d*|0$/
  return reg.test(str)
}

/**
 * 验证百分比
 * @param str
 * @returns {boolean}
 */
export function validatPercent(str) {
  const reg = /^(0(\.\d{1,4})?|1(\.0{1,4})?)$/
  return reg.test(str)
}

/**
 * 验证ids
 * @param str
 * @returns {boolean}
 */
export function validatIDS(str) {
  const reg = /^[\d,]*$/
  return reg.test(str)
}

/**
 * 验证邮箱
 * @param str
 * @returns {boolean}
 */
export function validatEmail(str) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  return reg.test(str)
}
