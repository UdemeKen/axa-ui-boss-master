<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="isAdd ? '新增收款账户' : '编辑收款账户'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
      <el-tabs v-model="activeName" type="card" style="min-height: 500px;">
        <el-tab-pane label="账户配置" name="basic">
          <el-form-item label="所属卡商" prop="venId">
            <el-select v-if="isEmpty(form.id)" v-model="form.venId" filterable clearable placeholder="选择卡商" class="filter-item" style="width: 365px;">
              <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id" @click.native="changeVendor(item.code)"/>
            </el-select>
            <span v-if="!isEmpty(form.id)">{{ form.venName }} {{ countryName }}</span>
          </el-form-item>
          <el-form-item label="收款方式" prop="methodCode">
            <el-select v-model="form.methodCode" clearable filterable placeholder="请选择支付方式" class="filter-item" style="width: 365px">
              <el-option v-for="item in pmOptions" :key="item.code" :label="item.name +' - '+ item.code" :value="item.code"/>
            </el-select>
          </el-form-item>
          <el-form-item label="支持单号" prop="supportNo">
            <el-radio v-model="form.supportNo" label="true">是</el-radio>
            <el-radio v-model="form.supportNo" label="false">否</el-radio>
          </el-form-item>
          <el-form-item label="身份标识" prop="identityType">
            <el-select v-model="form.identityType" clearable placeholder="选择身份标识标识" style="width: 365px;">
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
            <el-input v-model="form.identity" placeholder="0 - 240" style="width: 365px;"/>
          </el-form-item>
          <el-form-item label="开户银行" prop="bankCode">
            <el-select v-model="form.bankCode" clearable filterable placeholder="请选择银行" class="filter-item" style="width: 365px">
              <el-option v-for="item in bankOptions" :key="item.code" :label="item.name" :value="item.code"/>
            </el-select>
          </el-form-item>
          <el-form-item label="开户姓名" prop="payeeOwner">
            <el-input v-model="form.payeeOwner" placeholder="2 - 120" style="width: 365px;"/>
          </el-form-item>
          <el-form-item label="开户账号" prop="payeeKey">
            <el-input v-model="form.payeeKey" placeholder="2 - 120" style="width: 365px;"/>
          </el-form-item>
          <el-form-item label="附加信息" prop="payeeAttach">
            <el-input v-model="form.payeeAttach" placeholder="0 - 500" style="width: 365px;"/>
          </el-form-item>
          <el-form-item label="开户密钥" prop="payeeSecret">
            <el-input v-model="form.payeeSecret" :rows="2" clearable type="textarea" placeholder="密钥长度不超过0-1200" style="width: 365px;"/>
          </el-form-item>
          <el-form-item
            v-for="(config, index) in kvList"
            :label="'账户配置' + (index+1)"
            :key="config.k +'-'+ (index+1)"
            class="is-required">
            <el-input v-model="config.k" placeholder="KEY" style="width: 100px"/>
            <el-input v-model="config.v" placeholder="VALUE" style="width: 185px"/>
            <el-button icon="el-icon-plus" style="padding: 7px 10px" @click="addConfig"/>
            <el-button style="margin-left:0px;padding: 7px 10px" icon="el-icon-minus" @click.prevent="removeConfig(config)"/>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="支付配置" name="payment">
          <el-form-item label="登录密码" prop="loginPwd">
            <el-input v-model="form.loginPwd" placeholder="密码长度最大 64" style="width: 365px;"/>
          </el-form-item>
          <el-form-item label="转账密码" prop="xferPwd">
            <el-input v-model="form.xferPwd" placeholder="密码长度最大 64" style="width: 365px;"/>
          </el-form-item>
          <el-form-item label="收款开关" prop="paySwitch">
            <el-radio-group v-model="form.paySwitch" @change="changePaySwitch">
              <el-radio label="true">开启</el-radio>
              <el-radio label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="收款区间" required>
            <el-row>
              <el-col :span="11">
                <el-form-item prop="payMinAmount" style="margin-bottom: 0px">
                  <el-input v-model.number="form.payMinAmount" clearable placeholder="最小金额" >
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="line" style="text-align: center">-</el-col>
              <el-col :span="11">
                <el-form-item prop="payMaxAmount" style="margin-bottom: 0px">
                  <el-input v-model.number="form.payMaxAmount" clearable placeholder="最大金额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="中转开关" prop="midSwitch">
            <el-radio-group v-model="form.midSwitch" @change="changeMidSwitch">
              <el-radio label="true">开启</el-radio>
              <el-radio label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="代付开关" prop="drawSwitch">
            <el-radio-group v-model="form.drawSwitch" @change="changeDrawSwitch">
              <el-radio label="true">开启</el-radio>
              <el-radio label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="代付区间" required>
            <el-row>
              <el-col :span="11">
                <el-form-item prop="drawMinAmount" style="margin-bottom: 0px">
                  <el-input v-model.number="form.drawMinAmount" clearable placeholder="最小金额" >
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="line" style="text-align: center">-</el-col>
              <el-col :span="11">
                <el-form-item prop="drawMaxAmount" style="margin-bottom: 0px">
                  <el-input v-model.number="form.drawMaxAmount" clearable placeholder="最大金额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
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
import { editVenPayee, addVenPayee } from '@/api/ven-payee'
import { getPmOptions } from '@/api/payment'
import { mathMul } from '@/utils/math'
import { isEmpty } from '@/utils/index'
export default {
  name: 'Form',
  props: {
    sup_this: {
      type: Object,
      default: null
    },
    venOptions: {
      type: Array,
      required: true
    },
    bankOptions: {
      type: Array,
      required: true
    },
    isAdd: {
      type: Boolean,
      required: true
    },
    pageNum: {
      type: Number,
      required: true
    }
  },
  data() {
    const checkPayment = (rule, value, callback) => {
      if (isEmpty(value)) {
        this.activeName = 'payment'
        callback(new Error('此项必填项'))
      } else {
        callback()
      }
    }
    return {
      dialog: false, loading: false, activeName: 'basic', countryName: '', pmOptions: [], kvList: [{ k: 'key', v: '' }],
      form: {
        id: null,
        venId: null,
        venName: '',
        methodCode: null,
        bankCode: null,
        identityType: 'NON',
        identity: '',
        payeeOwner: '',
        payeeKey: '',
        payeeSecret: '',
        payeeAttach: '',
        loginPwd: '',
        xferPwd: '',
        payeeJson: '',
        midSwitch: 'false',
        paySwitch: 'true',
        payMinAmount: 1,
        payMaxAmount: 100000,
        drawSwitch: 'false',
        drawMinAmount: 1,
        drawMaxAmount: 100000,
        disabled: 'false',
        auditStatus: '1',
        auditRemark: ''
      },
      rules: {
        venId: [
          { required: true, message: '请选择卡商', trigger: 'change' }
        ],
        methodCode: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        payeeOwner: [
          { required: true, message: '请输入开户人姓名', trigger: 'blur' },
          { min: 2, max: 128, message: '长度在 2 到 128 个字符', trigger: 'blur' }
        ],
        payeeKey: [
          { required: true, message: '请输入开户账号', trigger: 'blur' },
          { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
        ],
        payeeSecret: [
          { max: 1200, message: '开户密钥长度不能超过 1200 个字符', trigger: 'blur' }
        ],
        payeeAttach: [
          { max: 500, message: '附加数据不能超过 500 个字符', trigger: 'blur' }
        ],
        paySwitch: [
          { required: true, validator: checkPayment, trigger: 'change' }
        ],
        midSwitch: [
          { required: true, validator: checkPayment, trigger: 'change' }
        ],
        payMinAmount: [
          { required: true, validator: checkPayment, trigger: 'blur' },
          { type: 'number', min: 1, max: 100000, message: '最低金额 1~100000', trigger: 'blur' }
        ],
        payMaxAmount: [
          { required: true, validator: checkPayment, trigger: 'blur' },
          { type: 'number', min: 1, max: 100000, message: '最大金额 1~100000', trigger: 'blur' }
        ],
        drawSwitch: [
          { required: true, validator: checkPayment, trigger: 'change' }
        ],
        drawMinAmount: [
          { required: true, validator: checkPayment, trigger: 'blur' },
          { type: 'number', min: 1, max: 100000, message: '最低金额 1~100000', trigger: 'blur' }
        ],
        drawMaxAmount: [
          { required: true, validator: checkPayment, trigger: 'blur' },
          { type: 'number', min: 1, max: 100000, message: '最大金额 1~100000', trigger: 'blur' }
        ],
        disabled: [
          { required: true, validator: checkPayment, trigger: 'change' }
        ],
        auditStatus: [
          { required: true, validator: checkPayment, trigger: 'blur' }
        ],
        auditRemark: [
          { max: 120, message: '备注不能超过 120 个字符', trigger: 'blur' }
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
          let sub = false
          const map = {}
          this.kvList.forEach(function(data, index) {
            if (isEmpty(data.k) || isEmpty(data.v)) {
              this.$message({
                message: '配置项' + (index + 1) + ': KEY与VALUE都不能为空',
                type: 'warning'
              })
              sub = true
            } else {
              map[data.k] = data.v
            }
          })
          if (sub) {
            return false
          }
          this.form.payeeJson = JSON.stringify(map)
          const param = Object.assign({}, this.form)
          param.payMinAmount = mathMul(this.form.payMinAmount, 100)
          param.payMaxAmount = mathMul(this.form.payMaxAmount, 100)
          param.drawMinAmount = mathMul(this.form.drawMinAmount, 100)
          param.drawMaxAmount = mathMul(this.form.drawMaxAmount, 100)
          this.loading = true
          if (this.isAdd) {
            this.doAdd(param)
          } else {
            this.doEdit(param)
          }
        } else {
          return false
        }
      })
    },
    doAdd(param) {
      addVenPayee(param).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.page = 1
        this.$parent.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit(param) {
      editVenPayee(param).then(res => {
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
      this.kvList = [{ k: 'key', v: '' }]
      this.$refs['form'].resetFields()
      this.form = {
        id: null,
        venId: null,
        venName: '',
        methodCode: null,
        bankCode: null,
        identityType: 'NON',
        identity: '',
        payeeOwner: '',
        payeeKey: '',
        payeeSecret: '',
        payeeAttach: '',
        loginPwd: '',
        xferPwd: '',
        payeeJson: '',
        paySwitch: null,
        payMinAmount: 1,
        payMaxAmount: 100000,
        midSwitch: null,
        drawSwitch: null,
        drawMinAmount: 1,
        drawMaxAmount: 100000,
        disabled: null,
        auditStatus: null,
        auditRemark: ''
      }
    },
    addConfig() {
      this.kvList.push({
        k: '',
        v: ''
      })
    },
    removeConfig(item) {
      const index = this.kvList.indexOf(item)
      if (index !== -1 && this.kvList.length !== 1) {
        this.kvList.splice(index, 1)
      }
    },
    changeVendor(code) {
      getPmOptions({ countryCode: code, disabled: false, drawSwitch: true }).then(res => {
        this.pmOptions = res.data
      })
    },
    changePaySwitch(val) {
      if (val) {
        this.form.drawSwitch = 'false'
        this.form.midSwitch = 'false'
      }
    },
    changeDrawSwitch(val) {
      if (val) {
        this.form.paySwitch = 'false'
        this.form.midSwitch = 'false'
      }
    },
    changeMidSwitch(val) {
      if (val) {
        this.form.drawSwitch = 'false'
        this.form.paySwitch = 'false'
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
