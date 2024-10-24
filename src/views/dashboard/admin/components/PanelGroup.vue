<template>
  <el-row :gutter="40" class="panel-group" style="min-width: 640px;margin-top: 0px">
    <el-col :xs="24" :sm="24" :lg="24">
      <h3>{{ pay.countryName }} 当日交易收益&emsp;<span class="card-panel-num" style="color: #FF6600;">{{ pay.currencyCode }} {{ formatNum(mathDiv(pay.totalIncome, 100)) }}</span></h3>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-static">
          <svg-icon icon-class="p" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总金额<span class="card-panel-num">{{ formatNum(mathDiv(pay.totalAmount, 100)) }}</span></div>
          <div class="card-panel-text">总单数
            <count-to :start-val="0" :end-val="pay.totalCount" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-success">
          <svg-icon icon-class="suc" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">成功金额<span class="card-panel-num">{{ formatNum(mathDiv(pay.successAmount, 100)) }}</span></div>
          <div class="card-panel-text">成功单数
            <count-to :start-val="0" :end-val="pay.successCount" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-fail">
          <svg-icon icon-class="fail" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">失败金额<span class="card-panel-num">{{ formatNum(mathDiv(pay.failAmount, 100)) }}</span></div>
          <div class="card-panel-text">失败单数
            <count-to :start-val="0" :end-val="pay.failCount" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="s" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">金额成功率<span class="card-panel-num">{{ formatNum(mathMul(pay.moneySucRate, 100)) }}%</span></div>
          <div class="card-panel-text">单数成功率<span class="card-panel-num">{{ formatNum(mathMul(pay.numSucRate, 100)) }}%</span></div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="24">
      <h3>{{ draw.countryName }} 当日代付收益&emsp;<span class="card-panel-num" style="color: #FF6600;">{{ draw.currencyCode }} {{ formatNum(mathDiv(draw.totalIncome, 100)) }}</span></h3>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-warn">
          <svg-icon icon-class="d" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总金额<span class="card-panel-num">{{ formatNum(mathDiv(draw.totalAmount, 100)) }}</span></div>
          <div class="card-panel-text">总单数
            <count-to :start-val="0" :end-val="draw.totalCount" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-success">
          <svg-icon icon-class="suc" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">已付金额<span class="card-panel-num">{{ formatNum(mathDiv(draw.successAmount, 100)) }}</span></div>
          <div class="card-panel-text">已付单数
            <count-to :start-val="0" :end-val="draw.successCount" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-fail">
          <svg-icon icon-class="fail" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">未付金额<span class="card-panel-num">{{ formatNum(mathDiv(draw.failAmount, 100)) }}</span></div>
          <div class="card-panel-text">未付单数
            <count-to :start-val="0" :end-val="draw.failCount" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="s" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">金额成功率<span class="card-panel-num">{{ formatNum(mathMul(draw.moneySucRate, 100)) }}%</span></div>
          <div class="card-panel-text">单数成功率<span class="card-panel-num">{{ formatNum(mathMul(draw.numSucRate, 100)) }}%</span></div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="24">
      <el-select v-model="countryCode" filterable placeholder="请选择国家" class="filter-item" style="width: 120px">
        <el-option
          v-for="item in countryOptions"
          :key="item.code"
          :label="item.code +'-'+ item.name"
          :value="item.code"
          @click.native="changeCountry(item.code)"/>
      </el-select>
    </el-col>
  </el-row>
</template>

<script>
import { getCurrentDate } from '@/utils/index'
import { getCountryOptions } from '@/api/sys-country'
import { getOrderStats } from '@/api/order-pay'
import { getDrawStats } from '@/api/order-draw'
import { mathMul, mathDiv, formatNum } from '@/utils/math'
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      count: { newIp: 10000, newVisits: 3000, recentIp: 0, recentVisits: 0 }, countryCode: 'BR', countryOptions: [],
      pay: { countryName: '', currencyCode: '', totalCount: 0, totalAmount: 0, successCount: 0, successAmount: 0, totalIncome: 0, moneySucRate: 0, numSucRate: 0, failCount: 0, failAmount: 0 },
      draw: { countryName: '', currencyCode: '', totalCount: 0, totalAmount: 0, successCount: 0, successAmount: 0, totalIncome: 0, moneySucRate: 0, numSucRate: 0, failCount: 0, failAmount: 0 }
    }
  },
  created() {
    this.$nextTick(() => {
      this.loadStats()
    })
  },
  methods: {
    mathMul,
    mathDiv,
    formatNum,
    loadStats() {
      getCountryOptions(false).then(res => {
        this.countryOptions = res.data
      })
      const day = getCurrentDate()
      const params = { countryCodeList: [this.countryCode], startTime: day + ' 00:00:00', endTimeday: day + ' 23:59:59' }
      getOrderStats(params).then(res => {
        this.pay = res.data
      })
      getDrawStats(params).then(res => {
        this.draw = res.data
      })
    },
    changeCountry(code) {
      this.countryCode = code
      this.loadStats()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    border: 1px solid #ebebeb;
    border-radius: 4px;
    transition: .2s;
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
    }
  }
  .card-panel-num {
    font-family: "numbers" !important;
    margin-left: 10px;
    font-size: 20px;
    color: #666;
  }
  .icon-success {
    color: #67C23A;
  }
  .icon-warn {
    color: #E6A23C;
  }
  .icon-message {
    color: #36a3f7;
  }
  .icon-fail {
    color: #F56C6C;
  }
  .icon-static {
    color: #34bfa3
  }
}
</style>
