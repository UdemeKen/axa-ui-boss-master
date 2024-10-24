<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="'编辑'+countryName+'配置'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="110px" style="width: 450px">
      <el-tabs v-model="activeName" type="card" style="min-height: 450px;">
        <el-tab-pane label="卡商配置" name="ven">
          <el-form-item label="卡商默认费率" prop="venPayRate">
            <el-input v-model="form.venPayRate" placeholder="0-30 最多1位小数(千分)">
              <template slot="append">&ensp;%&ensp;</template>
            </el-input>
          </el-form-item>
          <el-form-item label="卡商最低费率" prop="venMinRate">
            <el-input v-model="form.venMinRate" placeholder="0-30 最多1位小数(千分)">
              <template slot="append">&ensp;%&ensp;</template>
            </el-input>
          </el-form-item>
          <el-form-item label="卡商最低保证金" prop="venMinDeposit">
            <el-input v-model.number="form.venMinDeposit" placeholder="金额最多2位小数">
              <template slot="append">&ensp;元&ensp;</template>
            </el-input>
          </el-form-item>
          <el-form-item label="卡商最低充值额" prop="venMinRecharge">
            <el-input v-model.number="form.venMinRecharge" placeholder="金额最多2位小数">
              <template slot="append">&ensp;元&ensp;</template>
            </el-input>
          </el-form-item>
          <el-form-item label="卡商代付开关" prop="venDrawSwitch">
            <el-radio v-model="form.venDrawSwitch" label="true">开启</el-radio>
            <el-radio v-model="form.venDrawSwitch" label="false">关闭</el-radio>
          </el-form-item>
          <el-form-item label="代付保底费用" prop="venDrawFee">
            <el-input v-model.number="form.venDrawFee" placeholder="金额最多2位小数">
              <template slot="append">&ensp;元&ensp;</template>
            </el-input>
          </el-form-item>
          <el-form-item label="代付金额区间">
            <el-row>
              <el-col :span="11">
                <el-form-item prop="venDrawMin" style="margin-bottom: 0px">
                  <el-input v-model.number="form.venDrawMin" clearable placeholder="最小金额">
                    <template slot="append">&ensp;元&ensp;</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="line" style="text-align: center">-</el-col>
              <el-col :span="11">
                <el-form-item prop="venDrawMax" style="margin-bottom: 0px">
                  <el-input v-model.number="form.venDrawMax" clearable placeholder="最大金额">
                    <template slot="append">&ensp;元&ensp;</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="代付起止区间" prop="venDrawDate">
            <el-time-picker
              v-model="form.venDrawDate"
              is-range
              value-format="HH:mm:ss"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 100%"/>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商户 & 代理" name="mch">
          <el-form-item label="商户代付开关" prop="mchDrawSwitch">
            <el-radio v-model="form.mchDrawSwitch" label="true">开启</el-radio>
            <el-radio v-model="form.mchDrawSwitch" label="false">关闭</el-radio>
          </el-form-item>
          <el-form-item label="代付保底费用" prop="mchDrawFee">
            <el-input v-model.number="form.mchDrawFee" placeholder="金额最多2位小数">
              <template slot="append">&ensp;元&ensp;</template>
            </el-input>
          </el-form-item>
          <el-form-item label="代付金额区间">
            <el-row>
              <el-col :span="11">
                <el-form-item prop="mchDrawMin" style="margin-bottom: 0px">
                  <el-input v-model.number="form.mchDrawMin" clearable placeholder="最小金额">
                    <template slot="append">&ensp;元&ensp;</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="line" style="text-align: center">-</el-col>
              <el-col :span="11">
                <el-form-item prop="mchDrawMax" style="margin-bottom: 0px">
                  <el-input v-model.number="form.mchDrawMax" clearable placeholder="最大金额">
                    <template slot="append">&ensp;元&ensp;</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="代付起止区间" prop="mchDrawDate">
            <el-time-picker
              v-model="form.mchDrawDate"
              is-range
              value-format="HH:mm:ss"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 100%"/>
          </el-form-item>

          <el-form-item label="代理代付开关" prop="agentDrawSwitch">
            <el-radio v-model="form.agentDrawSwitch" label="true">开启</el-radio>
            <el-radio v-model="form.agentDrawSwitch" label="false">关闭</el-radio>
          </el-form-item>
          <el-form-item label="代付保底费用" prop="agentDrawFee">
            <el-input v-model.number="form.agentDrawFee" placeholder="金额最多2位小数">
              <template slot="append">&ensp;元&ensp;</template>
            </el-input>
          </el-form-item>
          <el-form-item label="代付金额区间">
            <el-row>
              <el-col :span="11">
                <el-form-item prop="agentDrawMin" style="margin-bottom: 0px">
                  <el-input v-model.number="form.agentDrawMin" clearable placeholder="最小金额">
                    <template slot="append">&ensp;元&ensp;</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="line" style="text-align: center">-</el-col>
              <el-col :span="11">
                <el-form-item prop="agentDrawMax" style="margin-bottom: 0px">
                  <el-input v-model.number="form.agentDrawMax" clearable placeholder="最大金额">
                    <template slot="append">&ensp;元&ensp;</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="代付起止区间" prop="agentDrawDate">
            <el-time-picker
              v-model="form.agentDrawDate"
              is-range
              value-format="HH:mm:ss"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 100%"/>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="收款卡 & 代付卡" name="pay">
          <el-form-item label="身份标识类型" prop="idTypeArray">
            <el-select v-model="form.idTypeArray" clearable multiple placeholder="选择身份标识标识" style="width: 100%">
              <el-option label="无" value="NON"/>
              <el-option label="CPF" value="CPF"/>
              <el-option label="CNPJ" value="CNPJ"/>
              <el-option label="PHONE" value="PHONE"/>
              <el-option label="EMAIL" value="EMAIL"/>
              <el-option label="RK(随机密钥)" value="RK"/>
              <el-option label="ID" value="ID"/>
              <el-option label="RFC" value="RFC"/>
              <el-option label="RUT" value="RUT"/>
              <el-option label="RUC" value="RUC"/>
              <el-option label="NIT" value="NIT"/>
              <el-option label="CC" value="CC"/>
              <el-option label="RUN" value="RUN"/>
              <el-option label="DNI" value="DNI"/>
              <el-option label="DPI" value="DPI"/>
              <el-option label="DUI" value="DUI"/>
              <el-option label="CIP" value="CIP"/>
            </el-select>
          </el-form-item>
          <el-form-item label="收款卡轮询额度" prop="cardInQuota" style="margin-bottom:5px">
            <el-input v-model.number="form.cardInQuota" placeholder="金额最多2位小数">
              <template slot="append">&ensp;元&ensp;</template>
            </el-input>
            <br><span style="color:#606266">银行卡日累计收款达到此限额，退出轮询</span>
          </el-form-item>
          <el-form-item label="收款卡下发额度" prop="cardInAmount" style="margin-bottom:5px">
            <el-input v-model.number="form.cardInAmount" placeholder="金额最多2位小数">
              <template slot="append">&ensp;元&ensp;</template>
            </el-input>
            <br><span style="color:#606266">银行卡余额大于等于此额度，自动下发转账</span>
          </el-form-item>
          <el-form-item label="收款卡下发时间" prop="cardInMinute" style="margin-bottom:5px">
            <el-input v-model.number="form.cardInMinute" placeholder="过期时间 1~30 分钟">
              <template slot="append">分钟</template>
            </el-input>
            <br><span style="color:#606266">银行卡每隔 ** 分钟，自动下发转账</span>
          </el-form-item>

          <el-form-item label="代付卡轮询额度" prop="cardOutQuota" style="margin-bottom:5px">
            <el-input v-model.number="form.cardOutQuota" placeholder="金额最多2位小数">
              <template slot="append">&ensp;元&ensp;</template>
            </el-input>
            <br><span style="color:#606266">银行卡日累计付款达到此限额，退出轮询</span>
          </el-form-item>
          <el-form-item label="代付告警额度" prop="cardWarnAmount" style="margin-bottom:5px">
            <el-input v-model.number="form.cardWarnAmount" placeholder="金额最多2位小数">
              <template slot="append">&ensp;元&ensp;</template>
            </el-input>
            <br><span style="color:#606266">银行卡余额小于等于此额度，自动告警</span>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { editCountryConfig } from '@/api/sys-country'
