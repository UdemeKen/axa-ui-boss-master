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
          <el-date-picker v-model="query.reportDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                          unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                          class="filter-item" style="width: 340px;" @change="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索
          </el-button>
        </blockquote>
      </div>
    </template><!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column prop="reportDate" label="报表日期" min-width="90px"/>
      <el-table-column :show-overflow-tooltip="true" prop="countryCode" label="国家编码" min-width="120px"/>
      <el-table-column prop="orderCount" label="订单总笔数" min-width="75px"/>
      <el-table-column prop="orderAmount" label="订单总金额(元)" min-width="90px">
        <template slot-scope="scope">
          {{ mathDiv(scope.row.orderAmount, 100) }}
        </template>
      </el-table-column>
      <el-table-column prop="successOrderCount" label="成功订单总笔数" min-width="75px"/>
      <el-table-column prop="successOrderAmount" label="成功订单总金额(元)" min-width="90px">
        <template slot-scope="scope">
          {{ mathDiv(scope.row.successOrderAmount, 100) }}
        </template>
      </el-table-column>
      <el-table-column prop="failedOrderCount" label="失败订单总笔数" min-width="75px"/>
      <el-table-column prop="failedOrderAmount" label="失败订单总金额(元)" min-width="90px">
        <template slot-scope="scope">
          {{ mathDiv(scope.row.failedOrderAmount, 100) }}
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
import {isAuth} from '@/utils/auth'
import initData from '../../../mixins/initData'
import countryOptions from '@/utils/country'
import {parseTime, isEmpty} from '@/utils/index'
import {mathMul, mathDiv} from '@/utils/math'

export default {
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], pcOptions: [], pmOptions: [], countryOptions: countryOptions
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
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
      this.url = '/report/trade'
      const query = this.query
      const reportDate = query.reportDate
      const countryCode = query.countryCode
      this.params = {pageIndex: this.page, pageSize: this.size}
      if (!isEmpty(countryCode)) {
        this.params['countryCode'] = countryCode
      }
      if (!isEmpty(reportDate) && !isEmpty(reportDate[0])) {
        this.params['startTime'] = reportDate[0]
      }
      if (!isEmpty(reportDate) && !isEmpty(reportDate[1])) {
        this.params['endTime'] = reportDate[1]
      }
      return true
    }
  }
}
</script>
