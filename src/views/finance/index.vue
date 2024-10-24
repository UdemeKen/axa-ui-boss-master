<template>
  <div class="app-container">
    <blockquote class="sum-blockquote">
      <div class="line-head">
        <h1>系统钱包：<span style="color:#F56C6C">{{ mathDiv(sysBalance,100) }}</span></h1>
      </div>
    </blockquote>
    <blockquote class="sum-blockquote">
      <div class="line-head">
        <h1>订单统计</h1>
        <el-date-picker v-model="orderTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"/>
        <el-button size="mini" type="primary" @click="getOrderSum()">确定</el-button>
      </div>
      <div class="line-body">
        <span class="text">成功单数：</span>
        <el-tag>{{ orderSum.successCount }}</el-tag>
        <span class="text">成功总额：</span>
        <el-tag type="success">{{ mathDiv(orderSum.successAmount,100) }}</el-tag>
        <span class="text">系统收益：</span>
        <el-tag type="warning">{{ mathDiv(orderSum.sysProfit,100) }}</el-tag>
      </div>
      <div class="line-body">
        <span class="text">商户收入：</span>
        <el-tag type="warning">{{ mathDiv(orderSum.mchIncome,100) }}</el-tag>
        <span class="text">商户代理收益：</span>
        <el-tag type="warning">{{ mathDiv(orderSum.matIncome,100) }}</el-tag>
        <span class="text">通道收入：</span>
        <el-tag type="warning">{{ mathDiv(orderSum.chIncome,100) }}</el-tag>
        <span class="text">通道代理收益：</span>
        <el-tag type="warning">{{ mathDiv(orderSum.catIncome,100) }}</el-tag>
      </div>
    </blockquote>
    <blockquote class="sum-blockquote">
      <div class="line-head">
        <h1>提现统计</h1>
        <el-date-picker v-model="drawTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"/>
        <el-button size="mini" type="primary">确定</el-button>
      </div>
      <!--<div class="line-body" style="height: 30px">
        <span class="text">
          提现总额 = 到账总额 + 手续费&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;码商可提总额 = 码商库存 + D0收益 + D0代理奖金
        </span>
      </div>-->
      <div class="el-divider">
        <div class="el-divider-text">商户提现</div>
      </div>
      <div class="line-body">
        <span class="text">提现总额：</span>
        <el-tag>{{ mathDiv(mchDraw.totalAmount,100) }}</el-tag>
        <span class="text">到账总额：</span>
        <el-tag>{{ mathDiv(mchDraw.successAmount,100) }}</el-tag>
        <span class="text">手续费：</span>
        <el-tag type="info">{{ mathDiv(mchDraw.totalFee,100) }}</el-tag>
        <span class="text">剩余可提总额：</span>
        <el-tag type="success">{{ mathDiv(mchDraw.targetBalance,100) }}</el-tag>
      </div>
      <div class="el-divider">
        <div class="el-divider-text">商户代理提现</div>
      </div>
      <div class="line-body">
        <span class="text">提现总额：</span>
        <el-tag>{{ mathDiv(matDraw.totalAmount,100) }}</el-tag>
        <span class="text">到账总额：</span>
        <el-tag>{{ mathDiv(matDraw.successAmount,100) }}</el-tag>
        <span class="text">手续费：</span>
        <el-tag type="info">{{ mathDiv(matDraw.totalFee,100) }}</el-tag>
        <span class="text">剩余可提总额：</span>
        <el-tag type="success">{{ mathDiv(matDraw.targetBalance,100) }}</el-tag>
      </div>
      <div class="el-divider">
        <div class="el-divider-text">通道代理提现</div>
      </div>
      <div class="line-body">
        <span class="text">提现总额：</span>
        <el-tag>{{ mathDiv(catDraw.totalAmount,100) }}</el-tag>
        <span class="text">到账总额：</span>
        <el-tag>{{ mathDiv(catDraw.successAmount,100) }}</el-tag>
        <span class="text">手续费：</span>
        <el-tag type="info">{{ mathDiv(catDraw.totalFee,100) }}</el-tag>
        <span class="text">剩余可提总额：</span>
        <el-tag type="success">{{ mathDiv(catDraw.targetBalance,100) }}</el-tag>
      </div>
    </blockquote>
  </div>
</template>

