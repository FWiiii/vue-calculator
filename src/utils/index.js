import * as math from "mathjs";
function add(num1, num2) {
  return math.add(math.bignumber(num1), math.bignumber(num2));
}
// 乘
function multiply(num1, num2) {
  return math.multiply(math.bignumber(num1), math.bignumber(num2));
}
// 减
function subtract(num1, num2) {
  return math.subtract(math.bignumber(num1), math.bignumber(num2));
}
// 除
function divide(num1, num2) {
  return math.divide(math.bignumber(num1), math.bignumber(num2));
}
export { add, multiply, subtract, divide };
