<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="notifySuccess">模拟回调成功</el-dropdown-item>
        <el-dropdown-item command="notifyFail">模拟回调失败</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import { isAuth } from '@/utils/auth'
import { getBankOptions } from '@/api/payment'
import { mockNotifyDraw} from '@/api/order-draw'
export default {
  components: {  },
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
    notifySuccess() {
      mockNotifyDraw({ orderNo: this.data.transNo,success: true }).then(res => {
        if (res.success) {
          this.$notify({
            title: '已回调',
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
    notifyFail() {
      mockNotifyDraw({ orderNo: this.data.transNo,success: false }).then(res => {
        if (res.success) {
          this.$notify({
            title: '已回调',
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
    handleCommand: function(command) {
      switch (command) {
        case 'notifySuccess':
          this.notifySuccess()
          break
        case 'notifyFail':
          this.notifyFail()
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
