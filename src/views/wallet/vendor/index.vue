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
          <el-select v-model="query.targetId" clearable filterable placeholder="选择卡商" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id"/>
          </el-select>
          <el-input v-model="query.minAmount" clearable placeholder="最低余额" style="width: 130px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.maxAmount" clearable placeholder="最高余额" style="width: 130px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <span class="text" style="margin-left: 15px;font-size: 14px">选择国家后即可查看国家维度钱包统计</span>
        </blockquote>
        <blockquote class="my-blockquote statistics">
          <span class="text">保证金总额：</span><el-tag type="warning">{{ statistics.currencyCode }} {{ formatNum(mathDiv(statistics.deposit,100)) }}</el-tag>
          <span class="text">可用总额：</span><el-tag type="warning">{{ statistics.currencyCode }} {{ formatNum(mathDiv(statistics.creditAmount,100)) }}</el-tag>
          <span class="text">D0收益总额：</span><el-tag type="warning">{{ statistics.currencyCode }} {{ formatNum(mathDiv(statistics.profit,100)) }}</el-tag>
          <span class="text">D1收益总额：</span><el-tag type="warning">{{ statistics.currencyCode }} {{ formatNum(mathDiv(statistics.profitNext,100)) }}</el-tag>
          <span class="text">冻结收益总额：</span><el-tag type="warning">{{ statistics.currencyCode }} {{ formatNum(mathDiv(statistics.profitFrozen,100)) }}</el-tag>
          <span class="text">D0奖金总额：</span><el-tag type="warning">{{ statistics.currencyCode }} {{ formatNum(mathDiv(statistics.bonus,100)) }}</el-tag>
          <span class="text">D1奖金总额：</span><el-tag type="warning">{{ statistics.currencyCode }} {{ formatNum(mathDiv(statistics.bonusNext,100)) }}</el-tag>
          <span class="text">冻结奖金总额：</span><el-tag type="warning">{{ statistics.currencyCode }} {{ formatNum(mathDiv(statistics.bonusFrozen,100)) }}</el-tag>
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
      <el-table-column :show-overflow-tooltip="true" label="卡商" prop="venName" min-width="100px"/>
      <el-table-column prop="totalAmount" label="保证金" min-width="100px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.deposit, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="creditAmount" label="可用额度" min-width="100px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.creditAmount, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="冻结保证金" min-width="110px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.depositFrozen, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="D0收益" min-width="100px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.profit, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="D1收益" min-width="110px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.profitNext, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="冻结收益" min-width="100px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.profitFrozen, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="D0奖金" min-width="100px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.bonus, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="D1奖金" min-width="100px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.bonusNext, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="冻结奖金" min-width="100px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.bonusFrozen, 100)) }}</span>
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
import { getWalletStats, getVenOptions } from '@/api/ven'
import { isEmpty } from '@/utils/index'
import { mathMul, mathDiv, formatNum } from '@/utils/math'
import countryOptions from '@/utils/country'
import edit from './module/edit'
export default {
  components: { edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, countryOptions: countryOptions, venOptions: [], statistics: { deposit: 0, creditAmount: 0, depositFrozen: 0, payAmount: 0, profit: 0, profitNext: 0, profitFrozen: 0, bonus: 0, bonusNext: 0, bonusFrozen: 0 }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadOptions()
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
      this.url = 'vendor/wallet/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
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
    loadOptions() {
      getVenOptions().then(res => {
        this.venOptions = res.data
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
