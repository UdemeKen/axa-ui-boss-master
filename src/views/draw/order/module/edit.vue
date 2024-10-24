<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <router-link :to="'/order/draw/info/' + data.transNo "> 提现详情</router-link>
        </el-dropdown-item>
        <el-dropdown-item v-show="isAuth('dw:settle') && data.transStatus == 1" command="settle">重发结算</el-dropdown-item>
        <el-dropdown-item v-show="isAuth('dw:pass') && data.transStatus == 0" command="pass">提现通过</el-dropdown-item>
        <el-dropdown-item v-show="isAuth('dw:upload') && data.transStatus == 3" command="upload">重发上报</el-dropdown-item>
        <el-dropdown-item v-show="isAuth('dw:refuse') && data.transStatus == 0" command="refused">提现驳回</el-dropdown-item>
        <el-dropdown-item v-show="isAuth('dw:frozen') && data.transStatus == 0 && !data.targetFrozen" command="frozen">重发冻结</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('dw:check')" command="check">查证订单</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <confirm ref="confirmForm" :sup_this="sup_this" :page-num="pageNum"/>
    <refused ref="refusedForm" :sup_this="sup_this" :page-num="pageNum"/>
  </div>
</template>
<script>
import { isAuth } from '@/utils/auth'
import { getBankOptions } from '@/api/payment'
import { mathDiv, mathSub } from '@/utils/math'
import refused from './refused'
import confirm from './confirm'
import { settleDraw, frozenDraw, checkDraw, uploadDraw } from '@/api/order-draw'
/* finishDraw,refuseDraw, passDraw */
export default {
  components: { refused, confirm },
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
      this.$confirm('确认重发结算?').then(_ => {
        settleDraw({ orderNo: this.data.transNo }).then(res => {
          this.$message({
            type: 'success',
            message: '已重发结算'
          })
          this.sup_this.page = this.pageNum
          this.sup_this.init()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
      })
    },
    frozen() {
      this.$confirm('确认重发冻结?').then(_ => {
        frozenDraw({ orderNo: this.data.transNo }).then(res => {
          this.$message({
            type: 'success',
            message: '已重发冻结'
          })
          this.sup_this.page = this.pageNum
          this.sup_this.init()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
      })
    },
    upload() {
      uploadDraw({ orderNo: this.data.transNo }).then(res => {
        this.resetForm()
        if (res.success) {
          this.$notify({
            title: '提现已上报至通道',
            type: 'success',
            duration: 2500
          })
          this.sup_this.page = this.pageNum
          this.sup_this.init()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    confirm() {
      const _this = this.$refs.confirmForm
      _this.form.orderAmount = mathDiv(this.data.orderAmount, 100)
      _this.form.amount = mathDiv(mathSub(this.data.orderAmount, this.data.drawFee), 100)
      _this.form.drawFee = mathDiv(this.data.drawFee, 100)
      _this.form.transNo = this.data.transNo
      _this.form.transType = this.data.transType
      _this.form.payeeBankAccount = this.data.payeeBankAccount
      _this.dialog = true
    },
    refuse() {
      const _this = this.$refs.refusedForm
      _this.form.orderAmount = mathDiv(this.data.orderAmount, 100)
      _this.form.amount = mathDiv(mathSub(this.data.orderAmount, this.data.drawFee), 100)
      _this.form.drawFee = mathDiv(this.data.drawFee, 100)
      _this.form.transNo = this.data.transNo
      _this.form.transType = this.data.transType
      _this.dialog = true
    },
    resendCheck() {
      checkDraw({ orderNo: this.data.transNo }).then(res => {
        this.$notify({
          title: '已查证',
          type: 'success',
          duration: 2500
        })
        this.sup_this.page = this.pageNum
        this.sup_this.init()
      }).catch(err => {
        console.log(err)
      })
    },
    handleCommand: function(command) {
      switch (command) {
        case 'settle':
          this.settle()
          break
        case 'pass':
          this.confirm()
          break
        case 'refused':
          this.refuse()
          break
        case 'frozen':
          this.frozen()
          break
        case 'upload':
          this.upload()
          break
        case 'check':
          this.resendCheck()
          break
      }
    },
    loadOptions(countryCode) {
      getBankOptions(countryCode, false).then(res => {
        this.bankOptions = res.data
      })
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
