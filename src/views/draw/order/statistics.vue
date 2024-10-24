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
          <el-select v-model="query.targetType" clearable placeholder="提现来源" class="filter-item" style="width: 120px" @change="toChange">
            <el-option label="商户" value="1"/>
            <el-option label="卡商" value="5"/>
            <el-option label="商户代理" value="2"/>
            <el-option label="通道代理" value="4"/>
          </el-select>
          <el-select v-model="query.targetId" clearable filterable placeholder="选择提现人" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in targetOptions" :key="item.id" :label="item.name" :value="item.id"/>
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
      <el-table-column :formatter="formatPm" :show-overflow-tooltip="true" prop="methodCode" label="提现方式" min-width="100px"/>
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
      <el-table-column label="法币" min-width="80px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.mchAmount, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="USDT" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.usd }}</span>
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
import { getDrawAllStats } from '@/api/order-draw'
import { getPmOptions, getPcOptions } from '@/api/payment'
import { getMchOptions } from '@/api/mch'
import { getVenOptions } from '@/api/ven'
import { getAgentOptions } from '@/api/agent'
import { parseTime, isEmpty } from '@/utils/index'
import { mathMul, mathDiv, formatNum } from '@/utils/math'
export default {
  data() {
    return {
      sup_this: this, loading: false, countryOptions: [], query: { createTime: [getCurrentDate() + ' 00:00:00', getCurrentDate() + ' 23:59:59'] },
      pcOptions: [], pmOptions: [], mchOptions: [], venOptions: [], matOptions: [], catOptions: [], targetOptions: [], data: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.toQuery()
    })
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
      const targetId = query.targetId
      const targetType = query.targetType
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
      if (!isEmpty(targetType)) { this.params['targetType'] = targetType }
      if (!isEmpty(targetId)) { this.params['targetId'] = targetId }
      if (!isEmpty(venId)) { this.params['venId'] = venId }
      getDrawAllStats(this.params).then(res => {
        this.data = res.data
        this.spanMethod = getRowspanMethod(this.data, ['countryCode', 'channelId', 'methodCode'])
      })
      this.loading = false
    },
    loadOptions() {
      getCountryOptions(false).then(res => {
        this.countryOptions = res.data
      })
      getPmOptions({ countryCode: this.query.countryCode, drawSwitch: true }).then(res => {
        this.pmOptions = res.data
      })
      getPcOptions({ countryCode: this.query.countryCode, paymentType: 1 }).then(res => {
        this.pcOptions = res.data
      })
      getMchOptions().then(res => {
        this.mchOptions = res.data
      })
      getVenOptions().then(res => {
        this.venOptions = res.data
      })
      getAgentOptions(null, 4).then(res => {
        this.catOptions = res.data
      })
      getAgentOptions(null, 2).then(res => {
        this.matOptions = res.data
      })
    },
    toChange() {
      const targetType = this.query.targetType
      this.targetOptions = []
      if (targetType === '1') {
        this.targetOptions = this.mchOptions
      }
      if (targetType === '5') {
        this.targetOptions = this.venOptions
      }
      if (targetType === '2') {
        this.targetOptions = this.matOptions
      }
      if (targetType === '4') {
        this.targetOptions = this.catOptions
      }
      this.query.targetId = null
      this.toQuery()
    },
    formatPm(row, column) {
      const methodCode = row['methodCode']
      if (methodCode === 'USD001') {
        return 'USDT转账'
      }
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
