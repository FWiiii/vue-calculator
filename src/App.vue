<template>
  <div id="app">
    <div class="calculator-wrapper">
      <div class="calculator-title">
        <div class="name">计算器</div>
        <div class="win-key">
          <div class="min">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#fff" d="M19 12.998H5v-2h14z" />
            </svg>
          </div>
          <div class="max">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M3 3h6v2H5v4H3V3Zm0 18h6v-2H5v-4H3v6Zm12 0h6v-6h-2v4h-4v2Zm6-18h-6v2h4v4h2V3Z"
              />
            </svg>
          </div>
          <div class="close">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="calculator-header">
        <div class="content-left">
          <div class="menu">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#fff" d="M3 3h18v2H3zm0 16h18v2H3zm0-8h18v2H3z" />
            </svg>
          </div>
          <span class="mode"> 标准 </span>
          <div class="stay-on-top">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3h-7z"
              />
            </svg>
          </div>
        </div>
        <div class="history">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#fff"
              d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89l.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54l.72-1.21l-3.5-2.08V8H12z"
            />
          </svg>
        </div>
      </div>
      <div class="calculator-screen">
        <div class="small-screen">
          <p>{{ exp }}</p>
        </div>
        <div class="screen">
          <p>{{ number }}</p>
        </div>
      </div>
      <div class="calculator-keyboard">
        <div class="function-key">
          <button @click="getValue('c')">C</button>
          <button @click="getValue('/')">/</button>
          <button @click="getValue('*')">*</button>
          <button @click="getValue('del')">DEL</button>
          <button @click="getValue('7')" class="number">7</button>
          <button @click="getValue('8')" class="number">8</button>
          <button @click="getValue('9')" class="number">9</button>
          <button @click="getValue('-')">-</button>
          <button @click="getValue('4')" class="number">4</button>
          <button @click="getValue('6')" class="number">6</button>
          <button @click="getValue('5')" class="number">5</button>
          <button @click="getValue('+')">+</button>
          <button @click="getValue('1')" class="number">1</button>
          <button @click="getValue('2')" class="number">2</button>
          <button @click="getValue('3')" class="number">3</button>
          <button @click="getValue('=')" class="equal">=</button>
          <button @click="getValue('+/-')">+/-</button>
          <button @click="getValue('0')" class="number">0</button>
          <button @click="getValue('.')">.</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { add, multiply, subtract, divide } from "./utils/index";
export default {
  name: "App",
  components: {},
  data() {
    return {
      number: "0",
      exp: "",
      rewrite: false, // 是否需要清空number重新赋值
      isInit: false, // 初始化
    };
  },
  methods: {
    getValue(v) {
      const numReg = /[0-9]|\./;
      if (this.isInit) {
        this.isInit = false;
        Object.assign(this.$data, this.$options.data());
      }

      if (this.number.indexOf(".") != -1 && v === ".") return;
      if (numReg.test(v)) {
        if (this.rewrite) {
          this.number = v;
          this.rewrite = false;
        } else {
          this.number === "0" && v !== "."
            ? (this.number = v)
            : (this.number += v);
        }
      } else if (["+", "-", "*", "/"].includes(v)) {
        let last = this.exp.charAt(this.exp.length - 1);
        if (this.rewrite && ["+", "-", "*", "/"].includes(last)) {
          this.exp = this.exp.slice(0, this.exp.length - 1) + v;
        } else {
          this.rewrite = true;
          this.exp += this.number + v;
        }
      } else if (v === "del") {
        if (this.number === "0") return;
        if (this.rewrite) return;
        this.number = this.number.slice(0, this.number.length - 1);
        if (this.number === "") this.number = "0";
      } else if (v === "+/-") {
        this.number = (-1 * this.number).toString();
      } else if (v === "=") {
        this.exp += this.number + v;
        const result = this.getResult(this.exp);
        result.d.length > 2
          ? (this.number = this.getResult(this.exp).toFixed(9))
          : (this.number = this.getResult(this.exp));
        this.isInit = true;
      } else if (v === "c") {
        Object.assign(this.$data, this.$options.data());
      }
    },
    getResult(exp) {
      const numReg = /[0-9]|\./;
      const expArr = exp.split("");
      const stack = [];
      let current = 0;
      let sign = "+";
      console.log(expArr);
      for (let i = 0; i < expArr.length; i++) {
        console.log(stack);
        if (numReg.test(exp[i])) {
          current == 0 ? (current = exp[i]) : (current += exp[i]);
          if (i == expArr.length - 1) {
            this.logic(sign, stack, current);
          }
        } else {
          this.logic(sign, stack, current);
          current = 0;
          sign = exp[i];
        }
      }
      let sum = stack.reduce((pre, num) => this.calculation(pre, "+", num), 0);
      return sum;
    },

    logic(sign, stack, current) {
      if (sign === "+") {
        stack.push(current);
      } else if (sign === "-") {
        stack.push(-1 * current);
      } else if (sign === "*") {
        const res = this.calculation(stack.pop(), sign, current);
        stack.push(res);
      } else if (sign === "/") {
        const res = this.calculation(stack.pop(), sign, current);
        stack.push(res);
      }
    },

    calculation(a, sign, b) {
      let res;
      switch (sign) {
        case "+": // 加
          res = add(a, b);
          break;
        case "-": // 减
          res = subtract(a, b);
          break;
        case "*": // 乘
          res = multiply(a, b);
          break;
        case "/": // 除
          res = divide(a, b);
          break;
        default:
          break;
      }
      return res;
    },
  },
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    margin: 0;
  }
}
.calculator-wrapper {
  width: 325px;
  background-image: linear-gradient(
    rgba(5, 5, 5, 0.832),
    rgba(86, 86, 92, 0.749)
  );
  box-sizing: border-box;
  .calculator-title {
    height: 35px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    .name {
      font-size: 14px;
      color: #fff;
      margin-left: 15px;
    }
    .win-key {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      .min,
      .max,
      .close {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 45px;
        &:hover {
          background-color: rgb(171, 171, 171);
        }
      }
      .close:hover {
        background-color: rgb(255, 0, 0);
      }
    }
  }
  .calculator-header {
    height: 40px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    .content-left {
      display: flex;
      justify-content: start;
      align-items: center;
      .menu,
      .stay-on-top {
        cursor: pointer;
        height: 40px;
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          background-color: rgb(171, 171, 171);
        }
      }
      .mode {
        font-size: 20px;
        color: #fff;
        font-weight: 800;
        margin: 0 10px;
      }
    }
    .history {
      cursor: pointer;
      height: 40px;
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        background-color: rgb(171, 171, 171);
      }
    }
  }
  .calculator-screen {
    padding: 0 15px;
    .small-screen {
      height: 30px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      p {
        font-size: 18px;
        color: #fff;
      }
    }
    .screen {
      height: 70px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      p {
        font-size: 50px;
        color: #fff;
      }
    }
  }
  .calculator-keyboard {
    .function-key {
      height: 100%;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(5, 55px);
      grid-gap: 3px;
      padding: 3px;
      button {
        background-color: black;
        opacity: 0.5;
        border: none;
        font-size: 20px;
        color: #fff;
        cursor: pointer;
        &.number {
          opacity: 1;
        }
        &.equal {
          grid-row: 4/6;
          grid-column: 4/5;
          background-color: #3b82f6;
        }
        &:hover {
          opacity: 0.3;
          box-shadow: 0 0 1px 1px #eee inset;
        }
      }
    }
  }
}
</style>
