<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="2">商户代理流水</el-menu-item>
          <el-menu-item index="4">通道代理流水</el-menu-item>
        </el-menu>
        <!-- 搜索 -->
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <el-select v-model="query.countryCode" filterable clearable placeholder="请选择国家" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option
              v-for="item in countryOptions"
              :key="item.code"
              :label="item.code +'-'+ item.name"
              :value="item.code"/>
          </el-select>
          <el-select v-model="query.agentId" :placeholder="'选择'+targetName+'代理'" filterable clearable class="filter-item" style="width:160px" @change="toQuery">
            <el-option v-for="item in agentOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-input v-model="query.orderNo" clearable placeholder="请输入订单号" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-select v-model="query.methodCode" clearable filterable placeholder="支付方式" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in pmOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-select v-model="query.flowType" clearable filterable placeholder="流水来源" class="filter-item" style="width: 100px" @change="toQuery">
            <el-option label="充值" value="1"/>
            <el-option label="提款" value="2"/>
            <el-option label="调账" value="3"/>
            <el-option label="平台" value="4"/>
          </el-select>
          <el-select v-model="query.dataType" clearable filterable placeholder="流水类型" class="filter-item" style="width: 100px" @change="toQuery">
            <el-option label="会员充值" value="1"/>
            <el-option label="提款结算" value="2"/>
            <el-option label="提款冻结" value="3"/>
            <el-option label="驳回提款" value="4"/>
            <el-option label="手动扣款" value="5"/>
            <el-option label="手动加款" value="6"/>
            <el-option label="手动冻结" value="7"/>
            <el-option label="手动解冻" value="8"/>
            <el-option label="D1转D0" value="9"/>
            <el-option label="调账加款" value="10"/>
            <el-option label="调账扣款" value="11"/>
            <el-option label="调账手续费" value="12"/>
            <el-option label="提款手续费" value="13"/>
          </el-select>
          <el-date-picker v-model="query.createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="filter-item" style="width: 330px;" @change="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </blockquote>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" prop="orderNo" label="订单号" width="180px"/>
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" :label="targetName+'代理'" prop="targetName" width="120px"/>
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
import { isEmpty } from '@/utils/index'
import { mathMul, mathDiv, formatNum } from '@/utils/math'
import { getPmOptions } from '@/api/payment'
import { getAgentOptions } from '@/api/agent'
import countryOptions from '@/utils/country'

export default {
  mixins: [initData],
  data() {
    return {
      sup_this: this, countryOptions: countryOptions, activeIndex: '2', agentType: 2, targetName: '商户', agentOptions: [], pmOptions: []
    }
  },
  created() {
    this.getPmList()
    this.loadOptions(2)
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    mathMul, mathDiv, formatNum,
    toQuery() {
      this.page = 1
      this.init()
    },
    beforeInit() {
      this.pageNum = this.page
      this.url = 'agent/wallet/flow'
      const query = this.query
      const orderNo = query.orderNo
      const agentId = query.agentId
      const methodCode = query.methodCode
      const flowType = query.flowType
      const dataType = query.dataType
      const createTime = query.createTime
      this.params = { pageIndex: this.page, pageSize: this.size, targetType: this.agentType }
      if (!isEmpty(orderNo)) { this.params['orderNo'] = orderNo }
      if (!isEmpty(agentId)) { this.params['targetId'] = agentId }
      if (!isEmpty(methodCode)) { this.params['methodCode'] = methodCode }
      if (!isEmpty(flowType)) { this.params['flowType'] = flowType }
      if (!isEmpty(dataType)) { this.params['dataType'] = dataType }
      if (!isEmpty(createTime) && !isEmpty(createTime[0])) {
        this.params['startTime'] = createTime[0]
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[1])) {
        this.params['endTime'] = createTime[1]
      }
      return true
    },
    loadOptions(agentType) {
      getAgentOptions(null, agentType).then(res => {
        this.agentOptions = res.data
      })
    },
    getPmList() {
      getPmOptions().then(res => {
        this.pmOptions = res.data
      })
    },
    selectionChangeHandle(val) {
      this.selections = val
    },
    handleSelect(key, keyPath) {
      if (key === '2') {
        this.targetName = '商户'
        this.agentType = 2
        this.loadOptions(2)
        this.query.agentId = null
        this.toQuery()
      } else {
        this.targetName = '通道'
        this.agentType = 4
        this.loadOptions(4)
        this.query.agentId = null
        this.toQuery()
      }
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
<style>
  .head-container .el-menu--horizontal{
    margin-bottom: 15px;
  }
  .head-container .el-menu--horizontal .el-menu-item{
    background-color: #f5f7fa;
    height: 40px;
    line-height: 40px;
    border: 1px solid #e4e7ed!important;
    border-radius: 4px 4px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-left: -1px;
    margin-bottom: -1px;
  }
  .head-container .el-menu--horizontal .el-menu-item.is-active{
    background-color: #fff;
    color: #409EFF;
    font-weight: bold;
    border-bottom: 1px solid #FFF!important;
  }
</style>
