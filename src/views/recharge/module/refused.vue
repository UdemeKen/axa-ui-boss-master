<template>
  <el-dialog :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialog" title="充值驳回" width="320px" @close="cancel">
    <el-form ref="form" :model="form" size="small" label-width="70px">
      <p style="line-height: 24px; margin: -20px 0px 15px">
        充值金额:<span style="color: #F56C6C">{{ form.totalAmount }}</span>元 <br>
      </p>
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
import { refusedRecharge } from '@/api/recharge'
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
      loading: false, dialog: false, form: { rechargeNo: null, totalAmount: null, remark: '' },
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
      refusedRecharge(this.form.rechargeNo, this.form.remark).then(res => {
        this.resetForm()
        this.loading = false
        if (res.success) {
          this.$notify({
            title: '充值已驳回',
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
      this.form = { rechargeNo: null, totalAmount: null, remark: '' }
    }
  }
}
</script>

<style scoped>

</style>
