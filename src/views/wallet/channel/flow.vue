<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <!-- 搜索 -->
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <!-- 搜索 -->
          <el-select v-model="query.countryCode" filterable clearable placeholder="请选择国家" class="filter-item" style="width: 130px" @change="toQuery">
            <el-option
              v-for="item in countryOptions"
              :key="item.code"
              :label="item.code +'-'+ item.name"
              :value="item.code"/>
          </el-select>
          <el-select v-model="query.targetId" placeholder="选择通道" filterable clearable class="filter-item" style="width:140px" @change="toQuery">
            <el-option v-for="item in pcOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-input
            v-model="query.orderNo"
            clearable
            placeholder="请输入订单号"
            style="width: 180px;"
            class="filter-item"
            @keyup.enter.native="toQuery"/>
          <el-select
            v-model="query.flowSource"
            clearable
            filterable
            placeholder="流水来源"
            class="filter-item"
            style="width: 100px"
            @change="toQuery">
            <el-option label="系统" value="0"/>
            <el-option label="收单" value="1"/>
            <el-option label="代付" value="2"/>
            <el-option label="充值" value="3"/>
          </el-select>
          <el-select
            v-model="query.flowType"
            clearable
            filterable
            placeholder="流水类型"
            class="filter-item"
            style="width: 100px"
            @change="toQuery">
            <el-option label="收单" value="1"/>
            <el-option label="充值" value="2"/>
            <el-option label="代付结算" value="3"/>
            <el-option label="代付冻结" value="4"/>
            <el-option label="代付解冻" value="5"/>
            <el-option label="手动加款" value="6"/>
            <el-option label="手动扣款" value="7"/>
            <el-option label="系统冻结" value="8"/>
            <el-option label="系统解冻" value="9"/>
            <el-option label="增加进单额" value="10"/>
            <el-option label="减少进单额" value="11"/>
            <el-option label="收益D1转D0" value="12"/>
            <el-option label="奖金D1转D0" value="13"/>
            <el-option label="收益转保证金" value="14"/>
            <el-option label="奖金转保证金" value="15"/>
            <el-option label="收单奖金" value="16"/>
            <el-option label="代付收益" value="17"/>
            <el-option label="商户代付手续费" value="18"/>
            <el-option label="商户代理代付手续费" value="19"/>
            <el-option label="通道代理代付手续费" value="20"/>
            <el-option label="卡商代付手续费" value="21"/>
          </el-select>
          <el-date-picker
            v-model="query.createTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="filter-item"
            style="width: 330px;"
            @change="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索
          </el-button>
        </blockquote>
      </div>
    </template>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      border
      style="width: 100%;"
      @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="通道" prop="channelName" min-width="100px"/>
      <el-table-column label="流水来源" min-width="80px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.flowSource == 0">系统</span>
          <span v-if="scope.row.flowSource == 1">收单</span>
          <span v-if="scope.row.flowSource == 2">代付</span>
          <span v-if="scope.row.flowSource == 3">充值</span>
        </template>
      </el-table-column>
      <el-table-column label="流水类型" align="center" min-width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.flowType==1">收单</span>
          <span v-if="scope.row.flowType==2">充值</span>
          <span v-if="scope.row.flowType==3">代付结算</span>
          <span v-if="scope.row.flowType==4">代付冻结</span>
          <span v-if="scope.row.flowType==5">代付解冻</span>
          <span v-if="scope.row.flowType==6">手动加款</span>
          <span v-if="scope.row.flowType==7">手动扣款</span>
          <span v-if="scope.row.flowType==8">系统冻结</span>
          <span v-if="scope.row.flowType==9">系统解冻</span>
          <span v-if="scope.row.flowType==10">增加进单额</span>
          <span v-if="scope.row.flowType==11">减少进单额</span>
          <span v-if="scope.row.flowType==12">收益D1转D0</span>
          <span v-if="scope.row.flowType==13">奖金D1转D0</span>
          <span v-if="scope.row.flowType==14">收益转保证金</span>
          <span v-if="scope.row.flowType==15">奖金转保证金</span>
          <span v-if="scope.row.flowType==16">收单奖金</span>
          <span v-if="scope.row.flowType==17">代付收益</span>
          <span v-if="scope.row.flowType==18">商户代付手续费</span>
          <span v-if="scope.row.flowType==19">商户代理代付手续费</span>
          <span v-if="scope.row.flowType==20">通道代理代付手续费</span>
          <span v-if="scope.row.flowType==21">卡商代付手续费</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="orderNo" label="订单号" width="180px"/>
      <el-table-column label="订单金额(元)" min-width="90px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.orderAmount, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流水金额(元)" min-width="90px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.amount, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账户余额(元)" min-width="90px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.balance, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="description" label="流水备注" min-width="160px"/>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" min-width="133px"/>
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
import initData from '../../../mixins/initData'
import countryOptions from '@/utils/country'
import { getPcOptions } from '@/api/payment'
import { isEmpty } from '@/utils/index'
import { mathMul, mathDiv, formatNum } from '@/utils/math'

export default {
  mixins: [initData],
  data() {
    return {
      sup_this: this,
      pageNum: 1,
      selections: [], pcOptions: [],
      countryOptions: countryOptions
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadOptions()
  },
  methods: {
    mathMul, mathDiv, formatNum,
    toQuery() {
      this.page = 1
      this.init()
    },
    beforeInit() {
      this.pageNum = this.page
      this.url = '/payment/channel/wallet/flow'
      const query = this.query
      this.params = { pageIndex: this.page, pageSize: this.size }
      const targetId = query.targetId
      const orderNo = query.orderNo
      const amountType = query.amountType
      const flowSource = query.flowSource
      const flowType = query.flowType
      const createTime = query.createTime
      const countryCode = query.countryCode
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(targetId)) { this.params['targetId'] = targetId }
      if (!isEmpty(orderNo)) { this.params['orderNo'] = orderNo }
      if (!isEmpty(amountType)) { this.params['amountType'] = amountType }
      if (!isEmpty(flowSource)) { this.params['flowSource'] = flowSource }
      if (!isEmpty(flowType)) { this.params['flowType'] = flowType }
      if (!isEmpty(createTime) && !isEmpty(createTime[0])) {
        this.params['startTime'] = createTime[0]
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[1])) {
        this.params['endTime'] = createTime[1]
      }
      return true
    },
    selectionChangeHandle(val) {
      this.selections = val
    },
    loadOptions() {
      getPcOptions({ countryCode: null, disabled: false, mchId: null }).then(res => {
        this.pcOptions = res.data
      })
    }
    /* formatPm(row, column) {
      const methodCode = row['methodCode']
      for (let i = 0; i < this.pmOptions.length; i++) {
        if (this.pmOptions[i].code === methodCode) {
          return this.pmOptions[i].name
        }
      }
    } */
  }
}
</script>
