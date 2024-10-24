<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" title="编辑IP白名单" width="450px">
    <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="100px">
          <el-form-item label="商户ID" prop="name">
            <el-input v-model="form.mchId" placeholder="商户名长度 2 - 64"/>
          </el-form-item>
          <el-form-item label="白名单IP" prop="ip">
            <el-input v-model="form.ip" placeholder="请输入白名单IP"/>
          </el-form-item>
          <el-form-item label="备注" prop="email">
            <el-input v-model="form.remark" placeholder="请输入备注"/>
          </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="padding-top: 0px">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { editIpWhite} from '@/api/mch-ipWhite'
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
    return {
      dialog: false, loading: false, activeName: 'basic', countryName: '',
      form: {
        id: null,
        mchId: null,
        ip: '',
        remark: ''
      },
      rules: {
        mchId: [
          { required: true, message: '请输入商户ID', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入白名单IP', trigger: 'blur' },
          { min:7,max:15, message: 'IP长度在 7 到 15 个字符', trigger: 'blur' }
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
          this.loading = true
          this.doEdit(param)
        } else {
          return false
        }
      })
    },
    doEdit(param) {
      editIpWhite(param).then(res => {
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
        mchId: null,
        ip: '',
        remark: ''
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
