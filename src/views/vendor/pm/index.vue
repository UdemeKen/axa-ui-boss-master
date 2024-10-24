<template>
  <div class="app-container" style="min-width: 980px">
    <eHeader :query="query" :page-num="pageNum" :ven-options="venOptions" :pm-options="pmOptions" :selections="selections"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="venName" label="卡商账户" min-width="90px"/>
      <el-table-column :show-overflow-tooltip="true" prop="methodCode" label="支付方式" min-width="100px"/>
      <el-table-column label="费率" align="center" min-width="100px">
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
import { getVenOptions } from '@/api/ven'
import { getPmOptions } from '@/api/payment'
import { isAuth } from '@/utils/auth'
import initData from '../../../mixins/initData'
import { isEmpty } from '@/utils/index'
import { mathMul } from '@/utils/math'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], venOptions: [], pmOptions: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadOptions()
  },
  methods: {
    isAuth,
    isEmpty,
    mathMul,
    beforeInit() {
      this.pageNum = this.page
      this.url = 'vendor/pm/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const venId = query.venId
      const countryCode = query.countryCode
      const methodCode = query.methodCode
      const disabled = query.disabled
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(venId)) { this.params['venId'] = venId }
      if (!isEmpty(methodCode)) { this.params['methodCode'] = methodCode }
      if (!isEmpty(disabled)) { this.params['disabled'] = disabled }
      return true
    },
    // 多选
    selectionChangeHandle(val) {
      this.selections = val
    },
    loadOptions() {
      getVenOptions().then(res => {
        this.venOptions = res.data
      })
      getPmOptions({ countryCode: null, disabled: false, channelId: null }).then(res => {
        this.pmOptions = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
