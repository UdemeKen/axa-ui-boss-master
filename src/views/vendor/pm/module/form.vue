<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="isAdd ? '新增虚拟账户' : '编辑虚拟账户'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
      <el-form-item label="所属卡商" prop="venId">
        <el-select v-if="isEmpty(form.id)" v-model="form.venId" filterable clearable placeholder="选择卡商" class="filter-item" style="width: 365px;">
          <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id" @click.native="changeVendor(item.code)"/>
        </el-select>
        <span v-if="!isEmpty(form.id)">{{ form.venName }} {{ countryName }}</span>
      </el-form-item>
      <el-form-item label="支付方式" prop="methodCode">
        <el-select v-model="form.methodCode" clearable filterable placeholder="请选择支付方式" class="filter-item" style="width: 365px">
          <el-option v-for="item in pmOptions" :key="item.code" :label="item.name +' - '+ item.code" :value="item.code"/>
        </el-select>
      </el-form-item>
      <el-form-item label="提现费率" prop="payRate">
        <el-input v-model="form.payRate" placeholder="0-30 最多1位小数(千分)">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="收款状态" prop="disabled">
        <el-radio v-model="form.disabled" label="true">启用</el-radio>
        <el-radio v-model="form.disabled" label="false">禁用</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { editVenPm, addVenPm } from '@/api/ven-pm'
import { getPmOptions } from '@/api/payment'
import { validatPercent } from '@/utils/validate'
import { mathDiv } from '@/utils/math'
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
    const checkRates = (rule, value, callback) => {
      if (!isEmpty(value) && !validatPercent(mathDiv(value, 100))) {
        this.activeName = 'payment'
        callback(new Error('费率为 0-30 最多1位小数(千分)'))
      } else {
        callback()
      }
    }
    return {
      dialog: false, loading: false, countryName: '', pmOptions: [],
      form: {
        id: null,
        venId: null,
        venName: '',
        methodCode: null,
        payRate: 0,
        disabled: null
      },
      rules: {
        venId: [
          { required: true, message: '请选择卡商', trigger: 'change' }
        ],
        methodCode: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        payRate: [
          { required: true, validator: checkRates, trigger: 'blur' }
        ],
        disabled: [
          { required: true, message: '请选择启用禁用', trigger: 'blur' }
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
          const param = Object.assign({}, this.form)
          param.payRate = mathDiv(this.form.payRate, 100)
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
      addVenPm(param).then(res => {
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
      editVenPm(param).then(res => {
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
        venId: null,
        venName: '',
        methodCode: null,
        payRate: 0,
        disabled: null
      }
    },
    changeVendor(code) {
      getPmOptions({ countryCode: code, disabled: false, channelId: null }).then(res => {
        this.pmOptions = res.data
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
  .mer-img-name{
    cursor:pointer;
    width: 120px;
    color: #999;
  }
  .mer-img{
    width: 120px;
  }
</style>
