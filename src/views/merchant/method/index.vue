<template>
  <div class="app-container" style="min-width: 1220px">
    <eHeader :query="query" :page-num="pageNum" :pm-options="pmOptions" :mch-options="mchOptions" :pc-options="pcOptions" :selections="selections"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="mchName" label="商户" min-width="100px"/>
      <el-table-column prop="paymentType" label="通道类型" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.paymentType === 0" style="color: #67C23A">支付通道</span>
          <span v-if="scope.row.paymentType === 1" style="color: #E6A23C">代付通道</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="channelName" label="通道" min-width="100px"/>
      <el-table-column :show-overflow-tooltip="true" prop="methodName" label="支付方式" min-width="100px"/>
      <el-table-column label="代收费率/费用" min-width="100">
        <template slot-scope="scope">
          <span>{{ mathMul(scope.row.payRate, 100) }}% ，{{ mathDiv(scope.row.payCost, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户代理费率" min-width="100">
        <template slot-scope="scope">
          <span>{{ mathMul(scope.row.agentRate, 100) }}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="pollWeight" label="轮询权重" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.pollWeight === 3" style="color:#409EFF">高</span>
          <span v-if="scope.row.pollWeight === 2" style="color:rgb(102, 177, 255)">中</span>
          <span v-if="scope.row.pollWeight === 1" style="color:rgb(121, 187, 255)">低</span>
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
          <edit :data="scope.row" :mch-options="mchOptions" :page-num="pageNum" :sup_this="sup_this"/>
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
import { getMchOptions } from '@/api/mch'
import { getPmOptions, getPcOptions } from '@/api/payment'
import { isAuth } from '@/utils/auth'
import initData from '../../../mixins/initData'
import { isEmpty } from '@/utils/index'
import { mathDiv, mathMul } from '@/utils/math'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], mchOptions: [], pmOptions: [], pcOptions: []
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
      this.url = 'merchant/payment/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const countryCode = query.countryCode
      const methodCode = query.methodCode
      const mchId = query.mchId
      const paymentType = query.paymentType
      const channelId = query.channelId
      const disabled = query.disabled
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(methodCode)) { this.params['methodCode'] = methodCode }
      if (!isEmpty(paymentType)) { this.params['paymentType'] = paymentType }
      if (!isEmpty(channelId)) { this.params['channelId'] = channelId }
      if (!isEmpty(mchId)) { this.params['mchId'] = mchId }
      if (!isEmpty(disabled)) { this.params['disabled'] = disabled }
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
      getPcOptions().then(res => {
        this.pcOptions = res.data
      })
      getPmOptions({ paySwitch: true }).then(res => {
        this.pmOptions = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
