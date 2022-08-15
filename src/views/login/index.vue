<template>
  <div class="login-container">
    <el-form ref="loginForm" class="login-form" label-position="left" :model="loginForm" :rules="rules">

      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>

      <el-form-item prop="mobile">
        <span
          class="svg-container el-icon-user-solid"
        />
        <el-input v-model="loginForm.mobile" placeholder="请输入手机号码" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input ref="pwd" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" />
        <span class="svg-container">
          <svg-icon :icon-class="passwordType==='password'? 'eye':'eye-open'" @click="showPwd" />
        </span>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" class="loginBtn" :loading="loading" @click="login">登录</el-button>

      <div class="tips">
        <span style="margin-right:20px;">账号: admin</span>
        <span>密码: any</span>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
export default {
  name: 'Login',
  data() {
    // 第二种校验写法
    const validateMobile = (rule, value, callback) => {
      // rule 对应的规则
      // value 对应的值
      // callback 验证完成后调用的回调函数 验证通过直接调用 验证不通过 也是 调用 callback,但是会把错误信息 传递出去
      if (validMobile(value)) {
        return callback()
      } else {
        callback(new Error('手机号格式不正确'))
      }
    }
    return {
      passwordType: 'password',
      loading: false,
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      // 表单校验规则，需和数据名称一致
      rules: {
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          // 第二种校验写法
          { validator: validateMobile, trigger: 'blur' }
          // 第一种写法校验写法
          // {
          //   pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
          //   message: '手机号码格式不正确', trigger: 'blur'
          // }
        ],
        password: [
          { required: true, message: '请填写密码' },
          {	min: 6, max: 16, message: '密码的长度在6-16位之间 ', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {

    // 切换密码框的type值
    // 眼睛要修改
    // 输入框focus

    showPwd() {
      this.passwordType === 'password' ? this.passwordType = '' : this.passwordType = 'password'
      // 如果直接foucus会没效果，因为是异步，需要定时器或者nextTick
      this.$nextTick(() => {
        this.$refs.pwd.focus()
      })
    },
    async login() {
      // 第一种
      // 校验表单数据
      // form 的 validate
      // this.$refs.loginForm.validate((vali) => {
      //   if (vali) {
      //     // 提交数据的操作
      //   }
      // })

      // 第二种
      try {
        await this.$refs.loginForm.validate() // promise
        this.loading = true
        await this.$store.dispatch('user/login', this.loginForm)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }

  }
}
</script>

<style lang="scss">
// 不可以加scoped 不然更改不了 emement ui
// 一定要套在外面的父盒子里面，不然会影响别的组件

/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray: #68b0fe;  // 将输入框颜色改成蓝色
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__error {
    color: #fff
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  background-image: url('~@/assets/common/login.jpg'); // 设置背景图片
  background-position: center;// 将图片位置设置为充满整个屏幕
.loginBtn {
  background: #407ffe;
  height: 64px;
  line-height: 32px;
  font-size: 24px;
}
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
