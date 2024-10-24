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
          <el-select v-model="query.methodCode" filterable clearable placeholder="提现方式" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in pmOptions" :key="item.code" :label="item.name +' - '+ item.code" :value="item.code"/>
          </el-select>
          <el-select v-model="query.bankCode" clearable filterable placeholder="提现银行" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in bankOptions" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
          <el-input v-model="query.transNo" clearable placeholder="提现单号" style="width: 185px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.payeeKey" clearable placeholder="提现账户" style="width: 185px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.payeeName" clearable placeholder="提现户名字" style="width: 120px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-date-picker v-model="query.createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="filter-item" style="width: 330px;" @change="toQuery"/>
          <br>
          <el-select v-model="query.transStatus" clearable placeholder="提现状态" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option label="等待审核" value="0"/>
            <el-option label="提现成功" value="1"/>
            <el-option label="提现驳回" value="2"/>
            <el-option label="提现受理" value="3"/>
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
          <el-select v-model="query.channelType" clearable placeholder="代付类型" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option label="三方通道" value="0"/>
            <el-option label="卡商通道" value="1"/>
            <el-option label="人工" value="2"/>
          </el-select>
          <el-select v-model="query.venBankCode" clearable filterable placeholder="代付银行" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in bankOptions" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
          <el-select v-model="query.targetSettled" clearable placeholder="提现结算" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option label="已结算" value="true"/>
            <el-option label="未结算" value="false"/>
          </el-select>
          <el-select v-model="query.sysSettled" clearable placeholder="平台结算" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option label="已结算" value="true"/>
            <el-option label="未结算" value="false"/>
          </el-select>
          <el-select v-model="query.venSettled" clearable placeholder="卡商结算" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option label="已结算" value="true"/>
            <el-option label="未结算" value="false"/>
          </el-select>
          <el-select v-model="query.targetFrozen" clearable placeholder="金额冻结" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option label="已冻结" value="true"/>
            <el-option label="未冻结" value="false"/>
          </el-select>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </blockquote>
        <blockquote class="my-blockquote statistics">
          <div>
            <span class="text">订单总数：</span><el-tag>{{ statistics.totalCount }}</el-tag>
            <span class="text">成功单数：</span><el-tag type="success">{{ statistics.successCount }}</el-tag>
            <span class="text">提现总额：</span><el-tag>{{ mathDiv(statistics.totalAmount,100) }}</el-tag>
            <span class="text">成功到账总额：</span><el-tag type="success">{{ mathDiv(statistics.successAmount,100) }}</el-tag>
            <span v-if="statistics.totalIncome > 0" class="text">平台手续费：</span><el-tag v-if="statistics.totalIncome > 0" type="warning">{{ mathDiv(statistics.totalIncome,100) }}</el-tag>
            <span class="text" style="color: rgb(252, 85, 49)">通道代付流程：1、审核通过后上报代付通道受理 2、代付通道收到代付单进行下发处理 3、通道完成下发通知平台结束</span>
          </div>
        </blockquote>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" :header-cell-style="{background:'#f5f7fa',color:'#606266'}" size="small" border style="width: 100%;">
      <el-table-column label="国家/单号" min-width="155px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span><br>
          <span>{{ scope.row.transNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="methodCode" label="提现方式" min-width="115px">
        <template slot-scope="scope">
          <span v-if="scope.row.methodCode == 'USD001'" style="color: #E6A23C">USDT</span>
          <span v-else style="color: #409EFF">法币</span><br>
          {{ formatPmName(scope.row.methodCode) }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="outTransNo" label="申请单号&状态" min-width="160px">
        <template slot-scope="scope">
          <span v-if="scope.row.transStatus == 0" style="color: #E6A23C">等待审核</span>
          <span v-if="scope.row.transStatus == 1" style="color: #67C23A">提现成功</span>
          <span v-if="scope.row.transStatus == 2" style="color: #F56C6C">提现驳回</span>
          <span v-if="scope.row.transStatus == 3" style="color: #409EFF">提现受理</span><br>
          <span>{{ scope.row.outTransNo }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderAmount" label="金额&费用(元)" min-width="115px">
        <template slot-scope="scope">
          <span v-if="scope.row.actualAmount>0 && scope.row.actualAmount!=scope.row.orderAmount">
            <s>{{ formatNum(mathDiv(scope.row.orderAmount, 100)) }}</s>&ensp;<span style="color: red">{{ formatNum(mathDiv(scope.row.actualAmount, 100)) }}</span>
          </span>
          <span v-else>
            {{ formatNum(mathDiv(scope.row.orderAmount, 100)) }}
          </span><br>
          <span>{{ formatNum(mathMul(scope.row.drawRate, 100)) }}% &ensp;{{ formatNum(mathDiv(scope.row.drawFee, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="targetType" label="提现人" min-width="95px">
        <template slot-scope="scope">
          <span v-if="scope.row.targetType == 1" style="color: #409EFF">商户</span>
          <span v-if="scope.row.targetType == 5" style="color: #FF8700">卡商</span>
          <span v-if="scope.row.targetType == 2" style="color: #E6A23C">商户代理</span>
          <span v-if="scope.row.targetType == 4" style="color: #E6A23C">通道代理</span>
          <el-tooltip v-if="scope.row.targetType == 1" placement="top">
            <div slot="content">{{ scope.row.targetNotifyTime }}<br>{{ scope.row.targetNotifyUrl }}</div>
            <span v-if="scope.row.targetNotified" style="color: #67C23A">已回调</span>
            <span v-else style="color:red;">未回调</span>
          </el-tooltip><br>
          <span>{{ scope.row.targetName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现账户" min-width="110px">
        <template slot-scope="scope">
          <el-popover placement="top-start" trigger="hover">
            <div style="font-size: 12px;line-height: 20px">
              <span v-if="scope.row.transType==0">
                <span>银行名称：{{ formatBankName(scope.row.payeeBankCode) }}</span>
                <span><br>银行户名：{{ scope.row.payeeBankOwner }}</span>
                <span><br>银行账号：{{ scope.row.payeeBankAccount }}</span>
                <span><br>附加数据：{{ scope.row.payeeAttach }}</span>
                <span v-if="!isEmpty(scope.row.payeeIdentityType)"><br>身份标识：{{ scope.row.payeeIdentityType }}<br>{{ scope.row.payeeIdentity }}</span>
              </span>
              <span v-if="scope.row.transType==1">TRX地址：{{ scope.row.payeeBankAccount }}</span>
            </div>
            <a slot="reference" style="min-width:100px;overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; color: #409EFF">{{ scope.row.payeeBankAccount }}</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="usd" label="USDT" min-width="90px">
        <template slot-scope="scope">
          <span v-if="scope.row.methodCode == 'USD001'">{{ formatNum(scope.row.usd) }} u<br>{{ formatNum(scope.row.usdRate, 4) }}</span>
          <span v-else style="color: #909399">结算法币</span>
        </template>
      </el-table-column>
      <el-table-column prop="channelName" label="代付通道" min-width="105px">
        <template slot-scope="scope">
          <div v-if="scope.row.transType==0">
            <el-tooltip v-if="scope.row.channelNotified" placement="top">
              <div slot="content">{{ scope.row.channelNotifyTime }}</div>
              <span style="color: #67C23A">已回调</span>
            </el-tooltip>
            <span v-else style="color:red;">未回调</span>
            <span v-if="!scope.row.channelAccepted" style="color:red;margin-left: 8px">未响应</span><br>
            <span>{{ scope.row.channelName }}</span>
          </div>
          <span v-else style="color: #979A9A">非通道代付</span>
        </template>
      </el-table-column>
      <el-table-column label="通道结算" min-width="110px">
        <template slot-scope="scope">
          <div v-if="scope.row.transType==0">
            <el-tooltip v-if="scope.row.channelSettled" placement="top">
              <div slot="content">
                {{ scope.row.channelSettledTime }}
              </div>
              <span style="color: #67C23A">已结算</span>
            </el-tooltip>
            <span v-else style="color:red;">未结算</span>
            <br>
            <span>{{ formatNum(mathMul(scope.row.channelRate, 100)) }}%&ensp;{{ formatNum(mathDiv(scope.row.channelIncome, 100)) }}</span>
          </div>
          <span v-else style="color: #979A9A">非通道代付</span>
        </template>
      </el-table-column>
      <el-table-column label="卡商&分润&结算" min-width="160px">
        <template slot-scope="scope">
          <div v-if="scope.row.channelType==1" style="float:left;width: 60px">
            <el-popover placement="top-start" trigger="hover">
              <div style="font-size: 12px;line-height: 20px">
                <span>银行名称：{{ formatBankName(scope.row.venBankCode) }}</span>
                <span><br>银行户名：{{ scope.row.venPayeeOwner }}</span>
                <span><br>银行账号：{{ scope.row.venPayeeKey }}</span>
                <span><br>附加数据：{{ scope.row.venPayeeJson }}</span>
                <span v-if="!isEmpty(scope.row.venIdentityType)"><br>身份标识：{{ scope.row.venIdentityType }}<br>{{ scope.row.venIdentity }}</span>
              </div>
              <span slot="reference">
                <span v-if="scope.row.venSettleMethod == 0" style="color: #409EFF">流水分润</span>
                <span v-if="scope.row.venSettleMethod == 1" style="color: #E6A23C">固定工资</span><br>
                <span>{{ scope.row.venName }}</span>
              </span>
            </el-popover>
          </div>
          <div v-if="scope.row.channelType==1" style="float:left">
            <el-tooltip v-if="scope.row.venSettled" placement="top">
              <div slot="content">
                {{ scope.row.venSettledTime }}
              </div>
              <span style="color: #67C23A">已结算</span>
            </el-tooltip>
            <span v-else style="color:red;">未结算</span><br>
            <span>{{ formatNum(mathMul(scope.row.venRate, 100)) }}%&ensp;{{ formatNum(mathDiv(scope.row.venIncome, 100)) }}</span>
          </div>
          <span v-else style="color: #979A9A">非卡商代付</span>
        </template>
      </el-table-column>
      <el-table-column label="平台结算" min-width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.sysSettled" style="color: #67C23A">已结算</span>
          <span v-else style="color:red;">未结算</span><br>
          <span>{{ formatNum(mathDiv(scope.row.sysIncome, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现结算" min-width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.targetSettled" style="color: #67C23A">已结算</span>
          <span v-else style="color:red;">未结算</span><br>
          <span>{{ formatNum(mathDiv(scope.row.actualAmount, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额冻结" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.targetFrozen" style="color: #67C23A">已冻结</span>
          <span v-else style="color: #E6A23C">未冻结</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建&完成 日期" min-width="133px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span><br>
          <span>{{ scope.row.successTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px" fixed="right">
        <template slot-scope="scope">
          <edit :data="scope.row" :page-num="pageNum" :sup_this="sup_this"/>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination :total="total" :page-sizes="pageSizes" style="margin-top: 8px;" layout="total, prev, pager, next, sizes" @size-change="sizeChange" @current-change="pageChange"/>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import initData from '../../../../mixins/initData'
import { getDrawStats } from '@/api/order-draw'
import { isEmpty } from '@/utils/index'
import { mathMul, mathDiv, formatNum } from '@/utils/math'
import { getPmOptions, getBankOptions } from '@/api/payment'
import { getMchOptions } from '@/api/mch'
import { getVenOptions } from '@/api/ven'
import { getAgentOptions } from '@/api/agent'
import countryOptions from '@/utils/country'
import edit from './module/edit'
export default {
  components: { edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, countryOptions: countryOptions, pmOptions: [], bankOptions: [], mchOptions: [], venOptions: [], matOptions: [], catOptions: [], targetOptions: [], statistics: { totalCount: 0, totalAmount: 0, successCount: 0, successAmount: 0, totalIncome: 0, moneySucRate: 0, numSucRate: 0, failCount: 0, failAmount: 0 }
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
      this.url = '/order/draw/page/mock'
      const query = this.query
      this.params = { pageIndex: this.page, pageSize: this.size }
      const transNo = query.transNo
      const payeeKey = query.payeeKey
      const payeeName = query.payeeName
      const methodCode = query.methodCode
      const bankCode = query.bankCode
      const targetId = query.targetId
      const targetType = query.targetType
      const channelType = query.channelType
      const targetSettled = query.targetSettled
      const sysSettled = query.sysSettled
      const venSettled = query.venSettled
      const venBankCode = query.venBankCode
      const targetFrozen = query.targetFrozen
      const transStatus = query.transStatus
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
      if (!isEmpty(payeeKey)) { this.params['payeeKey'] = payeeKey }
      if (!isEmpty(payeeName)) { this.params['payeeName'] = payeeName }
      if (!isEmpty(methodCode)) { this.params['methodCode'] = methodCode }
      if (!isEmpty(bankCode)) { this.params['bankCode'] = bankCode }
      if (!isEmpty(targetId)) { this.params['targetId'] = targetId }
      if (!isEmpty(targetType)) { this.params['targetType'] = targetType }
      if (!isEmpty(channelType)) { this.params['channelType'] = channelType }
      if (!isEmpty(targetSettled)) { this.params['targetSettled'] = targetSettled }
      if (!isEmpty(sysSettled)) { this.params['sysSettled'] = sysSettled }
      if (!isEmpty(venSettled)) { this.params['venSettled'] = venSettled }
      if (!isEmpty(targetFrozen)) { this.params['targetFrozen'] = targetFrozen }
      if (!isEmpty(transStatus)) { this.params['transStatus'] = transStatus }
      if (!isEmpty(venBankCode)) { this.params['venBankCode'] = venBankCode }
      return true
    },
    loadOptions() {
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
      getBankOptions(this.query.countryCode).then(res => {
        this.bankOptions = res.data
      })
      getPmOptions({ countryCode: this.query.countryCode, drawSwitch: true }).then(res => {
        this.pmOptions = res.data
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
    toQuery() {
      this.page = 0
      this.init()
      this.getSum()
    },
    getSum() {
      getDrawStats(this.params).then(res => {
        this.statistics = res.data
      })
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
