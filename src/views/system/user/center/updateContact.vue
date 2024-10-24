<template>
  <div style="display: inline-block">
    <el-button size="mini" class="button" type="info" @click="showDialog">修改</el-button>
    <el-dialog :visible.sync="dialog" :title="title" width="500px" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="88px">
        <el-form-item label="登录密码" prop="pwd">
          <el-input v-model="form.pwd" type="password" auto-complete="on" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="联系邮箱" prop="newEmail">
          <el-input v-model="form.newEmail" clearable style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="newPhone">
          <el-input v-model="form.newPhone" clearable style="width: 370px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isEmpty } from '@/utils/index'
import { validatMobile, validatEmail } from '@/utils/validate'
import { updateMyContact } from '@/api/sys-user'
export default {
  props: {
    email: {
      type: String,
      default: '',
      required: false
    },
    phone: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    const checkMobile = (rule, value, callback) => {
      if (isEmpty(value)) {
        callback(new Error('请输入联系电话'))
      } else if (validatMobile(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }
    const checkEmail = (rule, value, callback) => {
      if (isEmpty(value)) {
        callback(new Error('请输入联系邮箱'))
      } else if (validatEmail(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱'))
      }
    }
    return {
      loading: false, dialog: false, title: '修改联系方式', form: { pwd: '', newEmail: '', newPhone: '' },
      rules: {
        pwd: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        newEmail: [
          { required: true, validator: checkEmail, trigger: 'blur' }
        ],
        newPhone: [
          { required: true, validator: checkMobile, trigger: 'blur' }
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
          updateMyContact(this.form.newEmail, this.form.newPhone, this.form.pwd).then(res => {
            this.resetForm()
            this.$notify({
              title: '修改成功',
              type: 'success',
              duration: 1500
            })
            this.loading = false
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { pwd: '', newEmail: '', newPhone: '' }
    },
    showDialog() {
      this.dialog = true
      this.form.newEmail = this.email
      this.form.newPhone = this.phone
    }
  }
}
</script>

<style scoped>

</style>
