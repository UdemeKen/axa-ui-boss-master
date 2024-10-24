<template>
  <div class="app-container" style="min-width: 1100px">
    <eHeader :role-options="roleOptions" :query="query" :page-num="pageNum" :selections="selections"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50"/>
      <el-table-column prop="name" label="用户名" min-width="120px"/>
      <el-table-column prop="loginAccount" label="登录账号" min-width="120px"/>
      <el-table-column prop="phone" label="手机" min-width="120px"/>
      <el-table-column prop="email" label="邮箱" min-width="120px"/>
      <el-table-column prop="roleName" label="角色" min-width="100px"/>
      <el-table-column label="状态" min-width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.disabled" style="color:#E6A23C;">禁用</span>
          <span v-else style="color: #67C23A">启用</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginIp" label="上次登录IP" min-width="120px"/>
      <el-table-column prop="lastLoginTime" label="上次登录日期" width="135px"/>
      <el-table-column prop="createTime" label="注册日期" width="135px"/>
      <el-table-column label="操作" width="300px" align="center" fixed="right">
        <template slot-scope="scope">
          <edit v-if="isAuth('user:update')" :data="scope.row" :role-options="roleOptions" :sup_this="sup_this"/>
          <el-button v-if="isAuth('user:unlock:account')" type="success" size="mini" @click="unlockAccount(scope.row.id)">解锁</el-button>
          <el-button v-if="isAuth('user:offline')" type="info" size="mini" @click="offlineAccount(scope.row.id)">下线</el-button>
          <el-popover
            v-if="isAuth('user:delete')"
            v-model="scope.row.delPopover"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.delPopover = false">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button v-if="isAuth('user:delete')" slot="reference" type="danger" size="mini" @click="scope.row.delPopover = true">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :page-sizes="pageSizes"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import initData from '../../../mixins/initData'
import { removeUser, unlock, offline } from '@/api/sys-user'
import { getRoleList } from '@/api/sys-role'
import { parseTime, isEmpty } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      roleOptions: [], delLoading: false, sup_this: this, pageNum: 1, selections: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadRoleOptions()
  },
  methods: {
    parseTime,
    isAuth,
    beforeInit() {
      this.pageNum = this.page
      this.url = 'user/page'
      const query = this.query
      const name = query.name
      const disabled = query.disabled
      const roleId = query.roleId
      this.params = { pageIndex: this.page, pageSize: this.size }
      if (!isEmpty(name)) { this.params['name'] = name }
      if (!isEmpty(roleId)) { this.params['roleId'] = roleId }
      if (!isEmpty(disabled)) { this.params['disabled'] = disabled }
      return true
    },
    subDelete(index, row) {
      this.delLoading = true
      removeUser(row.id).then(res => {
        this.delLoading = false
        row.delPopover = false
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        row.delPopover = false
        console.log(err)
      })
    },
    loadRoleOptions() {
      getRoleList().then(res => {
        this.roleOptions = res.data
      })
    },
    // 多选
    selectionChangeHandle(val) {
      this.selections = val
    },
    unlockAccount(id) {
      unlock(id).then(res => {
        this.$notify({
          title: '已解锁',
          type: 'success',
          duration: 2500
        })
      })
    },
    offlineAccount(id) {
      offline(id).then(res => {
        this.$notify({
          title: '已远程下线',
          type: 'success',
          duration: 2500
        })
      })
    }
  }
}
</script>
