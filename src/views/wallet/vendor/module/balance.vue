<template>
  <el-dialog :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialog" :title="plus?'增加钱包余额':'减少钱包余额'" width="300px" @close="cancel">
    <el-form ref="form" :model="form" size="small" label-width="88px" style="margin-top: -20px">
      <el-form-item label="当前余额">
        {{ mathDiv(form.balance,100) }}
      </el-form-item>
      <el-form-item :label="plus?'增加金额':'减少金额'" prop="amount">
        <el-input v-model="form.amount" style="width: 160px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-top: -20px">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { plusAmount, minusAmount } from '@/api/ven'
import { mathMul, mathDiv } from '@/utils/math'
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
  data() {
    return {
      loading: false, dialog: false, plus: false, form: { id: null, balance: 0, amount: null },
      rules: {
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    mathMul,
    mathDiv,
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.plus) {
            this.plusWalletAmount()
          } else {
            this.minusWalletAmount()
          }
        } else {
          return false
        }
      })
    },
    plusWalletAmount() {
      plusAmount({ id: this.form.id, amount: mathMul(this.form.amount, 100) }).then(res => {
        this.resetForm()
        this.$notify({
          title: '手动增加余额成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.page = this.pageNum
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    minusWalletAmount() {
      minusAmount({ id: this.form.id, amount: mathMul(this.form.amount, 100) }).then(res => {
        this.resetForm()
        this.$notify({
          title: '手动减少余额成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.page = this.pageNum
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { id: null, balance: 0, amount: null }
    }
  }
}
</script>
