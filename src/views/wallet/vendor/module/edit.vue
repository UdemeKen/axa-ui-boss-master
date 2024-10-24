<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isAuth('vwt:plus')" command="plus">增加余额</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('vwt:minus')" command="minus">减少余额</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <balance ref="form" :data="data" :sup_this="sup_this" :page-num="pageNum"/>
  </div>
</template>
<script>
import { isAuth } from '@/utils/auth'
import balance from './balance'
export default {
  components: { balance },
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
    frozenStock() {
      this.$notify({
        title: '功能暂未开通',
        type: 'warning',
        duration: 2000
      })
    },
    editBalance(plus) {
      const _this = this.$refs.form
      _this.form.id = this.data.venId
      _this.form.balance = this.data.balance
      _this.form.amount = 0
      _this.plus = plus
      _this.dialog = true
    },
    handleCommand: function(command) {
      switch (command) {
        case 'plus':
          this.editBalance(true)
          break
        case 'minus':
          this.editBalance(false)
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
