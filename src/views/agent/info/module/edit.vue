<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isAuth('agt:update')" command="editInfo">编辑代理资料</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('agt:unlock')" command="unlockAccount">解锁登录账号</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('agt:pwd:login')" command="resetLogin">重置登录密码</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('agt:pwd:draw')" command="resetDraw">重置提现密码</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <eForm ref="form" :sup_this="sup_this"/>
    <ePsw ref="psw" :sup_this="sup_this"/>
  </div>
</template>
<script>
import eForm from './form'
import ePsw from './psw'
import { mathMul } from '@/utils/math'
import { isAuth } from '@/utils/auth'
import { getAgentInfo, unlockAgent } from '@/api/agent'
export default {
  components: { eForm, ePsw },
  props: {
    data: {
      type: Object,
      required: true
    },
    // index.vue 的this 可用于刷新数据
    sup_this: {
      type: Object,
      required: true
    }
  },
  methods: {
    isAuth,
    editInfo() {
      const _this = this.$refs.form
      getAgentInfo({ id: this.data.id }).then(res => {
        if (res.success) {
          _this.countryName = res.data.countryName
          _this.form = {
            id: res.data.id,
            agentType: res.data.agentType,
            name: res.data.name,
            countryCode: res.data.countryCode,
            phone: res.data.phone,
            email: res.data.email,
            disabled: res.data.disabled.toString(),
            auditStatus: res.data.auditStatus.toString(),
            auditRemark: res.data.auditRemark,
            profitSettleType: res.data.profitSettleType.toString(),
            drawSwitch: res.data.drawSwitch.toString(),
            drawRate: mathMul(res.data.drawRate, 100),
            trxAddress: res.data.trxAddress,
            drawGoogleCode: res.data.drawGoogleCode,
            drawGoogleCodeBase: res.data.drawGoogleCodeBase
          }
        }
      }).catch(err => {
        console.log(err)
      })
      _this.dialog = true
    },
    unlockAccount() {
      unlockAgent({ id: this.data.id }).then(res => {
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
        case 'resetDraw':
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
