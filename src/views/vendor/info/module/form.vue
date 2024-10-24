<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" title="编辑卡商" width="450px">
    <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="108px">
      <el-tabs v-model="activeName" type="card" style="height: 500px;padding-right: 10px">
        <el-tab-pane label="卡商信息" name="basic">
          <el-form-item label="所在国家" prop="countryCode">
            <span>{{ form.countryCode }}-{{ countryName }}</span>
          </el-form-item>
          <el-form-item label="卡商姓名" prop="name">
            <el-input v-model="form.name" placeholder="姓名长度 2 - 64"/>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入正确的手机号码"/>
          </el-form-item>
          <el-form-item label="联系邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入正确的通信邮箱"/>
          </el-form-item>
          <el-form-item label="所在城市" prop="city">
            <el-input v-model="form.city" placeholder="请输入所在城市"/>
          </el-form-item>
          <el-form-item label="邮政编码" prop="zipCode">
            <el-input v-model="form.zipCode" placeholder="请输入邮政编码"/>
          </el-form-item>
          <el-form-item label="账户状态" prop="disabled">
            <el-radio v-model="form.disabled" label="false">启用</el-radio>
            <el-radio v-model="form.disabled" label="true">禁用</el-radio>
          </el-form-item>
          <el-form-item label="审核状态" prop="auditStatus">
            <el-radio v-model="form.auditStatus" label="1">通过</el-radio>
            <el-radio v-model="form.auditStatus" label="2">驳回</el-radio>
            <el-radio v-model="form.auditStatus" label="0">待核</el-radio>
          </el-form-item>
          <el-form-item label="审核备注" prop="auditRemark" style="margin-bottom: 0px">
            <el-input v-model="form.auditRemark" :rows="3" clearable type="textarea" placeholder="备注长度 0-120"/>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="支付配置" name="payment">
          <el-form-item label="身份标识" prop="identityType">
            <el-select v-model="form.identityType" clearable placeholder="选择身份标识标识">
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
          <el-form-item label="身份标识码" prop="identity">
            <el-input v-model="form.identity" placeholder="请输入身份标识号码"/>
          </el-form-item>
          <el-form-item label="收益费率" prop="payRate">
            <el-input v-model="form.payRate" placeholder="0-30 最多1位小数(千分)">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="收益结算方式" prop="settleMethod" style="margin-bottom: 10px">
            <el-radio v-model="form.settleMethod" label="0">流水&ensp;</el-radio>
            <el-radio v-model="form.settleMethod" label="1">工资</el-radio>
          </el-form-item>
          <el-form-item label="收益结算类型" prop="profitSettleType">
            <el-radio v-model="form.profitSettleType" label="0">D0T0</el-radio>
            <el-radio v-model="form.profitSettleType" label="1">D1T1</el-radio>
          </el-form-item>
          <el-form-item label="奖金结算类型" prop="bonusSettleType">
            <el-radio v-model="form.bonusSettleType" label="0">D0T0</el-radio>
            <el-radio v-model="form.bonusSettleType" label="1">D1T1</el-radio>
          </el-form-item>
          <el-form-item label="收单权重" prop="weightNum">
            <el-select v-model="form.weightNum" placeholder="选择权重值" style="width: 120px">
              <el-option label="一级" value="1"/>
              <el-option label="二级" value="2"/>
              <el-option label="三级" value="3"/>
              <el-option label="四级" value="4"/>
              <el-option label="五级" value="5"/>
            </el-select>&emsp;<span style="color:#606266;font-size: 12px">高等级高权重</span>
          </el-form-item>
          <el-form-item label="TRX地址" prop="trxAddress">
            <el-input v-model="form.trxAddress" placeholder="TRX地址长度 12 - 120"/>
          </el-form-item>
          <el-form-item label="提现开关" prop="drawSwitch">
            <el-radio v-model="form.drawSwitch" label="false">关闭</el-radio>
            <el-radio v-model="form.drawSwitch" label="true">开启</el-radio>
          </el-form-item>
          <el-form-item label="提现费率" prop="drawRate">
            <el-input v-model="form.drawRate" placeholder="0-30 最多1位小数(千分)">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer" style="padding-top: 0px">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { editVen } from '@/api/ven'
