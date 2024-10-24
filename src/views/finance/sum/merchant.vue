<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <el-select v-model="query.targetId" placeholder="选择商户" filterable clearable class="filter-item" style="width:120px" @change="toQuery">
            <el-option v-for="item in mchOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-select v-model="query.methodCode" clearable filterable placeholder="支付方式" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in pmOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-date-picker v-model="query.createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="filter-item" style="width: 340px;" @change="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </blockquote>
      </div>
    </template><!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" prop="targetName" label="商户" min-width="120px"/>
      <el-table-column :formatter="formatPm" :show-overflow-tooltip="true" prop="methodCode" label="支付方式" min-width="85px"/>
      <el-table-column prop="totalCount" label="总单数" min-width="75px"/>
      <el-table-column prop="totalAmount" label="总金额(元)" min-width="90px">
        <template slot-scope="scope">
          {{ mathDiv(scope.row.totalAmount, 100) }}
        </template>
      </el-table-column>
      <el-table-column prop="successCount" label="成功单数" min-width="75px"/>
      <el-table-column prop="successAmount" label="成功金额(元)" min-width="90px">
        <template slot-scope="scope">
          {{ mathDiv(scope.row.successAmount, 100) }}
        </template>
      </el-table-column>
      <el-table-column prop="successIncome" label="商户收益(元)" min-width="90px">
        <template slot-scope="scope">
          {{ mathDiv(scope.row.successIncome, 100) }}
        </template>
      </el-table-column>
      <el-table-column prop="agentIncome" label="代理收益(元)" min-width="90px">
        <template slot-scope="scope">
          {{ mathDiv(scope.row.agentIncome, 100) }}
        </template>
      </el-table-column>
      <el-table-column prop="sysProfit" label="平台收益(元)" min-width="90px">
        <template slot-scope="scope">
          {{ mathDiv(scope.row.sysProfit, 100) }}
        </template>
      </el-table-column>
      <el-table-column prop="sysProfit" label="统计日期" min-width="260px">
        <template slot-scope="scope">
          {{ scope.row.startTime }} - {{ scope.row.endTime }}
        </template>
      </el-table-column>
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
import initData from '../../../mixins/initData'
import { getPmOptions } from '@/api/payment'
import { getMchOptions } from '@/api/mch'
import { parseTime, isEmpty } from '@/utils/index'
import { mathMul, mathDiv } from '@/utils/math'
export default {
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], mchOptions: [], pmOptions: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.getPmList()
    this.loadMchOptions()
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
      this.url = '/order/sum/mch/page'
      const query = this.query
      const targetId = query.targetId
      const methodCode = query.methodCode
      const createTime = query.createTime
      this.params = { pageIndex: this.page, pageSize: this.size }
      if (!isEmpty(targetId)) { this.params['targetId'] = targetId }
      if (!isEmpty(methodCode)) { this.params['methodCode'] = methodCode }
      if (!isEmpty(createTime) && !isEmpty(createTime[0])) {
        this.params['startTime'] = createTime[0]
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[1])) {
        this.params['endTime'] = createTime[1]
      }
      return true
    },
    loadMchOptions() {
      getMchOptions().then(res => {
        this.mchOptions = res.data
      })
    },
    getPmList() {
      getPmOptions().then(res => {
        this.pmOptions = res.data
      })
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