import { mathMul, mathDiv } from '@/utils/math'
import { isEmpty } from '@/utils/index'
export default {
  name: 'Form',
  props: {
    sup_this: {
      type: Object,
      default: null
    },
    pageNum: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      dialog: false, loading: false, activeName: 'ven', countryName: '',
      form: {
        id: null,
        countryCode: null,
        idTypeArray: [],
        venPayRate: 1,
        venMinRate: 0.5,
        venMinDeposit: 1,
        venMinRecharge: 100,
        venDrawSwitch: 'true',
        venDrawMin: 10,
        venDrawMax: 100000,
        venDrawDate: ['00:00:00', '23:59:59'],
        venDrawStart: '00:00:00',
        venDrawEnd: '23:59:59',
        venDrawFee: 0,
        mchDrawSwitch: 'true',
        mchDrawMin: 10,
        mchDrawMax: 100000,
        mchDrawDate: ['00:00:00', '23:59:59'],
        mchDrawStart: '00:00:00',
        mchDrawEnd: '23:59:59',
        mchDrawFee: 0,
        agentDrawSwitch: 'true',
        agentDrawMin: 10,
        agentDrawMax: 100000,
        agentDrawDate: ['00:00:00', '23:59:59'],
        agentDrawStart: '00:00:00',
        agentDrawEnd: '23:59:59',
        agentDrawFee: 0,
        cardInQuota: 500000,
        cardInAmount: 5000,
        cardInMinute: 60,
        cardOutQuota: 500000,
        cardWarnAmount: 5000
      },
      rules: {
        countryCode: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ],
        methodCode: [
          { required: true, message: '请输入支付编码', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: '请输入支付名称', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
        ],
        expMin: [
          { required: true, message: '请输入订单过期时间', trigger: 'blur' },
          { type: 'number', min: 1, max: 30, message: '过期时间 1~30 分钟', trigger: 'blur' }
        ],
        sortNum: [
          { required: true, message: '请输入序号', trigger: 'blur' }
        ],
        floatSwitch: [
          { required: true, message: '请选择费率开关', trigger: 'change' }
        ],
        disabled: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        idTypeArray: [
          { required: true, message: '请选择身份标识', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    isAuth,
    isEmpty,
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.venDrawDate == null || this.form.venDrawDate.length === 0) {
            this.form.venDrawDate = ['00:00:00', '23:59:59']
          }
          if (this.form.mchDrawDate == null || this.form.mchDrawDate.length === 0) {
            this.form.mchDrawDate = ['00:00:00', '23:59:59']
          }
          if (this.form.agentDrawDate == null || this.form.agentDrawDate.length === 0) {
            this.form.agentDrawDate = ['00:00:00', '23:59:59']
          }
          this.form.venDrawStart = this.form.venDrawDate[0]
          this.form.venDrawEnd = this.form.venDrawDate[1]
          this.form.mchDrawStart = this.form.mchDrawDate[0]
          this.form.mchDrawEnd = this.form.mchDrawDate[1]
          this.form.agentDrawStart = this.form.agentDrawDate[0]
          this.form.agentDrawEnd = this.form.agentDrawDate[1]

          const param = Object.assign({}, this.form)
          param.idTypeArray = null
          param.identityTypes = this.form.idTypeArray.join(',')
          param.venPayRate = mathDiv(this.form.venPayRate, 100)
          param.venMinRate = mathDiv(this.form.venMinRate, 100)
          param.venMinDeposit = mathMul(this.form.venMinDeposit, 100)
          param.venMinRecharge = mathMul(this.form.venMinRecharge, 100)
          param.venDrawMin = mathMul(this.form.venDrawMin, 100)
          param.venDrawMax = mathMul(this.form.venDrawMax, 100)
          param.venDrawFee = mathMul(this.form.venDrawFee, 100)
          param.mchDrawMin = mathMul(this.form.mchDrawMin, 100)
          param.mchDrawMax = mathMul(this.form.mchDrawMax, 100)
          param.mchDrawFee = mathMul(this.form.mchDrawFee, 100)
          param.agentDrawMin = mathMul(this.form.agentDrawMin, 100)
          param.agentDrawMax = mathMul(this.form.agentDrawMax, 100)
          param.agentDrawFee = mathMul(this.form.agentDrawFee, 100)
          param.cardInQuota = mathMul(this.form.cardInQuota, 100)
          param.cardInAmount = mathMul(this.form.cardInAmount, 100)
          param.cardOutQuota = mathMul(this.form.cardOutQuota, 100)
          param.cardWarnAmount = mathMul(this.form.cardWarnAmount, 100)
          this.loading = true
          this.doEdit(param)
        } else {
          return false
        }
      })
    },
    doEdit(param) {
      editCountryConfig(param).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
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
      this.form = {
        id: null,
        countryCode: null,
        venPayRate: 1,
        venMinRate: 0.5,
        venMinDeposit: 1,
        venMinRecharge: 100,
        venDrawSwitch: 'true',
        venDrawMin: 10,
        venDrawMax: 100000,
        venDrawDate: ['00:00:00', '23:59:59'],
        venDrawStart: '00:00:00',
        venDrawEnd: '23:59:59',
        venDrawFee: 0,
        mchDrawSwitch: 'true',
        mchDrawMin: 10,
        mchDrawMax: 100000,
        mchDrawDate: ['00:00:00', '23:59:59'],
        mchDrawStart: '00:00:00',
        mchDrawEnd: '23:59:59',
        mchDrawFee: 0,
        agentDrawSwitch: 'true',
        agentDrawMin: 10,
        agentDrawMax: 100000,
        agentDrawDate: ['00:00:00', '23:59:59'],
        agentDrawStart: '00:00:00',
        agentDrawEnd: '23:59:59',
        agentDrawFee: 0,
        cardInQuota: 500000,
        cardInAmount: 5000,
        cardInMinute: 60,
        cardOutQuota: 500000,
        cardWarnAmount: 5000
      }
    }
  }
}
</script>

<style>
.el-dialog .el-dialog__header {
  padding: 15px 20px 10px 20px;
}
.el-dialog .el-dialog__body {
  padding: 10px 20px;
}
</style>
