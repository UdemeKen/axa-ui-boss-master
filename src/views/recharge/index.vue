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
          <el-input v-model="query.transNo" clearable placeholder="充值单号" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.payeeKey" clearable placeholder="收款账户" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-select v-model="query.methodCode" filterable clearable placeholder="充值方式" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in pmOptions" :key="item.code" :label="item.name +' - '+ item.code" :value="item.code"/>
          </el-select>
          <el-select v-model="query.venId" clearable filterable placeholder="选择卡商" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id"/>
          </el-select>
          <el-select v-model="query.venSettled" clearable placeholder="充值结算" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option label="已结算" value="true"/>
            <el-option label="未结算" value="false"/>
          </el-select>
          <el-select v-model="query.transStatus" clearable placeholder="充值状态" class="filter-item" style="width: 100px" @change="toQuery">
            <el-option label="待审核" value="0"/>
            <el-option label="充值成功" value="1"/>
            <el-option label="充值驳回" value="2"/>
          </el-select>
          <el-date-picker v-model="query.createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="filter-item" style="width: 330px;" @change="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </blockquote>
        <blockquote class="my-blockquote statistics">
          <div>
            <span class="text">订单总数：</span><el-tag>{{ statistics.totalCount }}</el-tag>
            <span class="text">成功单数：</span><el-tag type="success">{{ statistics.successCount }}</el-tag>
            <span class="text">充值总额：</span><el-tag>{{ mathDiv(statistics.totalAmount,100) }}</el-tag>
            <span class="text">成功到账总额：</span><el-tag type="success">{{ mathDiv(statistics.successAmount,100) }}</el-tag>
          </div>
        </blockquote>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50px"/>
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="transNo" label="充值单号" min-width="150px"/>
      <el-table-column :formatter="formatPm" :show-overflow-tooltip="true" prop="methodCode" label="充值方式" min-width="100px"/>
      <el-table-column :show-overflow-tooltip="true" prop="venName" label="卡商" min-width="100px"/>
      <el-table-column prop="orderAmount" label="充值金额(元)" min-width="90px">
        <template slot-scope="scope">
          <span v-if="scope.row.methodCode != 'USD001'">{{ mathDiv(scope.row.orderAmount, 100) }}</span>
          <s v-else style="color: #909399">法币</s>
        </template>
      </el-table-column>
      <el-table-column prop="actualAmount" label="到账金额(元)" min-width="90px">
        <template slot-scope="scope">
          <span>{{ mathDiv(scope.row.actualAmount, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="usd" label="充值USDT" min-width="120px">
        <template slot-scope="scope">
          <span v-if="scope.row.methodCode == 'USD001'">{{ scope.row.usdRate }}/</span>
          <span v-if="scope.row.methodCode == 'USD001'">{{ scope.row.usd }}</span>
          <s v-else style="color: #909399">USDT</s>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="付款账户" min-width="110px">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">
              充值户名：{{ scope.row.payerName }}<br>
              充值银行：{{ scope.row.payerBank }}<br>
              充值卡号：{{ scope.row.payerCard }}
            </div>
            <span>{{ scope.row.payerBank }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="收款账户" min-width="110px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.hadPayee" placement="top">
            <div slot="content">
              收款户名：{{ scope.row.payeeName }}<br>
              收款银行：{{ scope.row.payeeBank }}<br>
              收款卡号：{{ scope.row.payeeCard }}
            </div>
            <span>{{ scope.row.payeeBank }}</span>
          </el-tooltip>
          <span v-else style="color: red">未分配收款账户</span>
        </template>
      </el-table-column>
      <el-table-column label="转账凭证" min-width="70" align="center">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.certificate" placement="top">
            <div slot="content">
              <img :src="scope.row.certificate" style="max-width: 200px">
            </div>
            <span>已上传</span>
          </el-tooltip>
          <span v-else>未上传</span>
        </template>
      </el-table-column>
      <el-table-column label="充值状态" align="center" min-width="70px">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">
              备注：{{ scope.row.auditRemark }}
            </div>
            <span v-if="scope.row.transStatus == 0" style="color: #E6A23C">待审核</span>
            <span v-if="scope.row.transStatus == 1" style="color: #42b983">充值成功</span>
            <span v-if="scope.row.transStatus == 2" style="color: #F56C6C">充值驳回</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="结算状态" align="center" min-width="85px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.venSettled" placement="top">
            <div slot="content">结算日期：{{ scope.row.venSettledTime }}</div>
            <span style="color: #67C23A">已结算</span>
          </el-tooltip>
          <span v-else style="color:red;">未结算</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" min-width="133px"/>
      <el-table-column label="操作" align="center" width="120px" fixed="right">
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
import { getRechgStats } from '@/api/order-rechg'
import { getVenOptions } from '@/api/ven'
import { getPmOptions } from '@/api/payment'
import { parseTime, isEmpty } from '@/utils/index'
import { mathMul, mathDiv } from '@/utils/math'
import countryOptions from '@/utils/country'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      delLoading: false, sup_this: this, pageNum: 1, selections: [], pmOptions: [], countryOptions: countryOptions, venOptions: [], statistics: { totalCount: 0, totalAmount: 0, successCount: 0, successAmount: 0, totalIncome: 0, moneySucRate: 0, numSucRate: 0, failCount: 0, failAmount: 0 }
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
    beforeInit() {
      this.pageNum = this.page
      this.url = '/order/recharge/page'
      const query = this.query
      const transNo = query.transNo
      const methodCode = query.methodCode
      const transStatus = query.transStatus
      const venId = query.venId
      const venSettled = query.venSettled
      const payerKey = query.payerKey
      const payeeKey = query.payeeKey
      const createTime = query.createTime
      const countryCode = query.countryCode
      const countryCodeList = []
      this.params = { pageIndex: this.page, pageSize: this.size }
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(transNo)) { this.params['transNo'] = transNo }
      if (!isEmpty(methodCode)) { this.params['methodCode'] = methodCode }
      if (!isEmpty(transStatus)) { this.params['transStatus'] = transStatus }
      if (!isEmpty(venId)) { this.params['venId'] = venId }
      if (!isEmpty(venSettled)) { this.params['venSettled'] = venSettled }
      if (!isEmpty(payerKey)) { this.params['payerKey'] = payerKey }
      if (!isEmpty(payeeKey)) { this.params['payeeKey'] = payeeKey }
      if (!isEmpty(createTime) && !isEmpty(createTime[0])) {
        this.params['startTime'] = createTime[0]
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[1])) {
        this.params['endTime'] = createTime[1]
      }
      return true
    },
    toQuery() {
      this.page = 0
      this.init()
    },
    loadOptions() {
      getVenOptions().then(res => {
        this.venOptions = res.data
      })
      getPmOptions({ countryCode: null, disabled: false, rechgSwitch: true }).then(res => {
        this.pmOptions = res.data
      })
    },
    getSum() {
      getRechgStats(this.params).then(res => {
        this.statistics = res.data
      })
    },
    selectionChangeHandle(val) {
      this.selections = val
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
