<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <!-- 搜索 -->
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <el-select v-model="query.countryCode" filterable clearable placeholder="请选择国家" class="filter-item" style="width: 130px" @change="toQuery">
            <el-option
              v-for="item in countryOptions"
              :key="item.code"
              :label="item.code +'-'+ item.name"
              :value="item.code"/>
          </el-select>
          <el-select v-model="query.targetId" placeholder="选择商户" filterable clearable class="filter-item" style="width:140px" @change="toQuery">
            <el-option v-for="item in mchOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-input v-model="query.minAmount" clearable placeholder="最低余额" style="width: 130px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.maxAmount" clearable placeholder="最高余额" style="width: 130px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <span class="text" style="margin-left: 15px;font-size: 14px">选择国家后即可查看国家维度钱包统计</span>
        </blockquote>
        <blockquote class="my-blockquote statistics">
          <span class="text">钱包总额：</span><el-tag type="warning">{{ statistics.currencyCode }} {{ formatNum(mathDiv(statistics.balance,100)) }}</el-tag>
          <span class="text">D1总额：</span><el-tag type="warning">{{ statistics.currencyCode }} {{ formatNum(mathDiv(statistics.balanceNext,100)) }}</el-tag>
          <span class="text">冻结总额：</span><el-tag type="warning">{{ statistics.currencyCode }} {{ formatNum(mathDiv(statistics.balanceFrozen,100)) }}</el-tag>
        </blockquote>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="商户" prop="mchName" min-width="100px"/>
      <el-table-column prop="balance" label="钱包D0余额(元)" min-width="100px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.balance, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="balanceNext" label="钱包D1余额(元)" min-width="100px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.balanceNext, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="冻结金额(元)" min-width="110px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.balanceFrozen, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" min-width="133px"/>
      <el-table-column label="操作" align="center" min-width="120px" fixed="right">
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
import initData from '../../../mixins/initData'
import { getWalletStats, getMchOptions } from '@/api/mch'
import { isEmpty } from '@/utils/index'
import { mathMul, mathDiv, formatNum } from '@/utils/math'
import countryOptions from '@/utils/country'
import edit from './module/edit'
export default {
  components: { edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, countryOptions: countryOptions, mchOptions: [], statistics: { currencyCode: '', balance: 0, balanceNext: 0, balanceFrozen: 0 }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadMchOptions()
  },
  methods: {
    formatNum,
    isAuth,
    mathMul,
    mathDiv,
    toQuery() {
      this.page = 1
      this.init()
      this.getWalletSum()
    },
    beforeInit() {
      this.pageNum = this.page
      this.url = 'merchant/wallet/page'
      const query = this.query
      this.params = { pageIndex: this.page, pageSize: this.size }
      const targetId = query.targetId
      const minAmount = query.minAmount
      const maxAmount = query.maxAmount
      const countryCode = query.countryCode
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(targetId)) { this.params['targetId'] = targetId }
      if (!isEmpty(minAmount)) { this.params['minAmount'] = minAmount }
      if (!isEmpty(maxAmount)) { this.params['maxAmount'] = maxAmount }
      return true
    },
    loadMchOptions() {
      getMchOptions().then(res => {
        this.mchOptions = res.data
      })
    },
    getWalletSum() {
      const countryCode = this.query.countryCode
      if (isEmpty(countryCode)) {
        return
      }
      getWalletStats({ countryCodeList: [countryCode] }).then(res => {
        this.statistics = res.data
      })
    }
  }
}
</script>
