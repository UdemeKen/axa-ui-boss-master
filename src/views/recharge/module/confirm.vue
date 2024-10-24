<template>
  <el-dialog :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialog" title="充值通过" width="320px" @close="cancel">
    <p style="margin-top: -15px;">以实际到账金额为准</p>
    <el-form ref="form" :model="form" size="small" label-width="70px">
      <el-form-item label="到账金额" prop="realAmount">
        <el-input v-model="form.realAmount" clearable placeholder="金额最多2位小数" style="width: 200px">
          <template slot="append">元&#8195;</template>
        </el-input>
      </el-form-item>
      <el-form-item label="审核备注" prop="subDeposit">
        <el-input v-model="form.remark" type="textarea" placeholder="备注长度 0-30" clearable style="width: 200px"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="padding-top: 0px;margin-top: -15px">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" size="mini" @click="confirmDraw">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { confirmRecharge } from '@/api/recharge'
import { mathMul, mathDiv } from '@/utils/math'
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
      loading: false, dialog: false, form: { rechargeNo: null, realAmount: null, remark: '' },
      rules: {
      }
    }
  },
  methods: {
    mathMul,
    mathDiv,
    cancel() {
      this.resetForm()
    },
    confirmDraw() {
      this.loading = true
      const param = Object.assign({}, this.form)
      param.realAmount = mathMul(this.form.realAmount, 100)
      confirmRecharge(param).then(res => {
        this.resetForm()
        this.loading = false
        if (res.success) {
          this.$notify({
            title: '充值确认成功',
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
      this.form = { rechargeNo: null, realAmount: null, remark: '' }
    }
  }
}
</script>

<style scoped>

</style>
