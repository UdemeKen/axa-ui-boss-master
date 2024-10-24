<template>
  <div class="app-container" style="min-width: 1200px">
    <eHeader :query="query" :page-num="pageNum" :pm-options="pmOptions" :selections="selections"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="bankCode" label="银行编码" min-width="100px"/>
      <el-table-column :show-overflow-tooltip="true" prop="bankName" label="银行英文名称" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="bankCnName" label="银行中文名称" min-width="120px"/>
      <el-table-column label="图标" align="center" min-width="100px">
        <template slot-scope="scope">
          <img v-if="!isEmpty(scope.row.iconUrl)" :src="scope.row.iconUrl" style="height: 20px">
          <span v-else style="color: #909399">无图标</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="配置JS" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.jsUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="sortNum" label="序号" min-width="80px"/>
      <el-table-column label="状态" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.disabled" style="color: #E6A23C">禁用</span>
          <span v-else style="color: #67C23A">启用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="120px">
        <template slot-scope="scope">
          <edit :data="scope.row" :page-num="pageNum" :sup_this="sup_this"/>
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
import { isEmpty } from '@/utils/index'
import { mathDiv } from '@/utils/math'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], pmOptions: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    isAuth,
    isEmpty,
    mathDiv,
    beforeInit() {
      this.pageNum = this.page
      this.url = 'payment/bank/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const countryCode = query.countryCode
      const bankCode = query.bankCode
      const disabled = query.disabled
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(bankCode)) { this.params['bankCode'] = bankCode }
      if (!isEmpty(disabled)) { this.params['disabled'] = disabled }
      return true
    },
    // 多选
    selectionChangeHandle(val) {
      this.selections = val
    }
  }
}
</script>

<style scoped>

</style>
