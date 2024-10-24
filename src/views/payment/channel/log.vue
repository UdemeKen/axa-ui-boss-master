<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <!-- 搜索 -->
          <el-select v-model="query.countryCode" filterable clearable placeholder="请选择国家" class="filter-item" style="width: 130px" @change="toQuery">
            <el-option
              v-for="item in countryOptions"
              :key="item.code"
              :label="item.code +'-'+ item.name"
              :value="item.code"/>
          </el-select>
          <el-select v-model="query.channelId" placeholder="选择通道" filterable clearable class="filter-item" style="width:140px" @change="toQuery">
            <el-option v-for="item in pcOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-select
            v-model="query.methodType"
            clearable
            filterable
            placeholder="接口类型"
            class="filter-item"
            style="width: 140px"
            @change="toQuery">
            <el-option label="进单提交" value="1"/>
            <el-option label="进单查询" value="2"/>
            <el-option label="进单回调" value="3"/>
            <el-option label="代付提交" value="4"/>
            <el-option label="代付查询" value="5"/>
            <el-option label="代付回调" value="6"/>
          </el-select>
          <el-input v-model="query.orderNo" clearable placeholder="平台订单号" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.channelOrderNo" clearable placeholder="通道流水号" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery"/>
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
      <el-table-column :show-overflow-tooltip="true" label="通道" prop="channelName" min-width="120px"/>
      <el-table-column label="接口类型" min-width="80px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.methodType == 1">进单提交</span>
          <span v-if="scope.row.methodType == 2">进单查询</span>
          <span v-if="scope.row.methodType == 3">进单回调</span>
          <span v-if="scope.row.methodType == 4">代付提交</span>
          <span v-if="scope.row.methodType == 5">代付查询</span>
          <span v-if="scope.row.methodType == 6">代付回调</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="orderNo" label="平台订单号" min-width="160px"/>
      <el-table-column :show-overflow-tooltip="true" prop="channelOrderNo" label="通道流水号" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="methodCode" label="支付方式" min-width="90px"/>
      <el-table-column :show-overflow-tooltip="false" label="参数" min-width="75px">
        <template slot-scope="scope">
          <el-popover
            v-if="!isEmpty(scope.row.paramJson)"
            :content="scope.row.paramJson"
            placement="top"
            width="600"
            trigger="click">
            <a slot="reference">点击查看</a>
          </el-popover>
          <span v-else style="color:#909399;">无参数</span>
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
import { getPcOptions } from '@/api/payment'
import countryOptions from '@/utils/country'
import { isEmpty } from '@/utils/index'
import { mathMul, mathDiv } from '@/utils/math'
export default {
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], pcOptions: [], countryOptions: countryOptions
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadOptions()
  },
  methods: {
    isEmpty,
    isAuth,
    mathMul,
    mathDiv,
    toQuery() {
      this.page = 0
      this.init()
    },
    beforeInit() {
      this.pageNum = this.page
      this.url = '/ch/log/page'
      const query = this.query
      this.params = { pageIndex: this.page, pageSize: this.size }
      const orderNo = query.orderNo
      const channelOrderNo = query.channelOrderNo
      const channelId = query.channelId
      const methodType = query.methodType
      const createTime = query.createTime
      const countryCode = query.countryCode
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(orderNo)) { this.params['orderNo'] = orderNo }
      if (!isEmpty(channelOrderNo)) { this.params['channelOrderNo'] = channelOrderNo }
      if (!isEmpty(channelId)) { this.params['channelId'] = channelId }
      if (!isEmpty(methodType)) { this.params['methodType'] = methodType }
      if (!isEmpty(createTime) && !isEmpty(createTime[0])) {
        this.params['startTime'] = createTime[0]
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[1])) {
        this.params['endTime'] = createTime[1]
      }
      return true
    },
    loadOptions() {
      getPcOptions({ countryCode: null, disabled: false, mchId: null }).then(res => {
        this.pcOptions = res.data
      })
    }
  }
}
</script>
<style>
.el-popover--plain{
  word-break: break-all;word-wrap: break-word;
}
</style>
