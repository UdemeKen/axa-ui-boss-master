<template>
  <div class="app-container" style="width: 800px">
    <template>
      <div class="head-container">
        <!-- 搜索 -->
        <el-select v-model="query.venId" clearable filterable placeholder="选择卡商" class="filter-item" style="width: 140px" @change="toQuery">
          <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id"/>
        </el-select>
        <el-input v-model="query.inviteCode" clearable placeholder="邀请码" style="width: 140px;" class="filter-item" @keyup.enter.native="toQuery"/>
        <el-select v-model="query.disabled" clearable placeholder="状态" class="filter-item" style="width: 80px" @change="toQuery">
          <el-option label="启用" value="false"/>
          <el-option label="禁用" value="true"/>
        </el-select>
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        <div style="display: inline-block;margin: 0px 2px; float:right">
          <el-button v-if="isAuth('ven:invite:disabled')" :disabled="selections.length <= 0" class="filter-item" size="mini" type="warning" icon="el-icon-view" @click="disabledHandle(true)">批量禁用</el-button>
          <el-button v-if="isAuth('ven:invite:disabled')" :disabled="selections.length <= 0" class="filter-item" size="mini" type="success" icon="el-icon-view" @click="disabledHandle(false)">批量启用</el-button>
        </div>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 800px" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column :show-overflow-tooltip="true" prop="venName" label="卡商" min-width="90px"/>
      <el-table-column :show-overflow-tooltip="true" prop="inviteCode" label="邀请码" min-width="90px"/>
      <el-table-column label="费率" align="center" min-width="90px">
        <template slot-scope="scope">
          <span>{{ mathMul(scope.row.payRate, 100) }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.disabled" style="color: #E6A23C">禁用</span>
          <span v-else style="color: #67C23A">启用</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" min-width="133px" />
      <el-table-column label="操作" min-width="70px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-popover
            v-model="scope.row.delPopover"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.delPopover = false">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.$index, scope.row)">
                确定
              </el-button>
            </div>
            <el-button
              v-if="isAuth('ven:invite:delete')"
              slot="reference"
              type="danger"
              size="mini"
              @click="scope.row.delPopover = true">删除
            </el-button>
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
import { mathMul } from '@/utils/math'
import { getVenOptions, removeInvite, disVenInvite } from '@/api/ven'
import { isEmpty } from '@/utils/index'

export default {
  mixins: [initData],
  data() {
    return {
      venOptions: [], delLoading: false, sup_this: this, pageNum: 1, selections: []
    }
  },
  created() {
    this.loadOptions()
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    isAuth,
    mathMul,
    toQuery() {
      this.page = 0
      this.init()
    },
    beforeInit() {
      this.pageNum = this.page
      this.url = 'vendor/invite/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const venId = query.venId
      const inviteCode = query.inviteCode
      const disabled = query.disabled
      if (!isEmpty(venId)) { this.params['venId'] = venId }
      if (!isEmpty(inviteCode)) { this.params['inviteCode'] = inviteCode }
      if (!isEmpty(disabled)) { this.params['disabled'] = disabled }
      return true
    },
    subDelete(index, row) {
      this.delLoading = true
      removeInvite({ id: row.id }).then(res => {
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
    disabledHandle(dis) {
      const title = dis ? '禁用' : '启用'
      const ids = this.selections.map(item => { return item.id })
      this.$confirm(`确定对【 ${ids.join('，')} 】进行【 ${title} 】操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { 'idList': ids, 'disabled': dis }
        disVenInvite(data).then(res => {
          this.$notify({
            title: title + '成功',
            type: 'success',
            duration: 2500
          })
          this.page = this.pageNum
          this.init()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {})
    },
    selectionChangeHandle(val) {
      this.selections = val
    },
    loadOptions() {
      getVenOptions().then(res => {
        this.venOptions = res.data
      })
    }
  }
}
</script>
