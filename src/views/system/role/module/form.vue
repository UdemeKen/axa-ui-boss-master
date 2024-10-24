<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="isAdd ? '新增角色' : '编辑角色'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="编码" prop="codeStr">
        <el-input v-model="form.codeStr" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="序号" prop="sortNum">
        <el-input v-model="form.sortNum" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addRole, editRole } from '@/api/sys-role'
export default {
  props: {
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
    return {
      loading: false, dialog: false,
      form: { id: 0, name: '', codeStr: '', sortNum: 0 },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        codeStr: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { max: 20, message: '长度不能超过 20 个字符', trigger: 'blur' }
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
      addRole(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.loadRoleList()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit() {
      editRole(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.loadRoleList()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { id: 0, name: '', codeStr: '', sortNum: 0 }
    }
  }
}
</script>
