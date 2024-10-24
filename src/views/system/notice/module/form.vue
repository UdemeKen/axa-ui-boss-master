<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="dialog"
    :title="isAdd ? '新增公告' : '编辑公告'"
    width="480px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="公告类型" prop="noticeType">
        <el-select
          v-model="form.noticeType"
          :disabled="!isAdd"
          prop="noticeType"
          clearable
          placeholder="公告类型"
          class="filter-item"
          style="width:100%">
          <el-option label="全部" value="0"/>
          <el-option label="商户" value="1"/>
          <el-option label="商户代理" value="2"/>
          <el-option label="通道代理" value="4"/>
        </el-select>
      </el-form-item>
      <el-form-item label="公告标题" prop="title">
        <el-input v-model="form.title" prop="title" clearable placeholder="标题长度 2-60"/>
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <el-input v-model="form.content" :rows="4" clearable type="textarea" placeholder="内容长度 0-600"/>
      </el-form-item>
      <el-form-item label="公告封面" prop="coverImg">
        <el-tooltip v-if="form.coverImg" placement="top" style="float:left;margin-right: 20px">
          <div slot="content"><img :src="form.coverImg" class="mer-img" style="max-width: 200px"></div>
          <span class="mer-img-name">{{ form.coverImg.substring(form.coverImg.length - 36,form.coverImg.length) }}</span>
        </el-tooltip>
        <el-upload
          :headers="headers"
          :show-file-list="false"
          :before-upload="beforeUploadHandle"
          :on-success="successHandle"
          action="/file/upload">
          <el-button :loading="upLoading" size="mini" type="info" round icon="el-icon-upload">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否置顶" prop="topest">
        <el-radio v-model="form.topest" label="false">否</el-radio>
        <el-radio v-model="form.topest" label="true">是</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
import { add, edit } from '@/api/sys-notice'

export default {
  name: 'Form',
  props: {
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      upLoading: false,
      isAdd: false,
      dialog: false,
      coverName: '',
      loading: false,
      form: { id: null, title: null, coverImg: null, topest: 'false', content: null },
      rules: {
        noticeType: [
          { required: true, message: '请选择公告类型', trigger: 'blur,change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, max: 60, message: '标题长度 2-60', trigger: 'blur' }
        ],
        content: [
          { max: 600, message: '内容长度 0-600', trigger: 'blur' }
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
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm() {
      this.dialog = false
      this.coverName = ''
      this.form = { id: null, title: null, coverImg: null, topest: 'false', content: null }
    },
    beforeUploadHandle(file) {
      if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        this.$message.error('只支持jpg、png、gif格式的图片！')
        return false
      }
      const size = file.size / 1024 / 1024
      if (size > 2) {
        this.$message.error('图片大小不能超过2M！')
        return false
      }
      this.upLoading = true
    },
    successHandle(response) {
      this.upLoading = false
      const form = this.form
      if (response && response.success) {
        this.coverName = response.name
        form.coverImg = response.url
      } else {
        this.$message.error(response.msg)
      }
    }
  }
}
</script>
