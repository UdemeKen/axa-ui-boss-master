<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="isAdd ? '新增用户' : '编辑用户'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="84px">
      <el-form-item label="登录账号" prop="loginAccount">
        <el-input v-model="form.loginAccount" style="width: 350px;"/>
      </el-form-item>
      <el-form-item label="登录密码" prop="loginPwd">
        <el-input v-model="form.loginPwd" style="width: 350px;"/>
      </el-form-item>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name" style="width: 350px;"/>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="form.phone" style="width: 350px;"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" style="width: 350px;"/>
      </el-form-item>
      <el-form-item label="状态" prop="disabled">
        <el-radio v-model="form.disabled" label="false">启用</el-radio>
        <el-radio v-model="form.disabled" label="true">禁用</el-radio>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="form.roleId" clearable placeholder="角色" class="filter-item" style="width: 350px;">
          <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addUser, editUser } from '@/api/sys-user'
import { validatMobile } from '@/utils/validate'
import { isEmpty } from '@/utils/index'

export default {
  name: 'Form',
  props: {
    roleOptions: {
      type: Array,
      required: true
    },
    isAdd: {
      type: Boolean,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkMobile = (rule, value, callback) => {
      if (isEmpty(value)) {
        callback(new Error('请输入手机号码'))
      } else if (validatMobile(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }
    return {
      dialog: false, loading: false, form: { id: null, disabled: 'false', roleId: null, name: '', phone: '', email: '', loginAccount: '', loginPwd: '' },
      rules: {
        loginAccount: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        disabled: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'blur,change' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else {
            this.doEdit()
          }
        } else {
          return false
        }
      })
    },
    doAdd() {
      addUser(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit() {
      editUser(this.form).then(res => {
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
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { id: null, disabled: 'false', roleId: null, name: '', loginGoogleCode: '', loginGcBase: '', phone: '', email: '', loginAccount: '', loginPwd: '' }
    }
  }
}
</script>

<style scoped>

</style>
