<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" title="编辑角色菜单权限" width="500px">
    <el-form ref="form" :model="form" size="small" label-width="66px">
      <el-form-item label="角色">
        {{ form.name }}
      </el-form-item>
      <el-form-item size="mini" label="菜单">
        <el-tree
          ref="resListTree"
          v-model="form.resList"
          :data="resOptions"
          :props="menuListTreeProps"
          :default-expand-all="true"
          node-key="id"
          show-checkbox/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { syncRoleAuth, getRoleResList } from '@/api/sys-role'
import { isEmpty } from '@/utils/index'
export default {
  props: {
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false, dialog: false, resOptions: [],
      form: { id: null, name: null, resList: [] },
      menuListTreeProps: {
        label: 'label',
        children: 'children'
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      const tree = this.$refs.resListTree
      this.loading = true
      this.form.resList = this.buildResList(tree.getHalfCheckedKeys(), tree.getCheckedNodes())
      syncRoleAuth({ roleId: this.form.id, list: this.form.resList }).then(res => {
        this.resetForm()
        this.$notify({
          title: '菜单权限已同步',
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
      this.$refs['form'].resetFields()
      this.$refs.resListTree.setCheckedKeys([])
      this.form = { id: null, name: null, resList: [] }
    },
    setChecked(id, name) {
      this.form = { id: id, name: name }
      getRoleResList(id).then(res => {
        const checkedIds = []
        res.data.forEach(item => {
          if (!this.$refs.resListTree.getNode(item.id).childNodes || !this.$refs.resListTree.getNode(item.id).childNodes.length) {
            checkedIds.push(item.id)
          }
        })
        this.$refs.resListTree.setCheckedKeys(checkedIds)
      })
    },
    buildResList(halfKeys, checkedNodes) {
      if (isEmpty(halfKeys) && isEmpty(checkedNodes)) {
        return []
      }
      const checked = []
      halfKeys.forEach(function(id, index) {
        checked.push({ resId: id, resType: 0 })
      })
      checkedNodes.forEach(function(data, index) {
        checked.push({ resId: data.id, resType: data.type })
      })
      return checked
    }
  }
}
</script>

<style scoped>

</style>
