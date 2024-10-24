<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <!-- 搜索 -->
        <el-select v-model="query.venId" clearable filterable placeholder="选择卡商" class="filter-item" style="width: 140px" @change="toQuery">
          <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id"/>
        </el-select>
        <el-select v-model="query.parentId" clearable filterable placeholder="选择卡商上级" class="filter-item" style="width: 140px" @change="toQuery">
          <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id"/>
        </el-select>
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 800px">
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="venName" label="卡商" min-width="90px"/>
      <el-table-column :show-overflow-tooltip="true" prop="levelNum" label="层级" min-width="90px"/>
      <el-table-column :show-overflow-tooltip="true" prop="parentName" label="卡商上级" min-width="90px"/>
      <el-table-column label="操作" min-width="90px" align="center" fixed="right">
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
              v-if="isAuth('ven:relation:delete')"
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
import { getVenOptions, removeRelation } from '@/api/ven'
import { parseTime, isEmpty } from '@/utils/index'

export default {
  mixins: [initData],
  data() {
    return {
      venOptions: [], delLoading: false, sup_this: this, selections: []
    }
  },
  created() {
    this.loadOptions()
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    isAuth,
    toQuery() {
      this.page = 0
      this.init()
    },
    beforeInit() {
      this.pageNum = this.page
      this.url = 'vendor/relation/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const venId = query.venId
      const countryCode = query.countryCode
      const parentId = query.parentId
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(venId)) { this.params['venId'] = venId }
      if (!isEmpty(parentId)) { this.params['parentId'] = parentId }
      return true
    },
    subDelete(index, row) {
      this.delLoading = true
      removeRelation({ id: row.id }).then(res => {
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
    loadOptions() {
      getVenOptions().then(res => {
        this.venOptions = res.data
      })
    }
  }
}
</script>
