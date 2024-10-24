<template>
  <div class="app-container">
    <div class="text item" style="width: 500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="140px">
        <el-form-item label="单次可提金额区间">
          <el-row>
            <el-col :span="11">
              <el-form-item prop="drawMin" style="margin-bottom: 0px">
                <el-input v-model.number="form.drawMin" clearable placeholder="最小提现金额" >
                  <template slot="append">元&emsp;</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="line" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-form-item prop="drawMax" style="margin-bottom: 0px">
                <el-input v-model.number="form.drawMax" clearable placeholder="最大提现金额">
                  <template slot="append">元&emsp;</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="全局通道代付" prop="drawOnline">
          <el-radio v-model="form.drawOnline" label="true">启用</el-radio>
          <el-radio v-model="form.drawOnline" label="false">禁用</el-radio>
        </el-form-item>
        <el-form-item label="通道代付保底费用" prop="drawOnFee">
          <el-input v-model.number="form.drawOnFee" clearable placeholder="通道代付保底费用">
            <template slot="append">元&emsp;</template>
          </el-input>
        </el-form-item>
        <el-form-item label="全局线下代付" prop="drawOffline">
          <el-radio v-model="form.drawOffline" label="true">启用</el-radio>
          <el-radio v-model="form.drawOffline" label="false">禁用</el-radio>
        </el-form-item>
        <el-form-item label="线下代付费率" prop="drawOffRates">
          <el-input v-model.number="form.drawOffRates" clearable placeholder="0-10">
            <template slot="append">%&emsp;</template>
          </el-input>
        </el-form-item>
        <el-form-item label="线下代付保底费用" prop="drawOffFee">
          <el-input v-model.number="form.drawOffFee" clearable placeholder="线下代付保底费用">
            <template slot="append">元&emsp;</template>
          </el-input>
        </el-form-item>
        <el-form-item label="线下代付单卡金额" required>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="drawOffMin" style="margin-bottom: 0px">
                <el-input v-model.number="form.drawOffMin" clearable placeholder="最小代付金额" >
                  <template slot="append">元&emsp;</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="line" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-form-item prop="drawOffMax" style="margin-bottom: 0px">
                <el-input v-model.number="form.drawOffMax" clearable placeholder="最大代付金额">
                  <template slot="append">元&emsp;</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="单卡单日提现次数" prop="drawNumLimit" required>
          <el-input v-model.number="form.drawNumLimit" placeholder=" 0 不限制"/>
        </el-form-item>
        <el-form-item label="单卡单日提现限额" prop="drawDayLimit">
          <el-input v-model.number="form.drawDayLimit" clearable placeholder=" 0 不限制">
            <template slot="append">元&emsp;</template>
          </el-input>
        </el-form-item>

        <el-form-item label="商户提现开关" prop="mchDrawSwitch">
          <el-radio v-model="form.mchDrawSwitch" label="true">开启</el-radio>
          <el-radio v-model="form.mchDrawSwitch" label="false">关闭</el-radio>
        </el-form-item>
        <el-form-item label="商户提现时间" prop="mchDrawDate">
          <el-time-picker
            v-model="form.mchDrawDate"
            is-range
            value-format="HH:mm:ss"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 100%"/>
        </el-form-item>

        <el-form-item label="商户代理提现开关" prop="matDrawSwitch">
          <el-radio v-model="form.matDrawSwitch" label="true">开启</el-radio>
          <el-radio v-model="form.matDrawSwitch" label="false">关闭</el-radio>
        </el-form-item>
        <el-form-item label="商户代理提现时间" prop="matDrawDate">
          <el-time-picker
            v-model="form.matDrawDate"
            is-range
            value-format="HH:mm:ss"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 100%"/>
        </el-form-item>

        <el-form-item label="通道代理提现开关" prop="catDrawSwitch">
          <el-radio v-model="form.catDrawSwitch" label="true">开启</el-radio>
          <el-radio v-model="form.catDrawSwitch" label="false">关闭</el-radio>
        </el-form-item>
        <el-form-item label="通道代理提现时间" prop="catDrawDate">
          <el-time-picker
            v-model="form.catDrawDate"
            is-range
            value-format="HH:mm:ss"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 100%"/>
        </el-form-item>

        <el-form-item>
          <el-button type="text" @click="cancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { getConfig, editConfig } from '@/api/order-draw'
import { mathMul, mathDiv } from '@/utils/math'

