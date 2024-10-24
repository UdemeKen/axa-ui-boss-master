<template>
  <div class="app-container" style="width: 900px">
    <eHeader :query="query" :page-num="pageNum" :pm-options="pmOptions" :mch-options="mchOptions" :ven-options="venOptions" :selections="selections"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatPm" :show-overflow-tooltip="true" prop="methodCode" label="支付方式" min-width="100px"/>
      <el-table-column :show-overflow-tooltip="true" prop="mchName" label="商户" min-width="100px"/>
      <el-table-column :show-overflow-tooltip="true" prop="venName" label="卡商" min-width="100px"/>
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
import { getMchOptions } from '@/api/mch'
import { getVenOptions } from '@/api/ven'
import { getPmOptions } from '@/api/payment'
import { isAuth } from '@/utils/auth'
import initData from '../../../mixins/initData'
import { isEmpty } from '@/utils/index'
import { mathDiv, mathMul } from '@/utils/math'
import eHeader from './module/header'
export default {
  components: { eHeader },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], mchOptions: [], venOptions: [], pmOptions: []
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
      this.url = 'merchant/ven/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const countryCode = query.countryCode
      const methodCode = query.methodCode
      const mchId = query.mchId
      const venId = query.venId
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(methodCode)) { this.params['methodCode'] = methodCode }
      if (!isEmpty(mchId)) { this.params['mchId'] = mchId }
      if (!isEmpty(venId)) { this.params['venId'] = venId }
      return true
    },
    // 多选
    selectionChangeHandle(val) {
      this.selections = val
    },
    loadOptions() {
      getMchOptions().then(res => {
        this.mchOptions = res.data
      })
      getVenOptions().then(res => {
        this.venOptions = res.data
      })
      getPmOptions({ paySwitch: true }).then(res => {
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
