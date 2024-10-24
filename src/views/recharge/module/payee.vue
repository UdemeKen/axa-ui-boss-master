<template>
  <el-dialog :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialog" title="指定平台收款账号" width="320px" @close="cancel">
    <el-form ref="form" :model="form" size="small" label-width="70px">
      <p style="line-height: 24px; margin: -20px 0px 15px">
        充值金额:<span style="color: #F56C6C">{{ form.totalAmount }}</span>元 <br>
      </p>
      <el-form-item label="收款户名" prop="payeeName">
        <el-input v-model="form.payeeName" clearable style="width: 200px"/>
      </el-form-item>
      <el-form-item label="收款银行" prop="payeeBank">
        <el-select v-model="form.payeeBank" clearable placeholder="选择代付银行" style="width: 200px">
          <el-option label="工商银行" value="工商银行"/>
          <el-option label="农业银行" value="农业银行"/>
          <el-option label="建设银行" value="建设银行"/>
          <el-option label="中国银行" value="中国银行"/>
          <el-option label="交通银行" value="交通银行"/>
          <el-option label="招商银行" value="招商银行"/>
          <el-option label="邮储银行" value="邮储银行"/>
          <el-option label="民生银行" value="民生银行"/>
          <el-option label="平安银行" value="平安银行"/>
          <el-option label="中信银行" value="中信银行"/>
          <el-option label="浦发银行" value="浦发银行"/>
          <el-option label="兴业银行" value="兴业银行"/>
          <el-option label="光大银行" value="光大银行"/>
          <el-option label="广发银行" value="广发银行"/>
          <el-option label="华夏银行" value="华夏银行"/>
          <el-option label="宁波银行" value="宁波银行"/>
          <el-option label="北京银行" value="北京银行"/>
        </el-select>
      </el-form-item>
      <el-form-item label="收款卡号" prop="payeeCard">
        <el-input v-model="form.payeeCard" clearable style="width: 200px"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="padding-top: 0px;margin-top: -15px">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" size="mini" @click="refusedDraw">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { bindSys } from '@/api/recharge'
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
      loading: false, dialog: false, form: { rechargeNo: null, totalAmount: 0, payeeName: '', payeeBank: '', payeeCard: '' },
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
      bindSys(this.form).then(res => {
        this.resetForm()
        this.loading = false
        if (res.success) {
          this.$notify({
            title: '已分配平台收款',
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
      this.form = { rechargeNo: null, totalAmount: 0, payeeName: '', payeeBank: '', payeeCard: '' }
    }
  }
}
</script>

<style scoped>

</style>
