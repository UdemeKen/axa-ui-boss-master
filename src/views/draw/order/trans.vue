<template>
  <div class="app-container" style="min-width: 1200px">
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
          <el-select v-model="query.payerBankCode" clearable filterable placeholder="中转银行" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in bankOptions" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
          <el-input v-model="query.transNo" clearable placeholder="中转单号" style="width: 185px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-select v-model="query.payerVenId" filterable clearable placeholder="中转卡商" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id"/>
          </el-select>
          <el-input v-model="query.payerKey" clearable placeholder="中转账户" style="width: 185px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-select v-model="query.payeeVenId" filterable clearable placeholder="收款卡商" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id"/>
          </el-select>
          <el-input v-model="query.payeeKey" clearable placeholder="收款账户" style="width: 185px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-date-picker v-model="query.createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="filter-item" style="width: 330px;" @change="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </blockquote>
        <!--        <blockquote class="my-blockquote statistics">
          <div>
            <span class="text">订单总数：</span><el-tag>{{ statistics.totalCount }}</el-tag>
            <span class="text">成功单数：</span><el-tag type="success">{{ statistics.successCount }}</el-tag>
            <span class="text">提现总额：</span><el-tag>{{ mathDiv(statistics.totalAmount,100) }}</el-tag>
            <span class="text">成功到账总额：</span><el-tag type="success">{{ mathDiv(statistics.successAmount,100) }}</el-tag>
            <span v-if="statistics.totalIncome > 0" class="text">平台手续费：</span><el-tag v-if="statistics.totalIncome > 0" type="warning">{{ mathDiv(statistics.totalIncome,100) }}</el-tag>
            <span class="text" style="color: rgb(252, 85, 49)">通道代付流程：1、审核通过后上报代付通道受理 2、代付通道收到代付单进行下发处理 3、通道完成下发通知平台结束</span>
          </div>
        </blockquote>-->
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" :header-cell-style="{background:'#f5f7fa',color:'#606266'}" size="small" border style="width: 100%;">
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中转单号" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.transNo }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderAmount" label="中转金额" min-width="75px">
        <template slot-scope="scope">
          <span>
            {{ formatNum(mathDiv(scope.row.orderAmount, 100)) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="中转银行" min-width="100px">
        <template slot-scope="scope">
          <span>{{ formatBankName(scope.row.payerBankCode) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="中转卡商" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.payeeVenName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中转账户" min-width="175px">
        <template slot-scope="scope">
          <el-popover placement="top-start" trigger="hover">
            <div style="font-size: 12px;line-height: 20px">
              <span>开户银行：{{ formatBankName(scope.row.payerBankCode) }}</span>
              <span><br>银行户名：{{ scope.row.payerOwner }}</span>
              <span><br>银行账号：{{ scope.row.payerKey }}</span>
              <span><br>代付信息：{{ scope.row.payerJson }}</span>
              <span v-if="!isEmpty(scope.row.payerIdentityType)"><br>身份标识：{{ scope.row.payerIdentityType }}<br>{{ scope.row.payerIdentity }}</span>
            </div>
            <span slot="reference">
              <span style="width:160px;overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;">{{ scope.row.payerKey }}</span>
            </span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="收款银行" min-width="100px">
        <template slot-scope="scope">
          <span>{{ formatBankName(scope.row.payeeBankCode) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="收款卡商" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.payerVenName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款账户" min-width="175px">
        <template slot-scope="scope">
          <el-popover placement="top-start" trigger="hover">
            <div style="font-size: 12px;line-height: 20px">
              <span>开户银行：{{ formatBankName(scope.row.payeeBankCode) }}</span>
              <span><br>银行户名：{{ scope.row.payeeOwner }}</span>
              <span><br>银行账号：{{ scope.row.payeeKey }}</span>
              <span><br>代付信息：{{ scope.row.payeeJson }}</span>
              <span v-if="!isEmpty(scope.row.payeeIdentityType)"><br>身份标识：{{ scope.row.payeeIdentityType }}<br>{{ scope.row.payeeIdentity }}</span>
            </div>
            <span slot="reference">
              <span style="width:160px;overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;">{{ scope.row.payeeKey }}</span>
            </span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="设备转账时间" min-width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.successTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="133px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination :total="total" :page-sizes="pageSizes" style="margin-top: 8px;" layout="total, prev, pager, next, sizes" @size-change="sizeChange" @current-change="pageChange"/>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import initData from '../../../mixins/initData'
import { isEmpty } from '@/utils/index'
import { mathMul, mathDiv, formatNum } from '@/utils/math'
import { getBankOptions } from '@/api/payment'
import { getVenOptions } from '@/api/ven'
import countryOptions from '@/utils/country'
export default {
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, countryOptions: countryOptions, bankOptions: [], venOptions: [], statistics: { totalCount: 0, totalAmount: 0, successCount: 0, successAmount: 0, totalIncome: 0, moneySucRate: 0, numSucRate: 0, failCount: 0, failAmount: 0 }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.getSum()
    this.loadOptions()
  },
  methods: {
    isEmpty,
    isAuth,
    mathMul,
    mathDiv,
    formatNum,
    beforeInit() {
      this.pageNum = this.page
      this.url = '/order/trade/trans'
      const query = this.query
      this.params = { pageIndex: this.page, pageSize: this.size }
      const transNo = query.transNo
      const payeeVenId = query.payeeVenId
      const payeeId = query.payeeId
      const payerId = query.payerId
      const payeeKey = query.payeeKey
      const payerVenId = query.payerVenId
      const payerBankCode = query.payerBankCode
      const payerKey = query.payerKey
      const countryCode = query.countryCode
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      const createTime = query.createTime
      if (!isEmpty(createTime) && !isEmpty(createTime[0])) {
        this.params['startTime'] = createTime[0]
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[1])) {
        this.params['endTime'] = createTime[1]
      }
      if (!isEmpty(transNo)) { this.params['transNo'] = transNo }
      if (!isEmpty(payeeVenId)) { this.params['payeeVenId'] = payeeVenId }
      if (!isEmpty(payeeId)) { this.params['payeeId'] = payeeId }
      if (!isEmpty(payeeKey)) { this.params['payeeKey'] = payeeKey }
      if (!isEmpty(payerVenId)) { this.params['payerVenId'] = payerVenId }
      if (!isEmpty(payerBankCode)) { this.params['payerBankCode'] = payerBankCode }
      if (!isEmpty(payerKey)) { this.params['payerKey'] = payerKey }
      if (!isEmpty(payerId)) { this.params['payerId'] = payerId }
      return true
    },
    loadOptions() {
      getVenOptions().then(res => {
        this.venOptions = res.data
      })
      getBankOptions(this.query.countryCode).then(res => {
        this.bankOptions = res.data
      })
    },
    toQuery() {
      this.page = 0
      this.init()
      this.getSum()
    },
    getSum() {
    },
    formatPmName(methodCode) {
      if (methodCode === 'USD001') {
        return 'USDT转账'
      }
      for (let i = 0; i < this.pmOptions.length; i++) {
        if (this.pmOptions[i].code === methodCode) {
          return this.pmOptions[i].name
        }
      }
      return methodCode
    },
    formatBankName(bankCode) {
      if (isEmpty(bankCode)) {
        return ''
      }
      if (bankCode === 'USD001') {
        return 'USDT'
      }
      if (bankCode === '000000') {
        return ''
      }
      for (let i = 0; i < this.bankOptions.length; i++) {
        if (this.bankOptions[i].code === bankCode) {
          return this.bankOptions[i].name
        }
      }
      return bankCode
    }
  }
}
</script>
<style>
.el-popover--plain{
  word-break: break-all;word-wrap: break-word;
}
</style>