export default {
  name: 'Form',
  props: {
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false, form: { drawMin: null, drawMax: null, mchDrawSwitch: null, mchDrawDate: ['00:00:00', '23:59:59'], catDrawSwitch: null, catDrawDate: ['00:00:00', '23:59:59'], matDrawSwitch: null, matDrawDate: ['00:00:00', '23:59:59'], mchDrawStart: '00:00:00', mchDrawEnd: '23:59:59', catDrawStart: '00:00:00', catDrawEnd: '23:59:59', matDrawStart: '00:00:00', matDrawEnd: '23:59:59', drawOffline: null, drawOnline: null, drawOnFee: null, drawOffRates: null, drawOffFee: null, drawNumLimit: null, drawOffMin: null, drawOffMax: null, drawDayLimit: null },
      rules: {
        tradeExpMin: [
          { required: true, message: '请输入交易失效时间', trigger: 'blur' },
          { type: 'number', min: 1, max: 10, message: '失效时间 1-10', trigger: 'blur' }
        ],
        orderExpMin: [
          { required: true, message: '请输入订单失效时间', trigger: 'blur' },
          { type: 'number', min: 1, max: 60, message: '失效时间 1-60', trigger: 'blur' }
        ],
        drawBonusMin: [
          { required: true, message: '奖金最低提现金额不能为空', trigger: 'blur' },
          { type: 'number', min: 10, message: '最低提现金额不能低于10元', trigger: 'blur' }
        ],
        mchDrawLimit: [
          { required: true, message: '请选输入单日提现次数', trigger: 'blur' }
        ],
        mchDrawMin: [
          { required: true, message: '请输入最低提现金额', trigger: 'blur' }
        ],
        mchDrawMax: [
          { required: true, message: '请输入最高提现金额', trigger: 'blur' }
        ],
        mchDrawFee: [
          { required: true, message: '请输入提现最低手续费', trigger: 'blur' }
        ],
        traderDrawLimit: [
          { required: true, message: '请选输入单日提现次数', trigger: 'blur' }
        ],
        traderDrawMin: [
          { required: true, message: '请输入最低提现金额', trigger: 'blur' }
        ],
        traderDrawMax: [
          { required: true, message: '请输入最高提现金额', trigger: 'blur' }
        ],
        traderDrawFee: [
          { required: true, message: '请输入提现最低手续费', trigger: 'blur' }
        ],
        traderMinDeposit: [
          { required: true, message: '请输入最低保证金', trigger: 'blur' }
        ],
        traderMinRecharge: [
          { required: true, message: '请输入最低充值金额', trigger: 'blur' }
        ],
        traderQrMax: [
          { required: true, message: '请输入最多收款码数量', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.info()
  },
  methods: {
    isAuth,
    mathMul,
    mathDiv,
    cancel() {
      this.resetForm()
    },
    doSubmit: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.mchDrawDate == null || this.form.mchDrawDate.length === 0) {
            this.form.mchDrawDate = ['00:00:00', '23:59:59']
          }
          if (this.form.catDrawDate == null || this.form.catDrawDate.length === 0) {
            this.form.catDrawDate = ['00:00:00', '23:59:59']
          }
          if (this.form.matDrawDate == null || this.form.matDrawDate.length === 0) {
            this.form.matDrawDate = ['00:00:00', '23:59:59']
          }
          this.form.mchDrawStart = this.form.mchDrawDate[0]
          this.form.mchDrawEnd = this.form.mchDrawDate[1]
          this.form.catDrawStart = this.form.catDrawDate[0]
          this.form.catDrawEnd = this.form.catDrawDate[1]
          this.form.matDrawStart = this.form.matDrawDate[0]
          this.form.matDrawEnd = this.form.matDrawDate[1]

          const param = Object.assign({}, this.form)
          param.drawOffRates = mathDiv(this.form.drawOffRates, 100)
          param.drawOffFee = mathMul(this.form.drawOffFee, 100)
          param.drawOnFee = mathMul(this.form.drawOnFee, 100)

          param.drawMin = mathMul(this.form.drawMin, 100)
          param.drawMax = mathMul(this.form.drawMax, 100)

          param.drawOffMin = mathMul(this.form.drawOffMin, 100)
          param.drawOffMax = mathMul(this.form.drawOffMax, 100)

          param.mchDrawDate = null
          param.catDrawDate = null
          param.matDrawDate = null
          this.loading = true
          this.doEdit(param)
        } else {
          return false
        }
      })
    },
    info() {
      getConfig().then(res => {
        this.form = {
          drawMin: mathDiv(res.info.drawMin, 100),
          drawMax: mathDiv(res.info.drawMax, 100),
          mchDrawSwitch: res.info.mchDrawSwitch.toString(),
          mchDrawDate: [res.info.mchDrawStart, res.info.mchDrawEnd],
          catDrawSwitch: res.info.catDrawSwitch.toString(),
          catDrawDate: [res.info.catDrawStart, res.info.catDrawEnd],
          matDrawSwitch: res.info.matDrawSwitch.toString(),
          matDrawDate: [res.info.matDrawStart, res.info.matDrawEnd],
          drawOffline: res.info.drawOffline.toString(),
          drawOnline: res.info.drawOnline.toString(),
          drawOnFee: mathDiv(res.info.drawOnFee, 100),
          drawOffRates: mathMul(res.info.drawOffRates, 100),
          drawOffFee: mathDiv(res.info.drawOffFee, 100),
          drawNumLimit: res.info.drawNumLimit,
          drawOffMin: mathDiv(res.info.drawOffMin, 100),
          drawOffMax: mathDiv(res.info.drawOffMax, 100),
          drawDayLimit: mathDiv(res.info.drawDayLimit, 100)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    doEdit(param) {
      editConfig(param).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm() {
      this.info()
    }
  }
}
</script>
