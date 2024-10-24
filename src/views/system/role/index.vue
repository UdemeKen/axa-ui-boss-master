<template>
  <div class="app-container">
    <eHeader :res-options="resOptions"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="roles" size="small" border style="width: 100%;">
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="codeStr" label="编码"/>
      <el-table-column prop="sortNum" label="序号"/>
      <el-table-column label="操作" min-width="250px" align="center">
        <template v-if="scope.row.codeStr != 'admin'" slot-scope="scope">
          <edit v-if="isAuth('role:update')" :data="scope.row" :res-options="resOptions" :sup_this="sup_this"/>
          <el-popover
            v-if="isAuth('role:delete')"
            v-model="scope.row.delPopover"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.delPopover = false">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" @click="scope.row.delPopover = true">删除角色</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { removeRole, getRoleList } from '@/api/sys-role'
import { getResOptions } from '@/api/sys-menu'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  data() {
    return {
      loading: false, delLoading: false, sup_this: this, roles: [], resOptions: []
    }
  },
  created() {
    this.loadResOptions()
    this.$nextTick(() => {
      this.loadRoleList()
    })
  },
  methods: {
    isAuth,
    subDelete(index, row) {
      this.delLoading = true
      removeRole(row.id).then(res => {
        this.delLoading = false
        row.delPopover = false
        this.loadRoleList()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        row.delPopover = false
        console.log(err.response.data.message)
      })
    },
    loadResOptions() {
      getResOptions().then(res => {
        this.resOptions = res
      })
    },
    loadRoleList() {
      this.loading = true
      getRoleList().then(res => {
        this.loading = false
        this.roles = res.data
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
