<template>
  <div style="float:left;margin-right: 12px;">
    <el-button size="mini" type="primary" class="filter-item" icon="el-icon-plus" @click="addDialog = true">新增IP白名单</el-button>
    <el-dialog :visible.sync="addDialog" title="新增IP白名单" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="84px">
        <el-form-item label="商户ID" prop="name">
          <el-input v-model="form.mchId" style="width: 350px;"/>
        </el-form-item>
        <el-form-item label="白名单IP" prop="name">
          <el-input v-model="form.ip" style="width: 350px;"/>
        </el-form-item>
        <el-form-item label="备注" prop="name">
          <el-input v-model="form.remark" style="width: 350px;"/>
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
import { addIpWhite } from '@/api/mch-ipWhite'
import countryOptions from '@/utils/country'
export default {
  data() {
    return {
      addDialog: false, loading: false,
      form: { mchId: '', ip: '',remark: '' },
      rules: {
        mchId: [
          { required: true, message: '请输入商户ID', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入白名单IP', trigger: 'blur' },
          { min: 7, max: 15, message: '长度在 7 到 15 个字符', trigger: 'blur' }
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
          addIpWhite(this.form).then(res => {
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
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.addDialog = false
      this.$refs['form'].resetFields()
      this.form = { countryCode: '', name: '' }
    }
  }
}
</script>
