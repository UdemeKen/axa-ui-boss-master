<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isAuth('ven:update')" command="editInfo">编辑卡商资料</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('ven:unlock')" command="unlockAccount">解锁登录账号</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('ven:pwd:login')" command="resetLogin">重置登录密码</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('ven:pwd:draw')" command="resetWithdraw">重置提现密码</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <eForm ref="form" :page-num="pageNum" :sup_this="sup_this"/>
    <ePsw ref="psw" :page-num="pageNum" :sup_this="sup_this"/>
  </div>
</template>
<script>
import eForm from './form'
import ePsw from './psw'
import { isAuth } from '@/utils/auth'
import { mathMul } from '@/utils/math'
import { getVenInfo, unlockVen } from '@/api/ven'
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
  methods: {
    isAuth,
    editInfo() {
      const _this = this.$refs.form
      getVenInfo({ id: this.data.id }).then(res => {
        if (res.success) {
          _this.countryName = res.data.countryName
          _this.form = {
            id: res.data.id,
            name: res.data.name,
            countryCode: res.data.countryCode,
            phone: res.data.phone,
            email: res.data.email,
            identityType: res.data.identityType,
            identity: res.data.identity,
            city: res.data.city,
            zipCode: res.data.zipCode,
            inviteCode: res.data.inviteCode,
            weightNum: res.data.weightNum.toString(),
            disabled: res.data.disabled.toString(),
            auditStatus: res.data.auditStatus.toString(),
            auditRemark: res.data.auditRemark,
            drawSwitch: res.data.drawSwitch.toString(),
            payRate: mathMul(res.data.payRate, 100),
            drawRate: mathMul(res.data.drawRate, 100),
            trxAddress: res.data.trxAddress,
            settleMethod: res.data.settleMethod.toString(),
            profitSettleType: res.data.profitSettleType.toString(),
            bonusSettleType: res.data.bonusSettleType.toString()
          }
        }
      }).catch(err => {
        console.log(err)
      })
      _this.dialog = true
    },
    unlockAccount() {
      unlockVen({ id: this.data.id }).then(res => {
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
