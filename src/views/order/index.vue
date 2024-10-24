<template>
  <div class="app-container">
    <eHeader :statistics="statistics" :pm-options="pmOptions" :pc-options="pcOptions" :mch-options="mchOptions" :ven-options="venOptions" :bank-options="bankOptions" :page-num="pageNum" :query="query" :sup_this="sup_this"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" :row-class-name="tableRowClassName" size="small" border style="width: 100%;">
      <el-table-column label="国家/单号" min-width="155px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span><br>
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="methodCode" label="支付方式" min-width="115px">
        <template slot-scope="scope">
          <span>{{ scope.row.currencyCode }}</span><br>
          <span>{{ formatPmName(scope.row.methodCode) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="outTradeNo" label="商户单号&状态" min-width="160px">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus == 0" style="color: #F56C6C">未支付</span>
          <span v-if="scope.row.orderStatus == 1" style="color: #67C23A">支付成功</span>
          <span v-if="scope.row.orderStatus == 2">已关闭</span>
          <span v-if="scope.row.orderStatus == 9" style="color: #E6A23C">待审核</span><br>
          <span>{{ scope.row.outTradeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderAmount" label="金额&费用(元)" min-width="120px">
        <template slot-scope="scope">
          <span v-if="scope.row.actualAmount>0 && scope.row.actualAmount!=scope.row.orderAmount">
            <s>{{ formatNum(mathDiv(scope.row.orderAmount, 100)) }}</s>&ensp;<span style="color: red">{{ formatNum(mathDiv(scope.row.actualAmount, 100)) }}</span>
          </span>
          <span v-else>
            {{ formatNum(mathDiv(scope.row.orderAmount, 100)) }}
          </span><br>
          <span>{{ formatNum(mathMul(scope.row.mchRate, 100)) }}%&ensp;</span>
          <span v-if="scope.row.actualAmount>0">{{ formatNum(mathDiv(mathMul(scope.row.actualAmount, scope.row.mchRate), 100)) }}</span>
          <span v-else>{{ formatNum(mathDiv(mathMul(scope.row.orderAmount, scope.row.mchRate), 100)) }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="订单类型" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.orderType == 0" style="color: #67C23A">正常</span>
          <span v-if="scope.row.orderType == 1" style="color: #F56C6C">异议</span>
          <span v-if="scope.row.orderType == 2" style="color: #E6A23C">补单</span>
        </template>
      </el-table-column>-->
      <el-table-column :show-overflow-tooltip="true" prop="mchName" label="商户&回调" min-width="100px">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">{{ scope.row.mchNotifyTime }}<br>{{ scope.row.mchNotifyUrl }}</div>
            <span v-if="scope.row.mchNotified" style="color: #67C23A">已回调</span>
            <span v-else style="color:red;">未回调</span>
          </el-tooltip><br>
          <span>{{ scope.row.mchName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户结算" min-width="85px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.mchSettled" placement="top">
            <div slot="content">
              {{ scope.row.mchSettledTime }}
            </div>
            <span style="color: #67C23A">已结算</span>
          </el-tooltip>
          <span v-else style="color:red;">未结算</span><br>
          <span>{{ formatNum(mathDiv(scope.row.mchIncome, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="channelName" label="通道&回调" min-width="100px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.channelNotified" placement="top">
            <div slot="content">{{ scope.row.channelNotifyTime }}</div>
            <span style="color: #67C23A">已回调</span>
          </el-tooltip>
          <span v-else style="color:red;">未回调</span><br>
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通道结算" min-width="110px">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">
              结算时间：{{ scope.row.channelSettledTime }}<br>
              通道单号：{{ scope.row.channelOrderNo }}
            </div>
            <span v-if="scope.row.channelSettled" style="color: #67C23A">已结算</span>
            <span v-else style="color:red;">未结算</span>
          </el-tooltip>
          <br><span>{{ formatNum(mathMul(scope.row.channelRate, 100)) }}%&ensp;{{ formatNum(mathDiv(scope.row.channelIncome, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="卡商&分润" min-width="80px">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.venId>0" placement="top-start" trigger="hover">
            <div style="font-size: 12px;line-height: 20px">
              <span>银行名称：{{ formatBankName(scope.row.venBankCode) }}</span>
              <span><br>银行户名：{{ scope.row.venPayeeOwner }}</span>
              <span><br>银行账号：{{ scope.row.venPayeeKey }}</span>
              <span><br>附加信息：{{ scope.row.venPayeeJson }}</span>
              <span v-if="!isEmpty(scope.row.venIdentityType)"><br>身份标识：{{ scope.row.venIdentityType }}<br>{{ scope.row.venIdentity }}</span>
            </div>
            <span slot="reference">
              <span v-if="scope.row.venSettleMethod == 0" style="color: #409EFF">流水分润</span>
              <span v-if="scope.row.venSettleMethod == 1" style="color: #E6A23C">固定工资</span><br>
              <span>{{ scope.row.venName }}</span>
            </span>
          </el-popover>
          <span v-else style="color: #979A9A">无</span>
        </template>
      </el-table-column>
      <el-table-column label="卡商结算" min-width="110px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.venSettled" placement="top">
            <div slot="content">
              {{ scope.row.venSettledTime }}
            </div>
            <span style="color: #67C23A">已结算</span>
          </el-tooltip>
          <span v-else style="color:red;">未结算</span><br>
          <span>{{ formatNum(mathMul(scope.row.venRate, 100)) }}%&ensp;{{ formatNum(mathDiv(scope.row.venIncome, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡商奖金" min-width="85px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.vatSettled" placement="top">
            <div slot="content">
              {{ scope.row.vatSettledTime }}
            </div>
            <span style="color: #67C23A">已结算</span>
          </el-tooltip>
          <span v-else style="color:red;">未结算</span><br>
          <span>{{ formatNum(mathDiv(scope.row.vatTotalIncome, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台结算" min-width="90px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.sysSettled" placement="top">
            <div slot="content">
              {{ scope.row.sysSettledTime }}
            </div>
            <span style="color: #67C23A">已结算</span>
          </el-tooltip>
          <span v-else style="color:red;">未结算</span><br>
          <span>{{ formatNum(mathDiv(scope.row.sysIncome, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代理结算" width="110px">
        <template slot-scope="scope">
          <span>商户代理</span>
          <el-tooltip v-if="scope.row.matSettled" placement="top">
            <div slot="content">
              {{ formatNum(mathDiv(scope.row.matIncome, 100)) }} 元<br>
              {{ scope.row.matSettledTime }}
            </div>
            <span style="color: #67C23A">已结算</span>
          </el-tooltip>
          <span v-else style="color:red;">未结算</span><br>
          <span>通道代理</span>
          <el-tooltip v-if="scope.row.catSettled" placement="top">
            <div slot="content">
              {{ formatNum(mathDiv(scope.row.catIncome, 100)) }} 元<br>
              {{ scope.row.catSettledTime }}
            </div>
            <span style="color: #67C23A">已结算</span>
          </el-tooltip>
          <span v-else style="color:red;">未结算</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建&完成 日期" min-width="133px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span><br>
          <span>{{ scope.row.successTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="110px" fixed="right">
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
import initData from '../../mixins/initData'
import { getOrderStats } from '@/api/order-pay'
import { getMchOptions } from '@/api/mch'
import { getVenOptions } from '@/api/ven'
import { getPmOptions, getPcOptions, getBankOptions } from '@/api/payment'
import { parseTime, isEmpty } from '@/utils/index'
import { mathMul, mathDiv, mathSub, formatNum } from '@/utils/math'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, statistics: { totalCount: 0, totalAmount: 0, successCount: 0, successAmount: 0, totalIncome: 0, moneySucRate: 0, numSucRate: 0, failCount: 0, failAmount: 0 },
      mchOptions: [], venOptions: [], bankOptions: [], pmOptions: [], pcOptions: []
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
    parseTime,
    isAuth,
    mathMul,
    mathDiv,
    mathSub,
    formatNum,
    isEmpty,
    beforeInit() {
      this.pageNum = this.page
      this.url = 'order/trade/page'
      const query = this.query
      const orderNo = query.orderNo
      const outTradeNo = query.outTradeNo
      const channelId = query.channelId
      const mchId = query.mchId
      const venId = query.venId
      const orderType = query.orderType
      const maxAmount = query.maxAmount
      const minAmount = query.minAmount
      const mchNotified = query.mchNotified
      const methodCode = query.methodCode
      const confirmType = query.confirmType
      const orderStatus = query.orderStatus
      const mchSettled = query.mchSettled
      const venSettled = query.venSettled
      const matSettled = query.matSettled
      const sysSettled = query.sysSettled
      const catSettled = query.catSettled
      const venBankCode = query.venBankCode
      const channelSettled = query.channelSettled
      const channelNotified = query.channelNotified
      const createTime = query.createTime
      const countryCode = query.countryCode
      const countryCodeList = []
      this.params = { pageIndex: this.page, pageSize: this.size }
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(orderNo)) { this.params['orderNo'] = orderNo }
      if (!isEmpty(outTradeNo)) { this.params['outTradeNo'] = outTradeNo }
      if (!isEmpty(channelId)) { this.params['channelId'] = channelId }
      if (!isEmpty(mchId)) { this.params['mchId'] = mchId }
      if (!isEmpty(venId)) { this.params['venId'] = venId }
      if (!isEmpty(orderType)) { this.params['orderType'] = orderType }
      if (!isEmpty(methodCode)) { this.params['methodCode'] = methodCode }
      if (!isEmpty(mchNotified)) { this.params['mchNotified'] = mchNotified }
      if (!isEmpty(minAmount)) { this.params['minAmount'] = minAmount }
      if (!isEmpty(maxAmount)) { this.params['maxAmount'] = maxAmount }
      if (!isEmpty(confirmType)) { this.params['confirmType'] = confirmType }
      if (!isEmpty(orderStatus)) { this.params['orderStatus'] = orderStatus }
      if (!isEmpty(mchSettled)) { this.params['mchSettled'] = mchSettled }
      if (!isEmpty(venSettled)) { this.params['venSettled'] = venSettled }
      if (!isEmpty(matSettled)) { this.params['matSettled'] = matSettled }
      if (!isEmpty(sysSettled)) { this.params['sysSettled'] = sysSettled }
      if (!isEmpty(catSettled)) { this.params['catSettled'] = catSettled }
      if (!isEmpty(venBankCode)) { this.params['venBankCode'] = venBankCode }
      if (!isEmpty(channelSettled)) { this.params['channelSettled'] = channelSettled }
      if (!isEmpty(channelNotified)) { this.params['channelNotified'] = channelNotified }
      if (!isEmpty(createTime) && !isEmpty(createTime[0])) {
        this.params['startTime'] = createTime[0]
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[1])) {
        this.params['endTime'] = createTime[1]
      }
      return true
    },
    loadOptions() {
      getMchOptions().then(res => {
        this.mchOptions = res.data
      })
      getVenOptions().then(res => {
        this.venOptions = res.data
      })
      getPcOptions().then(res => {
        this.pcOptions = res.data
      })
      getPmOptions({ paySwitch: true }).then(res => {
        this.pmOptions = res.data
      })
      getBankOptions(this.query.countryCode).then(res => {
        this.bankOptions = res.data
      })
    },
    getSum() {
      getOrderStats(this.params).then(res => {
        this.statistics = res.data
      })
    },
    formatPmName(methodCode) {
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
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.orderType === 2) {
        return 'warning-row'
      }
      return ''
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.el-popover--plain{
  word-break: break-all;word-wrap: break-word;
}
</style>
