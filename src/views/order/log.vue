<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <el-select v-model="query.countryCode" filterable clearable placeholder="请选择国家" class="filter-item" style="width: 130px" @change="toQuery">
            <el-option
              v-for="item in countryOptions"
              :key="item.code"
              :label="item.code +'-'+ item.name"
              :value="item.code"/>
          </el-select>
          <el-select v-model="query.methodType" clearable filterable placeholder="API接口" class="filter-item" style="width: 100px" @change="toQuery">
            <el-option label="交易下单" value="1"/>
            <el-option label="交易查询" value="2"/>
            <el-option label="交易回调" value="3"/>
            <el-option label="代付下单" value="4"/>
            <el-option label="代付查询" value="5"/>
            <el-option label="代付回调" value="6"/>
            <el-option label="自动中转" value="7"/>
          </el-select>
          <el-input v-model="query.outTradeNo" clearable placeholder="商户订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.appId" clearable placeholder="商户APP_ID" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-select v-model="query.methodCode" clearable filterable placeholder="支付方式" class="filter-item" style="width: 140px" @change="toQuery">
            <el-option v-for="item in pmOptions" :key="item.code" :label="item.name +' - '+ item.code" :value="item.code"/>
          </el-select>
          <el-date-picker v-model="query.createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="filter-item" style="width: 340px;" @change="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </blockquote>
      </div>
    </template><!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="API接口" min-width="80px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.methodType == 1">交易下单</span>
          <span v-if="scope.row.methodType == 2">交易查询</span>
          <span v-if="scope.row.methodType == 3">代付下单</span>
          <span v-if="scope.row.methodType == 5">代付查询</span>
          <span v-if="scope.row.methodType == 7">自动中转</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatPm" :show-overflow-tooltip="true" prop="methodCode" label="支付方式" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="outTradeNo" label="商户订单号" min-width="160px"/>
      <el-table-column :show-overflow-tooltip="true" prop="appId" label="商户APP_ID" min-width="155px"/>
      <el-table-column prop="orderAmount" label="订单金额(元)" min-width="90px">
        <template slot-scope="scope">
          {{ mathDiv(scope.row.orderAmount, 100) }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="false" label="请求参数" min-width="75px">
        <template slot-scope="scope">
          <el-popover
            :content="scope.row.paramJson"
            placement="top"
            width="600"
            trigger="click">
            <a slot="reference">点击查看</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="请求结果" width="200px">
        <template slot-scope="scope">
          <el-popover
            :content="scope.row.resultJson"
            placement="top"
            width="600"
            trigger="click">
            <a slot="reference" style="width:180px;overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;">{{ scope.row.resultJson }}</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="出码状态" align="center" min-width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.successed" style="color: #67C23A">成功</span>
          <span v-else style="color: #F56C6C">失败</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="msec" label="耗时(毫秒)" min-width="80px"/>
      <el-table-column prop="createTime" label="创建日期" width="135px"/>
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
import initData from '@/mixins/initData'
import { getPmOptions } from '@/api/payment'
import countryOptions from '@/utils/country'
import { parseTime, isEmpty } from '@/utils/index'
import { mathMul, mathDiv } from '@/utils/math'
export default {
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], pmOptions: [], countryOptions: countryOptions
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadOptions()
  },
  methods: {
    parseTime,
    isAuth,
    mathMul,
    mathDiv,
    toQuery() {
      this.page = 0
      this.init()
    },
    beforeInit() {
      this.pageNum = this.page
      this.url = 'order/log/pay'
      const query = this.query
      this.params = { pageIndex: this.page, pageSize: this.size }
      const orderNo = query.orderNo
      const outTradeNo = query.outTradeNo
      const appId = query.appId
      const methodType = query.methodType
      const methodCode = query.methodCode
      const createTime = query.createTime
      const countryCode = query.countryCode
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(orderNo)) { this.params['orderNo'] = orderNo }
      if (!isEmpty(outTradeNo)) { this.params['outTradeNo'] = outTradeNo }
      if (!isEmpty(appId)) { this.params['appId'] = appId }
      if (!isEmpty(methodType)) { this.params['methodType'] = methodType }
      if (!isEmpty(methodCode)) { this.params['methodCode'] = methodCode }
      if (!isEmpty(createTime) && !isEmpty(createTime[0])) {
        this.params['startTime'] = createTime[0]
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[1])) {
        this.params['endTime'] = createTime[1]
      }
      return true
    },
    loadOptions() {
      getPmOptions().then(res => {
        this.pmOptions = res.data
      })
    },
    formatPm(row, column) {
      const methodCode = row['methodCode']
      if (methodCode === 'T00001') {
        return '自动中转'
      }
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
<style>
.el-popover--plain{
  word-break: break-all;word-wrap: break-word;
}
</style>