import { validatPercent } from '@/utils/validate'
import { isEmpty } from '@/utils/index'
import { mathDiv } from '@/utils/math'
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
    const checkRates = (rule, value, callback) => {
      if (!isEmpty(value) && !validatPercent(mathDiv(value, 100))) {
        this.activeName = 'payment'
        callback(new Error('费率为 0-30 最多1位小数(千分)'))
      } else {
        callback()
      }
    }
    const checkTrx = (rule, value, callback) => {
      if (isEmpty(value)) {
        this.activeName = 'payment'
        callback(new Error('请输入TRX钱包地址'))
      } else {
        callback()
      }
    }
    const checkPayment = (rule, value, callback) => {
      if (isEmpty(value)) {
        this.activeName = 'payment'
        callback(new Error('此项必填项'))
      } else {
        callback()
      }
    }
    return {
      dialog: false, loading: false, activeName: 'basic', countryName: '',
      form: {
        id: null,
        countryCode: null,
        name: '',
        phone: '',
        email: '',
        identityType: '',
        identity: '',
        city: '',
        zipCode: '',
        inviteCode: '',
        trxAddress: null,
        payRate: null,
        drawSwitch: null,
        drawRate: null,
        settleMethod: null,
        profitSettleType: null,
        bonusSettleType: null,
        weightNum: '1',
        auditStatus: null,
        disabled: null,
        auditRemark: ''
      },
      rules: {
        countryCode: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入卡商姓名', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 - 64 个字符', trigger: 'blur' }
        ],
        phone: [
          { max: 32, message: '长度不能超过 32 个字符', trigger: 'blur' }
        ],
        email: [
          { max: 64, message: '长度不能超过 64 个字符', trigger: 'blur' }
        ],
        city: [
          { max: 64, message: '长度不能超过 64 个字符', trigger: 'blur' }
        ],
        zipCode: [
          { max: 16, message: '长度不能超过 16 个字符', trigger: 'blur' }
        ],
        disabled: [
          { required: true, message: '请选择账户状态', trigger: 'change' }
        ],
        auditStatus: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        auditRemark: [
          { max: 120, message: '长度不能超过 120 个字符', trigger: 'blur' }
        ],
        trxAddress: [
          { required: true, validator: checkTrx, trigger: 'blur' }
        ],
        payRate: [
          { required: true, validator: checkRates, trigger: 'blur' }
        ],
        drawRate: [
          { required: true, validator: checkRates, trigger: 'blur' }
        ],
        drawSwitch: [
          { required: true, validator: checkPayment, trigger: 'change' }
        ],
        settleMethod: [
          { required: true, validator: checkPayment, trigger: 'change' }
        ],
        profitSettleType: [
          { required: true, validator: checkPayment, trigger: 'change' }
        ],
        bonusSettleType: [
          { required: true, validator: checkPayment, trigger: 'change' }
        ],
        weightNum: [
          { required: true, validator: checkPayment, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    isAuth,
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const param = Object.assign({}, this.form)
          param.payRate = mathDiv(this.form.payRate, 100)
          param.drawRate = mathDiv(this.form.drawRate, 100)
          this.loading = true
          this.doEdit(param)
        } else {
          return false
        }
      })
    },
    doEdit(param) {
      editVen(param).then(res => {
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
        name: '',
        phone: '',
        email: '',
        identityType: '',
        identity: '',
        city: '',
        zipCode: '',
        inviteCode: '',
        trxAddress: null,
        payRate: null,
        drawSwitch: null,
        drawRate: null,
        settleMethod: null,
        profitSettleType: null,
        bonusSettleType: null,
        weightNum: null,
        auditStatus: null,
        disabled: null,
        auditRemark: ''
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
