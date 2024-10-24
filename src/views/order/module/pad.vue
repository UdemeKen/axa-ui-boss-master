<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    title="手工补单"
    width="480px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label=" 订 单 号" prop="orderNo">
        <el-input v-model="form.orderNo" clearable placeholder="请输入订单号" style="width: 280px"/>
        &emsp;
        <el-button :loading="loading" type="primary" @click="getInfo">查询</el-button>
      </el-form-item>
      <dl class="orderInfo">
        <dt>&ensp;&ensp;支付方式：{{ data.methodCode }}</dt><dt>&nbsp;</dt>
        <dt>&ensp;&ensp;订单金额：{{ mathDiv(data.orderAmount, 100) }}</dt><dt>到账金额：{{ mathDiv(data.actualAmount, 100) }}</dt>
        <dt>&ensp;&ensp;商&emsp;&emsp;户： {{ data.mchName }}</dt><dt>商户费率： {{ mathMul(data.mchRate, 100) }}%</dt>
        <dt>&ensp;&ensp;通&emsp;&emsp;道： {{ data.channelName }}</dt><dt>通道费率： {{ mathMul(data.channelRate, 100) }}%</dt>
      </dl>
      <el-form-item label="补单金额" prop="amount">
        <el-input v-model.number="form.amount" clearable placeholder="请输入补单金额" style="width: 280px">
          <template slot="append">元&#8195;</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认补单</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { isEmpty } from '@/utils/index'
import { mathMul, mathDiv } from '@/utils/math'
import { getByOrderNo, copyOrder } from '@/api/order-pay'

export default {
  name: 'Form',
  props: {
    sup_this: {
      type: Object,
      default: null
    },
    pmOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      form: { orderNo: null, amount: null }, data: { methodCode: null, orderAmount: 0, actualAmount: 0, mchName: '', mchRate: 0, channelName: '', channelRate: 0 },
      rules: {
        orderNo: [
          { required: true, message: '请输入订单号', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入补单金额', trigger: 'blur' }
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
          this.doAdd()
        } else {
          return false
        }
      })
    },
    getInfo() {
      if (isEmpty(this.form.orderNo)) {
        this.$notify({
          title: '补单号不能为空',
          type: 'error',
          duration: 2500
        })
        return
      }
      getByOrderNo({ orderNo: this.form.orderNo }).then(res => {
        /* const m = new Map()
        this.pmOptions.forEach(function(data, index) {
          m.set(data.id, data.name)
        })
        this.data.methodCode = m.get(res.info.methodCode)*/

        this.data.methodCode = this.formatPm(res.data.methodCode)
        this.data.orderAmount = res.data.orderAmount
        this.data.actualAmount = res.data.actualAmount
        this.data.mchName = res.data.mchName
        this.data.mchRate = res.data.mchRate
        this.data.channelName = res.data.channelName
        this.data.channelRate = res.data.channelRate
        this.form.amount = mathDiv(res.data.orderAmount, 100)
      }).catch(err => {
        console.log(err)
      })
    },
    doAdd() {
      copyOrder({ orderNo: this.form.orderNo, actualAmount: mathMul(this.form.amount, 100) }).then(res => {
        this.resetForm()
        this.$notify({
          title: '补单成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm() {
      this.dialog = false
      this.form = { orderNo: null, amount: null }
      this.data = { methodCode: null, orderAmount: 0, actualAmount: 0, mchName: '', mchRate: 0, channelName: '', channelRate: 0 }
    },
    formatPm(methodCode) {
      for (let i = 0; i < this.pmOptions.length; i++) {
        if (this.pmOptions[i].code === methodCode) {
          return this.pmOptions[i].name
        }
      }
      return methodCode
    }
  }
}
</script>
<style scoped>
  .orderInfo{height: 100px; line-height: 24px;}
  .orderInfo dt{ float: left; width: 200px}
</style>
