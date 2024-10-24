<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <router-link :to="'/order/pay/info/' + data.orderNo "> 订单详情</router-link>
        </el-dropdown-item>
        <el-dropdown-item v-if="isAuth('trade:settle')" command="settle">重发结算</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('trade:notify')" command="notify">重发回调</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('trade:check')" command="check">查证订单</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import { isAuth } from '@/utils/auth'
import { notifyMch, settleOrder, checkOrder } from '@/api/order-pay'

export default {
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
    resendSettle() {
      settleOrder({ orderNo: this.data.orderNo }).then(res => {
        this.$notify({
          title: '已重发结算',
          type: 'success',
          duration: 2500
        })
        this.sup_this.page = this.pageNum
        this.sup_this.init()
      }).catch(err => {
        console.log(err)
      })
    },
    resendCheck() {
      checkOrder({ orderNo: this.data.orderNo }).then(res => {
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
    resendNotify() {
      notifyMch({ orderNo: this.data.orderNo }).then(res => {
        this.$notify({
          title: '已回调商户',
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
        case 'orderInfo':
          this.$message('click on item info')
          break
        case 'notify':
          this.resendNotify()
          break
        case 'settle':
          this.resendSettle()
          break
        case 'check':
          this.resendCheck()
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
