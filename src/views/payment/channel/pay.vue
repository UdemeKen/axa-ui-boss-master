<template>
  <div class="app-container" style="min-width: 1200px">
    <eHeader :query="query" :page-num="pageNum" :pc-options="pcOptions" :pm-options="pmOptions" :selections="selections"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="channelName" label="通道名称" min-width="120px"/>
      <el-table-column :formatter="formatPm" :show-overflow-tooltip="true" prop="methodCode" label="支付方式" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="upMethodCode" label="上游支付编码" min-width="100px"/>
      <el-table-column min-width="80px" label="代收费率/手续费">
        <template slot-scope="scope">
          <span>{{ mathMul(scope.row.payRate, 100) }}% ，{{ mathDiv(scope.row.payCost, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" label="代理费率%">
        <template slot-scope="scope">
          <span>{{ mathMul(scope.row.agentPayRate, 100) }}%</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" min-width="120px" label="支付金额区间(元)">
        <template slot-scope="scope">
          <span>{{ mathDiv(scope.row.payMinAmount, 100) }} - {{ mathDiv(scope.row.payMaxAmount, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="excludeAmount" min-width="120px" label="排除金额(元)"/>
      <el-table-column :show-overflow-tooltip="true" prop="fixedAmount" min-width="120px" label="固定金额(元)"/>
      <el-table-column label="状态" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.disabled" style="color: #E6A23C">禁用</span>
          <span v-else style="color: #67C23A">启用</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" width="133px" />
      <el-table-column label="操作" align="center" fixed="right" width="110px">
        <template slot-scope="scope">
          <edit :data="scope.row" :page-num="pageNum" :pc-options="pcOptions" :pm-options="pmOptions" :sup_this="sup_this"/>
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
import { getPcOptions, getPmOptions } from '@/api/payment'
import { isAuth } from '@/utils/auth'
import initData from '../../../mixins/initData'
import { isEmpty } from '@/utils/index'
import { mathDiv, mathMul } from '@/utils/math'
import eHeader from './method/header'
import edit from './method/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], pcOptions: [], pmOptions: []
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
    mathDiv,
    mathMul,
    beforeInit() {
      this.pageNum = this.page
      this.url = '/payment/channel/method'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const channelId = query.channelId
      const countryCode = query.countryCode
      const methodCode = query.methodCode
      const disabled = query.disabled
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(channelId)) { this.params['channelId'] = channelId }
      if (!isEmpty(methodCode)) { this.params['methodCode'] = methodCode }
      if (!isEmpty(disabled)) { this.params['disabled'] = disabled }
      return true
    },
    // 多选
    selectionChangeHandle(val) {
      this.selections = val
    },
    loadOptions() {
      getPcOptions().then(res => {
        this.pcOptions = res.data
      })
      getPmOptions().then(res => {
        this.pmOptions = res.data
      })
    },
    formatPm(row, column) {
      const methodCode = row['methodCode']
      for (let i = 0; i < this.pmOptions.length; i++) {
        if (this.pmOptions[i].code === methodCode) {
          return this.pmOptions[i].name
        }
      }
      return methodCode
    }
  }
}
</script>

<style scoped>

</style>
