<template>
  <el-dialog :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialog" :title="(form.transType==0?'法币':'USDT')+'提现驳回'" width="320px" @close="cancel">
    <p style="line-height: 24px; margin: -20px 0px 15px">
      提现金额：<span style="color: #F56C6C">{{ form.orderAmount }}</span><br>
      转账金额：<span style="color: #67C23A">{{ form.amount }}</span>&emsp;&emsp;
      手续费用：<span style="color: #E6A23C">{{ form.drawFee }}</span>
    </p>
    <el-form ref="form" :model="form" size="small" label-width="70px">
      <el-form-item label="驳回理由" prop="subDeposit">
        <el-input v-model="form.remark" type="textarea" placeholder="长度 0-30" clearable style="width: 200px"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="padding-top: 0px;margin-top: -15px">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" size="mini" @click="refusedDraw">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { refuseDraw } from '@/api/order-draw'
export default {
  props: {
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
      loading: false, dialog: false, form: { transNo: null, transType: 0, orderAmount: 0, amount: 0, drawFee: 0, remark: '' },
      rules: {
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    refusedDraw() {
      this.loading = true
      refuseDraw({ orderNo: this.form.transNo, reason: this.form.remark }).then(res => {
        this.resetForm()
        this.loading = false
        if (res.success) {
          this.$notify({
            title: '提现已驳回',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.sup_this.page = this.pageNum
          this.sup_this.init()
        }
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { transNo: null, transType: 0, orderAmount: 0, amount: 0, drawFee: 0, remark: '' }
    }
  }
}
</script>

<style scoped>

</style>
