<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <el-select v-model="query.countryCode" filterable clearable placeholder="请选择国家" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option
              v-for="item in countryOptions"
              :key="item.code"
              :label="item.code +'-'+ item.name"
              :value="item.code"/>
          </el-select>
          <el-select v-model="query.methodCode" clearable filterable placeholder="支付方式" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in pmOptions" :key="item.code" :label="item.name +' - '+ item.code" :value="item.code"/>
          </el-select>
          <el-select v-model="query.channelId" clearable filterable placeholder="选择通道" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in pcOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-select v-model="query.mchId" clearable filterable placeholder="选择商户" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in mchOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-select v-model="query.venId" clearable filterable placeholder="选择卡商" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id"/>
          </el-select>
          <el-date-picker v-model="query.createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="filter-item" style="width: 340px;" @change="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </blockquote>
      </div>
    </template><!--表格渲染-->
    <el-table v-loading="loading" :data="data" :span-method="spanMethod" size="small" border style="width: 100%;">
      <el-table-column label="国家" prop="countryCode" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatPm" :show-overflow-tooltip="true" prop="methodCode" label="支付方式" min-width="100px"/>
      <el-table-column :show-overflow-tooltip="true" prop="channelId" label="通道" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总单数/金额" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.totalCount }} / {{ formatNum(mathDiv(scope.row.totalAmount, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成功单数/金额" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.successCount }} / {{ formatNum(mathDiv(scope.row.successAmount, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失败单数/金额" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.failCount }} / {{ formatNum(mathDiv(scope.row.failAmount, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户结算" min-width="80px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.mchAmount, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通道收益" min-width="80px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.channelIncome, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡商收益" min-width="80px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.venIncome, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户代理" min-width="80px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.matAmount, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通道代理" min-width="80px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.catIncome, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡商上级" min-width="80px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.vatIncome, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台收益" min-width="80px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.sysIncome, 100)) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { getCurrentDate } from '@/utils/index'
import { getRowspanMethod } from '@/utils/use-span-method.js'
import { getCountryOptions } from '@/api/sys-country'
import { getOrderAllStats } from '@/api/order-pay'
import { getMchOptions } from '@/api/mch'
import { getVenOptions } from '@/api/ven'
import { getPmOptions, getPcOptions } from '@/api/payment'
import { parseTime, isEmpty } from '@/utils/index'
import { mathMul, mathDiv, formatNum } from '@/utils/math'
export default {
  data() {
    return {
      sup_this: this, loading: false, countryOptions: [], query: { createTime: [getCurrentDate() + ' 00:00:00', getCurrentDate() + ' 23:59:59'] },
      pmOptions: [], pcOptions: [], mchOptions: [], venOptions: [], data: []
    }
  },
  created() {
    this.toQuery()
    this.loadOptions()
  },
  methods: {
    parseTime,
    isAuth,
    mathMul,
    mathDiv,
    formatNum,
    spanMethod: () => {},
    toQuery() {
      this.loading = true
      const query = this.query
      this.params = {}
      const methodCode = query.methodCode
      const countryCode = query.countryCode
      const channelId = query.channelId
      const mchId = query.mchId
      const venId = query.venId
      const createTime = query.createTime
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[0])) {
        this.params['startTime'] = createTime[0]
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[1])) {
        this.params['endTime'] = createTime[1]
      }
      if (!isEmpty(methodCode)) { this.params['methodCode'] = methodCode }
      if (!isEmpty(channelId)) { this.params['channelId'] = channelId }
      if (!isEmpty(mchId)) { this.params['mchId'] = mchId }
      if (!isEmpty(venId)) { this.params['venId'] = venId }
      getOrderAllStats(this.params).then(res => {
        this.data = res.data
        this.spanMethod = getRowspanMethod(this.data, ['countryCode', 'channelId', 'methodCode'])
      })
      this.loading = false
    },
    loadOptions() {
      getCountryOptions(false).then(res => {
        this.countryOptions = res.data
      })
      getMchOptions().then(res => {
        this.mchOptions = res.data
      })
      getVenOptions().then(res => {
        this.venOptions = res.data
      })
      getPcOptions({ countryCode: this.query.countryCode, paymentType: 0 }).then(res => {
        this.pcOptions = res.data
      })
      getPmOptions({ countryCode: this.query.countryCode, paySwitch: true }).then(res => {
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
