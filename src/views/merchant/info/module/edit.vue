<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isAuth('mch:update')" command="editInfo">编辑商户资料</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('mch:unlock')" command="unlockAccount">解锁登录账号</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('mch:pwd:login')" command="resetLogin">重置登录密码</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('mch:pwd:draw')" command="resetWithdraw">重置提现密码</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <eForm ref="form" :mat-options="matOptions" :page-num="pageNum" :sup_this="sup_this"/>
    <ePsw ref="psw" :page-num="pageNum" :sup_this="sup_this"/>
  </div>
</template>
<script>
import eForm from './form'
import ePsw from './psw'
import { isAuth } from '@/utils/auth'
import { mathMul, mathDiv } from '@/utils/math'
import { getAgentOptions } from '@/api/agent'
import { getMchInfo, unlockMch } from '@/api/mch'
export default {
  components: { eForm, ePsw },
  props: {
    data: {
      type: Object,
      required: true
    },
    pageNum: {
      type: Number,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      matOptions: []
    }
  },
  methods: {
    isAuth,
    editInfo() {
      const _this = this.$refs.form
      getAgentOptions(this.data.countryCode, 2).then(res => {
        this.matOptions = res.data
      })
      getMchInfo({ id: this.data.id }).then(res => {
        if (res.success) {
          _this.countryName = res.data.countryName
          _this.form = {
            id: res.data.id,
            name: res.data.name,
            countryCode: res.data.countryCode,
            phone: res.data.phone,
            email: res.data.email,
            payNotifyUrl: res.data.payNotifyUrl,
            drawNotifyUrl: res.data.drawNotifyUrl,
            appId: res.data.appId,
            appSecret: res.data.appSecret,
            matId: res.data.matId === 0 ? '0' : res.data.matId.toString(),
            payPollType: res.data.payPollType.toString(),
            disabled: res.data.disabled.toString(),
            auditStatus: res.data.auditStatus.toString(),
            auditRemark: res.data.auditRemark,
            drawSwitch: res.data.drawSwitch.toString(),
            drawRate: mathMul(res.data.drawRate, 100),
            drawCost: mathDiv(res.data.drawCost, 100),
            trxAddress: res.data.trxAddress,
            drawGoogleCode: res.data.drawGoogleCode,
            drawGoogleCodeBase: res.data.drawGoogleCodeBase,
            googleCodeInit:res.data.googleCodeInit
          }
        }
      }).catch(err => {
        console.log(err)
      })
      _this.dialog = true
    },
    unlockAccount() {
      unlockMch({ id: this.data.id }).then(res => {
        this.$notify({
          title: '解锁成功',
          type: 'success',
          duration: 2000
        })
      }).catch(err => {
        console.log(err)
      })
    },
    resetPsw(login) {
      const _this = this.$refs.psw
      _this.resetLogin = login
      _this.form.id = this.data.id
      _this.dialog = true
    },
    handleCommand: function(command) {
      switch (command) {
        case 'editInfo':
          this.editInfo()
          break
        case 'unlockAccount':
          this.unlockAccount()
          break
        case 'resetLogin':
          this.resetPsw(true)
          break
        case 'resetWithdraw':
          this.resetPsw(false)
          break
        default:
          this.$message('请确认操作')
      }
    }
  }
}
</script>

<style scoped>
  div {
    display: inline-block;
    margin-right: 3px;
  }
  .el-dropdown-menu__item{
    padding: 0 10px;
    line-height: 30px;
  }
</style>