<script>
import { isEmpty } from '@/utils/index'
import { getSysWallet } from '@/api/wallet-info'
import { getOrderSucSum } from '@/api/order-pay'
import { getDrawSucSum } from '@/api/order-draw'
import { mathAdd, mathMul, mathDiv } from '@/utils/math'
export default {
  data() {
    return {
      orderTime: null, drawTime: null, depositTime: null,
      orderSum: { successCount: 0, successAmount: 0, mchIncome: 0, sysProfit: 0, matIncome: 0, chIncome: 0, catIncome: 0 },
      mchDraw: { totalAmount: 0, successAmount: 0, targetBalance: 0, totalFee: 0 },
      matDraw: { totalAmount: 0, successAmount: 0, targetBalance: 0, totalFee: 0 },
      catDraw: { totalAmount: 0, successAmount: 0, targetBalance: 0, totalFee: 0 },
      sysBalance: 0
    }
  },
  created() {
    this.getWalletInfo()
    this.getOrderSum()
    this.getDrawSum()
  },
  methods: {
    isEmpty,
    mathAdd,
    mathDiv,
    mathMul,
    getWalletInfo() {
      getSysWallet().then(res => {
        this.sysBalance = res.info.balance
      })
    },
    getOrderSum() {
      let startTime = ''
      let endTime = ''
      if (!isEmpty(this.orderTime) && !isEmpty(this.orderTime[0])) {
        startTime = this.orderTime[0]
      }
      if (!isEmpty(this.orderTime) && !isEmpty(this.orderTime[1])) {
        endTime = this.orderTime[1]
      }
      getOrderSucSum(startTime, endTime).then(res => {
        this.orderSum = res.sum
      })
    },
    getDrawSum() {
      let startTime = ''
      let endTime = ''
      if (!isEmpty(this.drawTime) && !isEmpty(this.drawTime[0])) {
        startTime = this.drawTime[0]
      }
      if (!isEmpty(this.drawTime) && !isEmpty(this.drawTime[1])) {
        endTime = this.drawTime[1]
      }
      getDrawSucSum(startTime, endTime).then(res => {
        this.mchDraw = res.mchSum
        this.matDraw = res.matSum
        this.catDraw = res.catSum
      })
    }
  }
}
</script>

<style>
  .sum-blockquote .el-input__inner, .el-select-dropdown .el-select-dropdown__item{
    font-size: 12px;
    height: 28px;
    line-height: 28px;
  }
  .sum-blockquote .el-date-editor {
    width: 300px;float: left;margin-right: 20px;
  }
  .sum-blockquote .el-input__icon, .el-date-editor .el-range-input, .el-date-editor .el-range-separator{
    float: left;
    font-size: 12px;
    height: 26px;
    line-height: 26px;
  }
  .sum-blockquote .el-range-editor.el-input__inner{
    height: 28px;
    line-height: 28px;
    border: 1px solid #dcdfe6;
    color: #606266;
    padding: 0px 5px;
    font-size: 12px;
  }
  .sum-blockquote .el-date-editor .el-range__icon{
    margin-left: -5px;
  }
  .sum-blockquote .el-date-editor .el-range-input{
    width: 120px;
  }
  .sum-blockquote {
    width: 820px;
    margin: 0px 0px 24px;
    padding: 15px;
    line-height: 24px;
    border-left: 5px solid #409EFF;;
    border-radius: 0 2px 2px 0;
    background-color: #f2f2f2;
  }
  .sum-blockquote .line-head {
    height: 30px;
    line-height: 30px;
  }
  .sum-blockquote .line-head h1 {
    width: 300px;
    font-size: 18px;
    margin: 0px;
    float: left;
  }
  .sum-blockquote .line-body {
    height: 24px;
    line-height: 24px;
    margin-top: 20px;
  }
  .sum-blockquote .line-body span{
    float: left;
    height: 24px;
    line-height: 24px;
  }
  .sum-blockquote .text {
    color: #999;
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
  }

  .sum-blockquote span.el-tag {
    padding: 0 5px;
    margin-right: 15px;
    min-width: 80px;
  }
  .el-divider {
    background-color: #dcdfe6;
    position: relative;
    display: block;
    height: 1px;
    width: 100%;
    margin: 24px 0;
  }
  .el-divider-text {
    position: absolute;
    background-color: #f2f2f2;
    padding: 0 20px;
    font-weight: 500;
    color: #303133;
    font-size: 14px;
    left: 20px;
    transform: translateY(-50%);
  }
</style>
