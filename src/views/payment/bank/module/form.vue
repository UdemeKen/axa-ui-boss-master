<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="isAdd ? '新增银行' : '编辑银行'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
      <el-form-item size="mini" label="所在国家" prop="countryCode">
        <el-select v-if="isEmpty(form.id)" v-model="form.countryCode" filterable clearable placeholder="请选择国家" style="width: 360px;">
          <el-option
            v-for="item in countryOptions"
            :key="item.code"
            :label="item.code +'-'+ item.name"
            :value="item.code"/>
        </el-select>
        <span v-else>{{ countryName }}</span>
      </el-form-item>
      <el-form-item label="银行编码" prop="bankCode" style="margin-bottom: 5px">
        <el-input v-model="form.bankCode" placeholder="6位银行编码" style="width: 360px;"/>
        <br><span style="color:#606266">编码规则：2位国家编码 + B + 3位数字</span>
      </el-form-item>
      <el-form-item label="英文名称" prop="bankName">
        <el-input v-model="form.bankName" placeholder="银行英文名称长度 2-64" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="中文名称" prop="bankCnName">
        <el-input v-model="form.bankCnName" placeholder="银行中文名称长度 2-64" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="银行图标" prop="iconUrl">
        <el-input v-model="form.iconUrl" placeholder="图标地址长度 2-120" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="配置JS" prop="jsUrl">
        <el-input v-model="form.jsUrl" placeholder="JS地址长度 2-120" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="排列序号" prop="sortNum">
        <el-input v-model.number="form.sortNum" placeholder="排列序号" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="启用状态" prop="disabled">
        <el-radio v-model="form.disabled" label="false">启用</el-radio>
        <el-radio v-model="form.disabled" label="true">禁用</el-radio>
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
import { editBank, addBank } from '@/api/payment'
import countryOptions from '@/utils/country'
import { isEmpty } from '@/utils/index'
export default {
  name: 'Form',
  props: {
    sup_this: {
      type: Object,
      default: null
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
    return {
      dialog: false, loading: false, countryName: '', countryOptions: countryOptions,
      form: {
        id: null,
        countryCode: null,
        currencyCode: '',
        bankCode: '',
        bankName: '',
        bankCnName: '',
        iconUrl: '',
        jsUrl: '',
        sortNum: 1,
        disabled: null
      },
      rules: {
        countryCode: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ],
        bankCode: [
          { required: true, message: '请输入银行编码', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        bankName: [
          { required: true, message: '请输入银行名称', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
        ],
        bankCnName: [
          { required: true, message: '请输入银行中文名称', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
        ],
        sortNum: [
          { required: true, message: '请输入序号', trigger: 'blur' }
        ],
        disabled: [
          { required: true, message: '请选择状态', trigger: 'change' }
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
      addBank(param).then(res => {
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
      editBank(param).then(res => {
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
        currencyCode: '',
        bankCode: '',
        bankName: '',
        bankCnName: '',
        jsUrl: '',
        iconUrl: '',
        sortNum: 1,
        disabled: null
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
