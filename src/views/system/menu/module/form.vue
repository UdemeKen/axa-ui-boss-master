<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="isAdd ? '新增资源' : '编辑资源'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="资源图标">
        <el-popover
          placement="bottom-start"
          width="460"
          trigger="click"
          @show="$refs['iconSelect'].reset()">
          <IconSelect ref="iconSelect" @selected="selected" />
          <el-input slot="reference" v-model="form.iconClass" style="width: 460px;" placeholder="点击选择图标" readonly>
            <svg-icon v-if="form.iconClass" slot="prefix" :icon-class="form.iconClass" class="el-input__icon" style="height: 32px;width: 16px;" />
            <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="form.name" placeholder="名称" style="width: 460px;"/>
      </el-form-item>
      <el-form-item label="资源编码" prop="codeStr">
        <el-input v-model="form.codeStr" placeholder="编码" style="width: 460px;"/>
      </el-form-item>
      <el-form-item label="资源排序" prop="sortNum">
        <el-input v-model.number="form.sortNum" placeholder="序号越小越靠前" style="width: 460px;"/>
      </el-form-item>
      <el-form-item v-if="isAdd" label="资源类型" prop="resType">
        <el-radio v-model="form.resType" label="0" >菜单</el-radio>
        <el-radio v-model="form.resType" label="1" >按钮</el-radio>
      </el-form-item>
      <el-form-item v-else label="资源类型" prop="resType">
        <el-tag>{{ form.resType === '0' ? '菜单' : '按钮' }}</el-tag>
      </el-form-item>
      <el-form-item v-if="form.resType === '1'" label="请求方式" prop="reqMethod">
        <el-select v-model="form.reqMethod" clearable placeholder="请求方式" class="filter-item" style="width: 460px">
          <el-option v-for="item in methodOptions" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.resType === '0'" label="组件路径" prop="component">
        <el-input v-model="form.component" placeholder="组件路径" style="width: 460px;"/>
      </el-form-item>
      <el-form-item v-if="form.resType === '0'" label="请求地址" prop="path">
        <el-input v-model="form.path" placeholder="请求地址" style="width: 460px;"/>
      </el-form-item>
      <el-form-item label="上级类目" prop="parentId">
        <treeselect v-if="form.resType === '1'" v-model="form.parentId" :options="menus" :disable-branch-nodes="true" :show-count="true" :default-expand-level="3" style="width: 460px;" placeholder="选择上级类目" />
        <treeselect v-else v-model="form.parentId" :options="menus" :show-count="true" :default-expand-level="3" style="width: 460px;" placeholder="选择上级类目" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addRes, editRes } from '@/api/sys-menu'
import Treeselect from '@riophae/vue-treeselect'
import IconSelect from '@/components/IconSelect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect, IconSelect },
  props: {
    menus: {
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
    return {
      loading: false, dialog: false,
      methodOptions: ['POST', 'GET', 'DELETE'],
      form: { iconClass: null, name: '', codeStr: '', sortNum: 0, resType: '0', reqMethod: 'GET', component: '', path: '', parentId: null },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        iconClass: [
          { max: 20, message: '图标长度不能超过 20 个字符', trigger: 'blur' }
        ],
        codeStr: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { max: 30, message: '编码长度不能超过 30 个字符', trigger: 'blur' }
        ],
        sortNum: [
          { required: true, type: 'number', message: '请输入序号', trigger: 'blur' }
        ],
        resType: [
          { required: true, message: '请选择资源类型', trigger: 'blur' }
        ],
        reqMethod: [
          { required: true, message: '请选择请求方式', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入组件路径', trigger: 'blur' },
          { max: 120, message: '组件路径长度不能超过 120 个字符', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入请求地址', trigger: 'blur' },
          { max: 120, message: '请求地址长度不能超过 120 个字符', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择上级类目', trigger: 'blur' }
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
          if (this.form.resType === '1') {
            this.form.path = '#'
            this.form.component = '#'
          }
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        } else {
          return false
        }
      })
    },
    doAdd() {
      addRes(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        setTimeout(() => {
          this.sup_this.loadResTable()
          this.sup_this.loadResOptions()
        }, 200)
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      editRes(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        setTimeout(() => {
          this.sup_this.loadResTable()
          this.sup_this.loadResOptions()
        }, 200)
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
    },
    selected(name) {
      this.form.iconClass = name
    }
  }
}
</script>

<style scoped>

</style>
