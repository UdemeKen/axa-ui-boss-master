<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" title="编辑商户代理" width="450px">
    <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="90px">
      <el-tabs v-model="activeName" type="card" style="min-height: 330px;">
        <el-tab-pane label="代理信息" name="basic">
          <el-form-item label="所在国家" prop="countryCode">
            <span>{{ form.countryCode }}-{{ countryName }}</span>
          </el-form-item>
          <el-form-item label="代理名称" prop="name">
            <el-input v-model="form.name" placeholder="代理名长度 2 - 64"/>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入正确的手机号码"/>
          </el-form-item>
          <el-form-item label="联系邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入正确的通信邮箱"/>
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
            <el-input v-model="form.auditRemark" :rows="2" clearable type="textarea" placeholder="备注长度 0-120"/>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="提现配置" name="payment">
          <el-form-item label="TRX地址" prop="trxAddress">
            <el-input v-model="form.trxAddress" placeholder="TRX地址长度 12 - 120"/>
          </el-form-item>
          <el-form-item label="提现开关" prop="drawSwitch">
            <el-radio v-model="form.drawSwitch" label="true">开启</el-radio>
            <el-radio v-model="form.drawSwitch" label="false">关闭</el-radio>
          </el-form-item>
          <el-form-item label="提现费率" prop="drawRate">
            <el-input v-model="form.drawRate" placeholder="0-30 最多1位小数(千分)">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="谷歌安全码" prop="drawGoogleCode">
            <img v-if="form.drawGoogleCode" :src="'data:image/png;base64,' + form.drawGoogleCodeBase" style="float: left;margin-right: 20px">
            <el-button v-if="isAuth('agt:draw:gc')" type="text" @click="editAppGc">[重置安全码]</el-button>
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
import { mathDiv } from '@/utils/math'
import { editAgent, resetAgentDGC } from '@/api/agent'
import { validatPercent } from '@/utils/validate'
import { isEmpty } from '@/utils/index'

export default {
  name: 'Form',
  props: {
    sup_this: {
      type: Object,
      default: null
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
        name: '',
        agentType: null,
        countryCode: null,
        phone: '',
        email: '',
        disabled: null,
        auditStatus: null,
        auditRemark: '',
        profitSettleType: null,
        drawSwitch: null,
        drawRate: null,
        trxAddress: '',
        drawGoogleCode: null,
        drawGoogleCodeBase: null
      },
      rules: {
        countryCode: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入商户名', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
        ],
        phone: [
          { max: 32, message: '电话号码长度不能超过 32 个字符', trigger: 'blur' }
        ],
        email: [
          { max: 64, message: '邮箱地址不能超过 64 个字符', trigger: 'blur' }
        ],
        disabled: [
          { required: true, message: '请选择账户状态', trigger: 'change' }
        ],
        auditStatus: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        auditRemark: [
          { max: 120, message: '审核备注不能超过 120 个字符', trigger: 'blur' }
        ],
        drawRate: [
          { required: true, validator: checkRates, trigger: 'blur' }
        ],
        drawSwitch: [
          { required: true, validator: checkPayment, trigger: 'blur' }
        ],
        trxAddress: [
          { required: true, validator: checkPayment, trigger: 'blur' }
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
          this.loading = true
          const param = Object.assign({}, this.form)
          param.drawRate = mathDiv(this.form.drawRate, 100)
          alert(param.agentType)
          this.doEdit(param)
        } else {
          return false
        }
      })
    },
    doEdit(param) {
      editAgent(param).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
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
    editAppGc() {
      resetAgentDGC({ id: this.form.id }).then(res => {
        if (res.success) {
          this.form.drawGoogleCode = res.data.googleCode
          this.form.drawGoogleCodeBase = res.data.googleCodeBase
          this.$notify({
            title: 'Google安全码 重置成功',
            type: 'success',
            duration: 2000
          })
        }
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
        name: '',
        agentType: null,
        countryCode: null,
        phone: '',
        email: '',
        disabled: null,
        auditStatus: null,
        auditRemark: '',
        profitSettleType: null,
        drawSwitch: null,
        drawRate: null,
        trxAddress: '',
        drawGoogleCode: null,
        drawGoogleCodeBase: null
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
  .mer-img-name{
    cursor:pointer;
    width: 120px;
    color: #999;
  }
  .mer-img{
    width: 120px;
  }
</style>
