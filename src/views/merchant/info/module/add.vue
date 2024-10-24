<template>
  <div style="float:left;margin-right: 12px;">
    <el-button size="mini" type="primary" class="filter-item" icon="el-icon-plus" @click="addDialog = true">新增商户</el-button>
    <el-dialog :visible.sync="addDialog" title="新增商户" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="84px">
        <el-form-item size="mini" label="所在国家" prop="countryCode">
          <el-select v-model="form.countryCode" filterable clearable placeholder="请选择国家" style="width: 350px;">
            <el-option
              v-for="item in countryOptions"
              :key="item.code"
              :label="item.code +'-'+ item.name"
              :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商户名称" prop="name">
          <el-input v-model="form.name" style="width: 350px;"/>
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
import { addMch } from '@/api/mch'
import countryOptions from '@/utils/country'
export default {
  data() {
    return {
      addDialog: false, loading: false, countryOptions: countryOptions,
      form: { countryCode: '', name: '' },
      rules: {
        countryCode: [
          { required: true, message: '请选择国家', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入商户名', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
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
          addMch(this.form).then(res => {
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
