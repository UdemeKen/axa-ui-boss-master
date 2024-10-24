<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="resetLogin ? '重置登录密码' : '重置提现密码'" width="450px">
    <el-form ref="psw" :model="form" :rules="rules" size="mini" label-width="100px">
      <el-form-item :label="resetLogin ?'新登录密码' : '新提现密码'" prop="newPwd">
        <el-input v-model.trim="form.newPwd" type="password" placeholder="请输入 6-20 位新密码" style="width: 300px;"/>
      </el-form-item>
      <el-form-item :label="resetLogin ?'确认密码' : '确认密码'" prop="repeatPwd">
        <el-input v-model.trim="form.repeatPwd" type="password" placeholder="确认两次输入密码一致" style="width: 300px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="padding-top: 0px">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { resetVenLoginPsw, resetVenDrawPsw } from '@/api/ven'
import { isEmpty } from '@/utils/index'

export default {
  name: 'Psw',
  props: {
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkPsw = (rule, value, callback) => {
      if (isEmpty(value)) {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.form.newPwd) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      dialog: false, loading: false, resetLogin: false,
      form: { id: null, newPwd: null, repeatPwd: null },
      rules: {
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        repeatPwd: [
          { required: true, validator: checkPsw, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['psw'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.resetLogin) {
            this.resetLoginPsw()
          } else {
            this.resetDrawPsw()
          }
        } else {
          return false
        }
      })
    },
    resetLoginPsw() {
      resetVenLoginPsw({ id: this.form.id, newPwd: this.form.newPwd, repeatPwd: this.form.repeatPwd }).then(res => {
        this.resetForm()
        this.$notify({
          title: '登录密码重置成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetDrawPsw() {
      resetVenDrawPsw({ id: this.form.id, newPwd: this.form.newPwd, repeatPwd: this.form.repeatPwd }).then(res => {
        this.resetForm()
        this.$notify({
          title: '代付密码重置成功',
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
      this.dialog = false
      this.$refs['psw'].resetFields()
      this.form = {
        id: null,
        newPwd: null,
        repeatPwd: null
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
