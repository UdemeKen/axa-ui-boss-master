<template>
  <div class="app-container" style="min-width: 1200px">
    <eHeader :query="query" :page-num="pageNum" :selections="selections"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column :show-overflow-tooltip="true" prop="countryCode" label="国家编码" min-width="100px"/>
      <el-table-column :show-overflow-tooltip="true" prop="countryEnName" label="国家英文名称" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="countryChName" label="国家中文名称" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="currencyCode" label="币种编码" min-width="100px"/>
      <el-table-column :show-overflow-tooltip="true" prop="currencyEnName" label="币种英文名称" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="currencyChName" label="币种中文名称" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="currencyDecimals" label="币种小数点" min-width="85px"/>
      <el-table-column :show-overflow-tooltip="true" prop="currencySymbol" label="币种符号" min-width="70px"/>
      <el-table-column label="状态" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.disabled" style="color: #E6A23C">禁用</span>
          <span v-else style="color: #67C23A">启用</span>
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
import initData from '../../../mixins/initData'
import { isEmpty } from '@/utils/index'
import eHeader from './module/header'
export default {
  components: { eHeader },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    isEmpty,
    beforeInit() {
      this.pageNum = this.page
      this.url = '/sys/country/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const countryCode = query.countryCode
      const disabled = query.disabled
      if (!isEmpty(countryCode)) { this.params['countryCode'] = countryCode }
      if (!isEmpty(disabled)) { this.params['disabled'] = disabled }
      return true
    },
    selectionChangeHandle(val) {
      this.selections = val
    }
  }
}
</script>
