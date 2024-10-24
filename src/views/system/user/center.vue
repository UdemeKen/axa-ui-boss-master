<template>
  <div class="app-container">
    <div id="content-main" style="width:850px;">
      <el-card shadow="never" class="box-card user-info">
        <div class="avatar-content" style="border: 1px solid #ebeef5;">
          <img src="~@/assets/image/0.jpg" class="avatar">
        </div>
        <div class="user-info-content">
          <div>当前用户：<b>{{ loginUser.name }}</b> - [{{ loginUser.roleName }}]</div>
          <div>登录账号：<b>{{ loginUser.loginAccount }}</b></div>
          <div>账号状态：<span v-if="loginUser.disabled" style="color:#E6A23C;">禁用</span><span v-else style="color: #909399">正常</span></div>
          <div>上次登录地址：{{ loginUser.lastLoginIp }}&nbsp;&nbsp;&nbsp;&nbsp;日期：{{ loginUser.lastLoginTime }}</div>
        </div>
      </el-card>

      <el-card shadow="never" class="box-card reset-pass">
        <h4 class="account-label-icon">登录密码：</h4>
        <updatePass/>
        <p>安全性高的密码可使账号更安全，建议设置同时包含字母，数字，符号的密码。</p>
      </el-card>

      <el-card shadow="never" class="box-card reset-email">
        <h4 class="account-label-icon">联系信息：</h4>
        <updateContact :email="loginUser.email" :phone="loginUser.phone"/>
        <p>联系邮箱：{{ formatEmail(loginUser.email) }} </p>
        <p>联系电话：{{ loginUser.phone }} </p>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getCurrentUser } from '@/api/auth'
import { regEmail } from '@/utils/index'
import updatePass from './center/updatePass'
import updateContact from './center/updateContact'
export default {
  name: 'Center',
  components: { updatePass, updateContact },
  data() {
    return {
      loginUser: {}, loginLog: { ip: '', address: '', createTime: '' }
    }
  },
  created() {
    this.getCurrent()
  },
  methods: {
    formatEmail(mail) {
      return regEmail(mail)
    },
    getCurrent() {
      getCurrentUser().then(res => {
        this.loginUser = res.data
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .box-card{border:0;border-bottom:1px solid #ECEDFE;border-radius:unset;h4{height:26px;margin:0 0 7px;line-height:26px;font-size:1.1rem;font-weight:500;color:#444242;display:inline-block}p{font-family:Lantinghei;font-size:90%;color:#747474}ul{padding:0;margin:7px 0 0;list-style:none;font-size:80%}li{float:left;margin:0 30px 10px 0!important}li:before{width:8px;height:8px;background-color:#52acd9;color:#52acd9;display:inline-block;border-radius:50%;margin-right:5px;content:'';box-sizing:border-box}}.user-info{height:170px}.reset-email{border-bottom:0}.avatar-content,.user-info-content{float:left}.user-info-content{font-family:Lantinghei;position:relative;font-size:14px;margin:5px 0px 0px 25px;div{margin-bottom:15px}}.avatar-uploader-icon{font-size:28px;width:120px;height:120px;line-height:120px;text-align:center}.avatar{width:120px;height:120px;display:block;border-radius:50%}
</style>
