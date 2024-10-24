<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" title="编辑商户" width="450px">
    <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="100px">
      <el-tabs v-model="activeName" type="card" style="min-height: 470px;">
        <el-tab-pane label="商户信息" name="basic">
          <el-form-item label="所在国家" prop="countryCode">
            <span>{{ form.countryCode }}-{{ countryName }}</span>
          </el-form-item>
          <el-form-item label="商户代理" prop="matId">
            <el-select v-model="form.matId" filterable placeholder="选择代理">
              <el-option label="无代理" value="0" />
              <el-option v-for="item in matOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="商户名称" prop="name">
            <el-input v-model="form.name" placeholder="商户名长度 2 - 64" />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入正确的手机号码" />
          </el-form-item>
          <el-form-item label="联系邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入正确的通信邮箱" />
          </el-form-item>
          <el-form-item label="轮询类型" prop="payPollType">
            <el-radio v-model="form.payPollType" label="0">随机轮询</el-radio>
            <el-radio v-model="form.payPollType" label="1">权重轮询</el-radio>
            <el-radio v-model="form.payPollType" label="2">金额轮询</el-radio>
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
            <el-input v-model="form.auditRemark" :rows="2" clearable type="textarea" placeholder="备注长度 0-120" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="支付配置" name="payment">
          <el-form-item label="APP_ID" prop="appId" style="margin-bottom: 10px">
            <span>{{ form.appId }}</span> <el-button v-if="isAuth('mch:app:id')" type="text"
              @click="editAppId">重置</el-button>
          </el-form-item>
          <el-form-item label="APP_密钥" prop="appSecret">
            <span>{{ form.appSecret }}</span> <el-button v-if="isAuth('mch:app:secret')" type="text"
              @click="editAppKey">重置</el-button>
          </el-form-item>
          <el-form-item label="TRX地址" prop="trxAddress">
            <el-input v-model="form.trxAddress" placeholder="TRX地址长度 12 - 120" />
          </el-form-item>
          <el-form-item label="代付开关" prop="drawSwitch">
            <el-radio v-model="form.drawSwitch" label="true">开启</el-radio>
            <el-radio v-model="form.drawSwitch" label="false">关闭</el-radio>
          </el-form-item>
          <el-form-item label="代付费率" prop="drawRate">
            <el-input v-model="form.drawRate" placeholder="0-30 最多1位小数(千分)">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="代付费用" prop="drawCost">
            <el-input v-model="form.drawCost" placeholder="代付费用 最多2位小数">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="支付回调地址" prop="payNotifyUrl">
            <el-input v-model="form.payNotifyUrl" placeholder="支付回调地址长度 12 - 120" />
          </el-form-item>
          <el-form-item label="代付回调地址" prop="drawNotifyUrl">
            <el-input v-model="form.drawNotifyUrl" placeholder="代付回调地址长度 12 - 120" />
          </el-form-item>
          <el-form-item label="是否开启谷歌验证码" prop="googleCodeInit">
            <el-radio-group v-model="form.googleCodeInit" @input="editGoogleCodeInit">
              <el-radio :label="true">开启</el-radio>
              <el-radio :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="谷歌安全码" prop="drawGoogleCode">
            <img v-if="form.drawGoogleCode" :src="'data:image/png;base64,' + form.drawGoogleCodeBase"
              style="float: left;margin-right: 20px">
            <el-button v-if="isAuth('mch:draw:gc')" type="text" @click="editAppGc">[重置安全码]</el-button>
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
import { editMch, resetMchAppId, resetMchAppSecret, resetMchDGC, editGooleCode } from '@/api/mch'
import { validatPercent } from '@/utils/validate'
import { isEmpty } from '@/utils/index'
import { mathDiv, mathMul } from '@/utils/math'
export default {
  name: 'Form',
  props: {
    sup_this: {
      type: Object,
      default: null
    },
    matOptions: {
      type: Array,
      required: true
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
        callback(new Error('请输入TRX地址'))
      } else {
        callback()
      }
    }
    const checkDS = (rule, value, callback) => {
      if (isEmpty(value)) {
        this.activeName = 'payment'
        callback(new Error('请选择提现开关'))
      } else {
        callback()
      }
    }
    return {
      dialog: false, loading: false, activeName: 'basic', countryName: '',
      form: {
        id: null,
        googleCodeInit: null,
        name: '',
        countryCode: '',
        phone: '',
        email: '',
        payNotifyUrl: '',
        drawNotifyUrl: '',
        payPollType: '0',
        appId: '',
        appSecret: '',
        matId: null,
        disabled: null,
        auditStatus: null,
        auditRemark: '',
        drawSwitch: null,
        drawRate: 0,
        drawCost: 0,
        trxAddress: '',
        drawGoogleCode: '',
        drawGoogleCodeBase: ''
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
        payNotifyUrl: [
          { max: 128, message: '支付回调地址不能超过 128 个字符', trigger: 'blur' }
        ],
        drawNotifyUrl: [
          { max: 128, message: '代付回调地址不能超过 128 个字符', trigger: 'blur' }
        ],
        payPollType: [
          { required: true, message: '请选择轮询规则', trigger: 'change' }
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
        trxAddress: [
          { required: true, validator: checkTrx, trigger: 'blur' }
        ],
        drawRate: [
          { required: true, validator: checkRates, trigger: 'blur' }
        ],
        drawCost: [
          { required: true, message: '请输入代付费用', trigger: 'blur' }
        ],
        drawSwitch: [
          { required: true, validator: checkDS, trigger: 'change' }
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
          param.drawRate = mathDiv(this.form.drawRate, 100)
          param.drawCost = mathMul(this.form.drawCost, 100)
          this.loading = true
          this.doEdit(param)
        } else {
          return false
        }
      })
    },
    doEdit(param) {
      editMch(param).then(res => {
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
    editAppId() {
      resetMchAppId({ id: this.form.id }).then(res => {
        if (res.success) {
          this.form.appId = res.appId
          this.$notify({
            title: 'APP_ID 重置成功',
            type: 'success',
            duration: 2000
          })
        }
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    editAppKey() {
      resetMchAppSecret({ id: this.form.id }).then(res => {
        if (res.success) {
          this.form.appSecret = res.appSecret
          this.$notify({
            title: 'APP_KEY 重置成功',
            type: 'success',
            duration: 2000
          })
        }
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    editAppGc() {
      resetMchDGC({ id: this.form.id }).then(res => {
        if (res.success) {
          this.form.drawGoogleCode = res.googleCode
          this.form.drawGoogleCodeBase = res.googleCodeBase
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
        countryCode: '',
        phone: '',
        email: '',
        payNotifyUrl: '',
        drawNotifyUrl: '',
        payPollType: '0',
        appId: '',
        appSecret: '',
        matId: null,
        disabled: null,
        auditStatus: null,
        auditRemark: '',
        drawSwitch: null,
        drawRate: 0,
        drawCost: 0,
        trxAddress: '',
        drawGoogleCode: '',
        drawGoogleCodeBase: '',
        googleCodeInit: null,
      }
    },
    // 修改是否需要谷歌验证码
    editGoogleCodeInit() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      editGooleCode({ id: this.form.id }).then(res => {
        loading.close();
        if (res.success) {
          this.$notify({
            title: '修改是否需要谷歌验证码成功',
            type: 'success',
            duration: 2000
          })
        }
      }).catch(err => {
        loading.close();
        this.form.googleCodeInit = !this.form.googleCodeInit
        console.log(err)
      })
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

.mer-img-name {
  cursor: pointer;
  width: 120px;
  color: #999;
}

.mer-img {
  width: 120px;
}
</style>
