<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <router-link :to="'/order/rechg/info/' + data.transNo "> 充值详情</router-link>
        </el-dropdown-item>
        <el-dropdown-item v-if="isAuth('rechg:settle') && data.transStatus == 1" command="settle">重发结算</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('rechg:confirm') && data.transStatus == 0" command="confirm">充值通过</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('rechg:refused') && (data.transStatus == 0 || data.transStatus == 9)" command="refused">充值驳回</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('rechg:draw') && !data.hadPayee && data.transStatus == 9" command="draw">指定提现订单</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('rechg:sys') && !data.hadPayee && data.transStatus == 9" command="payee">指定平台收款</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('rechg:unbind') && data.hadPayee && data.transStatus == 9" command="unbind">重置收款账户</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <draw ref="drawForm" :data="data" :sup_this="sup_this" :page-num="pageNum"/>
    <payee ref="payeeForm" :data="data" :sup_this="sup_this" :page-num="pageNum"/>
    <confirm ref="confirmForm" :data="data" :sup_this="sup_this" :page-num="pageNum"/>
    <refused ref="refusedForm" :data="data" :sup_this="sup_this" :page-num="pageNum"/>
  </div>
</template>
<script>
import { isAuth } from '@/utils/auth'
import { isEmpty } from '@/utils/index'
import { mathDiv } from '@/utils/math'
import refused from './refused'
import confirm from './confirm'
import draw from './draw'
import payee from './payee'
import { settleRecharge, unbind } from '@/api/recharge'

export default {
  components: { draw, payee, refused, confirm },
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
    settle() {
      this.$confirm('确认结算?').then(_ => {
        settleRecharge(this.data.rechargeNo).then(res => {
          this.$message({
            type: 'success',
            message: '已结算'
          })
          this.sup_this.page = this.pageNum
          this.sup_this.init()
        }).catch(err => {
          console.log(err)
          this.$notify({ title: '结算失败', type: 'warning', duration: 2500 })
        })
      }).catch(() => {
      })
    },
    refusedDeposit() {
      const _this = this.$refs.refusedForm
      _this.form.totalAmount = mathDiv(this.data.totalAmount, 100)
      _this.form.rechargeNo = this.data.rechargeNo
      _this.dialog = true
    },
    bindDraw() {
      const _this = this.$refs.drawForm
      _this.form.totalAmount = mathDiv(this.data.totalAmount, 100)
      _this.form.rechargeNo = this.data.rechargeNo
      _this.dialog = true
    },
    bindPayee() {
      const _this = this.$refs.payeeForm
      _this.form.totalAmount = mathDiv(this.data.totalAmount, 100)
      _this.form.rechargeNo = this.data.rechargeNo
      _this.dialog = true
    },
    unbindPayee() {
      this.$confirm('确认重置收款账户?').then(_ => {
        unbind(this.data.rechargeNo).then(res => {
          this.$message({
            type: 'success',
            message: '已重置收款账户'
          })
          this.sup_this.page = this.pageNum
          this.sup_this.init()
        }).catch(err => {
          console.log(err)
          this.$notify({ title: '重置失败', type: 'warning', duration: 2500 })
        })
      }).catch(() => {
      })
    },
    confirmDeposit() {
      const _this = this.$refs.confirmForm
      if (isEmpty(this.data.realAmount) || this.data.realAmount === 0) {
        _this.form.realAmount = mathDiv(this.data.totalAmount, 100)
      } else {
        _this.form.realAmount = mathDiv(this.data.realAmount, 100)
      }
      _this.form.rechargeNo = this.data.rechargeNo
      _this.dialog = true
    },
    frozenOrder() {
      this.$notify({
        title: '冻结功能暂未开放',
        type: 'warning',
        duration: 2000
      })
    },
    handleCommand: function(command) {
      switch (command) {
        case 'orderInfo':
          this.$message('click on item info')
          break
        case 'settle':
          this.settle()
          break
        case 'refused':
          this.refusedDeposit()
          break
        case 'confirm':
          this.confirmDeposit()
          break
        case 'draw':
          this.bindDraw()
          break
        case 'payee':
          this.bindPayee()
          break
        case 'unbind':
          this.unbindPayee()
          break
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
