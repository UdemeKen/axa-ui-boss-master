<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left" @keyup.enter.native="handleLogin()">
      <div class="title-container">
        <h3 class="title">欢 迎 登 录</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          placeholder="密码"/>
        <span class="show-pwd" @click="showPwd">
          <i class="el-icon-view"/>
        </span>
      </el-form-item>
      <el-row :gutter="24" style="margin-bottom: 22px;">
        <el-col :span="14">
          <el-form-item prop="captcha" style="margin:0px;">
            <span class="svg-container">
              <svg-icon icon-class="captcha"/>
            </span>
            <el-input v-model="loginForm.captcha" name="captcha" type="text" placeholder="验证码"/>
          </el-form-item>
        </el-col>
        <el-col :span="10" class="login-captcha">
          <img :src="captchaPath" alt="验证码" title="点击刷新验证码" @click="getCaptcha()">
        </el-col>
      </el-row>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUUID } from '@/utils/index'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        uuid: '',
        captcha: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        captcha: [{ required: true, trigger: 'blur', message: '验证码不能为空' }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      captchaPath: require("@/assets/image/loading.png")
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCaptcha()
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    // 获取验证码
    getCaptcha() {
      const uuid = getUUID()
      this.loginForm.uuid = uuid
      this.captchaPath = require("@/assets/image/loading.png")
      this.$store.dispatch('CaptchaBase64', uuid).then(res => {
        this.captchaPath = 'data:image/png;base64,' + res
      }).catch(() => {
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const user = {
            username: this.loginForm.username,
            password: this.loginForm.password,
            captcha: this.loginForm.captcha,
            uuid: this.loginForm.uuid
          }
          this.loading = true
          this.$store.dispatch('Login', user).then(() => {
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.getCaptcha()
            this.loading = false
          })
        } else {
          this.loading = false
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #283443;
  $light_gray: #eee;
  $cursor: #fff;
  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  .login-container {
    .el-input {
      display: inline-block;
      height: 40px;
      width: 80%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 5px;
        color: $light_gray;
        height: 40px;
        margin-left: 30px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .el-form-item__content {
      height: 40px;
      line-height: 30px;
      position: relative;
      font-size: 14px;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background: url("~@/assets/image/bg.jpg") no-repeat;
    background-size: 100% 100%;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 420px;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
      border-radius: 8px;
      background: url("~@/assets/image/main_bg.png") repeat;
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
      position: absolute;
      padding: 5px 5px 5px 10px;
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
    .login-captcha {
      overflow: hidden;
      > img {
        width: 120px;
        height: 40px;
        cursor: pointer;
        float: right;
      }
    }
  }
</style>
