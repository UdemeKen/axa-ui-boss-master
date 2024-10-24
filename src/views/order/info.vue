<template>
  <div class="app-container">
    <div v-if="info.orderNo" class="order-container">
      <div class="order-header">
        <h3 style="margin: 0;margin-right:15px;float: left">平台单号：{{ info.orderNo }}</h3>
        <el-tag v-if="info.orderStatus == 0" type="danger">未支付</el-tag>
        <el-tag v-if="info.orderStatus == 1" type="success">支付成功</el-tag>
        <el-tag v-if="info.orderStatus == 2" type="info">已关闭</el-tag>
        <el-tag v-if="info.orderStatus == 9" type="warning">待审核</el-tag>
        <span v-if="info.orderType == 2" style="color: #E6A23C">&emsp;补单</span>
        &emsp;<b style="color: #409EFF">{{ info.methodName }}</b>
        <H2 style="margin: 0;float:right">{{ info.countryCode }} - {{ info.countryName }}</H2>
        <br>
      </div>
      <div class="el-divider"/>

      <div class="order-line">
        <table style="width: 100%">
          <tr>
            <td style="width: 40%"><label>订单日期：</label> {{ info.createTime }}</td>
            <td style="width: 30%"><label>订单金额：</label>
              <span v-if="info.actualAmount>0 && info.actualAmount!=info.orderAmount">
                ￥<s>{{ mathDiv(info.orderAmount, 100) }}</s> <span class="number" style="color:#F56C6C">{{ mathDiv(info.actualAmount, 100) }}</span>
              </span>
              <span v-else class="number" style="color:#F56C6C">
                ￥{{ mathDiv(info.orderAmount, 100) }}
              </span>
            </td>
            <td style="width: 30%"><label>订单成功时间：</label> {{ info.successTime }}</td>
          </tr>
          <tr>
            <td><label>平台收益：</label> <span class="number" style="color:#F56C6C">￥{{ mathDiv(info.sysIncome, 100) }}</span></td>
            <td><label>平台结算状态：</label> <span v-if="info.sysSettled" style="color: #67C23A">已结算</span><span v-else style="color: red">待结算</span></td>
            <td><label>平台结算时间：</label> {{ info.sysSettledTime }}{{ info.createTime }}</td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="el-divider"/>
            </td>
          </tr>
          <tr>
            <td><label>商&emsp;&emsp;户：</label> {{ info.mchName }}</td>
            <td><label>商户费率：</label> {{ mathMul(info.mchRate, 100) }}%</td>
            <td><label>商户收入：</label> <span class="number" style="color:#F56C6C">￥{{ mathDiv(info.mchIncome, 100) }}</span></td>
          </tr>
          <tr>
            <td><label>商户单号：</label><b>{{ info.outTradeNo }}</b></td>
            <td><label>商户结算状态：</label> <span v-if="info.mchSettled" style="color: #67C23A">已结算</span><span v-else style="color: red">待结算</span></td>
            <td><label>商户结算时间：</label> {{ info.mchSettledTime }}</td>
          </tr>
          <tr>
            <td style="max-width: 460px;"><label>商户回调地址：</label> {{ info.mchNotifyUrl }}</td>
            <td><label>商户回调状态：</label> <span v-if="info.mchNotified">回调成功</span><span v-else style="color: red">回调失败</span></td>
            <td><label>商户回调时间：</label> {{ info.mchNotifyTime }}</td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="el-divider"/>
            </td>
          </tr>
          <tr>
            <td><label>通&emsp;&emsp;道：</label>{{ info.channelName }}</td>
            <td><label>通道费率：</label> {{ mathMul(info.channelRate, 100) }}%</td>
            <td><label>通道收益：</label> <span class="number" style="color:#F56C6C">￥{{ mathDiv(info.channelIncome, 100) }}</span></td>
          </tr>
          <tr>
            <td><label>结算类型：</label>{{ info.channelSettleType==0?"D0T0":"D1T1" }}</td>
            <td><label>通道结算状态：</label> <span v-if="info.channelSettled" style="color: #67C23A">已结算</span><span v-else style="color: red">待结算</span></td>
            <td><label>通道结算时间：</label> {{ info.channelSettledTime }}</td>
          </tr>
          <tr>
            <td><label>通道流水号：</label>{{ info.channelOrderNo }}</td>
            <td><label>通道回调状态：</label> <span v-if="info.channelNotified">回调成功</span><span v-else style="color: red">回调失败</span></td>
            <td><label>通道回调时间：</label> {{ info.channelNotifyTime }}</td>
          </tr>
        </table>
        <table style="width: 100%">
          <tr>
            <td colspan="3">
              <div class="el-divider"/>
            </td>
          </tr>
          <tr>
            <td style="width: 40%"><label>商户代理：</label><span v-if="info.matId>0">{{ info.matName }}</span><span v-else style="color:#979A9A">无商户代理</span></td>
            <td style="width: 30%"><label>商户代理费率：</label> {{ mathMul(info.matRate, 100) }}%</td>
            <td style="width: 30%"><label>商户代理收益：</label> <span class="number" style="color:#F56C6C">￥{{ mathDiv(info.matIncome, 100) }}</span></td>
          </tr>
          <tr>
            <td><label>结算类型：</label>{{ info.matSettleType==0?"D0T0":"D1T1" }}</td>
            <td><label>代理结算状态：</label> <span v-if="info.matSettled" style="color: #67C23A">已结算</span><span v-else style="color: red">待结算</span></td>
            <td><label>代理结算时间：</label> {{ info.matSettledTime }}</td>
          </tr>
        </table>
        <table style="width: 100%">
          <tr>
            <td colspan="3">
              <div class="el-divider"/>
            </td>
          </tr>
          <tr>
            <td style="width: 40%"><label>通道代理：</label> <span v-if="info.catId>0">{{ info.catName }}</span><span v-else style="color:#979A9A">无通道代理</span></td>
            <td style="width: 30%"><label>通道代理费率：</label> {{ mathMul(info.catRate, 100) }}%</td>
            <td style="width: 30%"><label>通道代理收益：</label> <span class="number" style="color:#F56C6C">￥{{ mathDiv(info.catIncome, 100) }}</span></td>
          </tr>
          <tr>
            <td><label>结算类型：</label>{{ info.catSettleType==0?"D0T0":"D1T1" }}</td>
            <td><label>代理结算状态：</label> <span v-if="info.catSettled" style="color: #67C23A">已结算</span><span v-else style="color: red">待结算</span></td>
            <td><label>代理结算时间：</label> {{ info.catSettledTime }}</td>
          </tr>
        </table>
        <table style="width: 100%">
          <tr>
            <td colspan="3">
              <div class="el-divider"/>
            </td>
          </tr>
          <tr>
            <td style="width: 40%"><label>卡&emsp;&emsp;商：</label>{{ info.venName }}&emsp;&emsp;<span v-if="info.venSettleMethod==0">流水分润</span><span v-else style="color:#979A9A">固定工资</span></td>
            <td style="width: 30%"><label>卡商费率：</label> {{ mathMul(info.venRate, 100) }}%</td>
            <td style="width: 30%"><label>卡商收益：</label> <span class="number" style="color:#F56C6C">￥{{ mathDiv(info.venIncome, 100) }}</span></td>
          </tr>
          <tr>
            <td><label>结算类型：</label>{{ info.venProfitSt==0?"D0T0":"D1T1" }}</td>
            <td><label>卡商结算状态：</label> <span v-if="info.venSettled" style="color: #67C23A">已结算</span><span v-else style="color: red">待结算</span></td>
            <td><label>卡商结算时间：</label> {{ info.venSettledTime }}</td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="el-divider"/>
            </td>
          </tr>
          <tr>
            <td colspan="2"><span>卡商所有上级收单奖金</span></td>
            <td><label>上级总奖金：</label> <span class="number" style="color:#F56C6C">￥{{ mathDiv(info.vatTotalIncome, 100) }}</span></td>
          </tr>
          <tr>
            <td><label>结算类型：</label> D1 </td>
            <td><label>奖金结算状态：</label> <span v-if="info.vatSettled" style="color: #67C23A">已结算</span><span v-else style="color: red">待结算</span></td>
            <td><label>奖金结算时间：</label> {{ info.vatSettledTime }}</td>
          </tr>
        </table>

        <el-table :data="info.otvList" size="small" border style="width: 100%;margin:20px 0;">
          <el-table-column :show-overflow-tooltip="true" prop="levelNum" label="层级" width="105px"/>
          <el-table-column :show-overflow-tooltip="true" prop="parentName" label="卡商上级" width="150px"/>
          <el-table-column :show-overflow-tooltip="true" label="签约费率" width="200px">
            <template slot-scope="scope">
              <span>
                {{ mathMul(scope.row.payRate, 100) }}%
              </span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="奖金费率" width="200px">
            <template slot-scope="scope">
              <span>
                {{ mathMul(scope.row.bonusRate, 100) }}%
              </span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="奖金(元)" width="200px">
            <template slot-scope="scope">
              <span>
                {{ mathDiv(scope.row.bonusIncome, 100) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="结算状态" align="center" width="94px">
            <template slot-scope="scope">
              <span v-if="scope.row.bonusSettled" style="color: #67C23A">已结算</span>
              <span v-else style="color:red;">未结算</span>
            </template>
          </el-table-column>
        </el-table>

      </div>

      <div v-if="isAuth('trade:audit')&&(info.orderStatus == 0 || info.orderStatus == 9)" style="margin: 20px 0px;padding-top: 20px;border-top: 1px solid #dcdfe6;">
        <p>
          如果上游通道返回差额过大，需由客服裁定最终结果，差额超过 500 需再次确认；订单超时情况下由客服直接确认
        </p>
        <el-form ref="form" :model="form">
          <el-form-item label="订单金额" prop="mchWithdrawLimit">
            <el-input v-model="form.actualAmount" clearable placeholder="金额最多2位小数" style="width: 200px">
              <template slot="append">元&#8195;</template>
            </el-input>
            &emsp;&emsp;<el-button :loading="loading" type="primary" @click="confirmOrder">确认无误提交</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="notify-table" style="margin: 20px 0px;padding-top: 20px;border-top: 1px solid #dcdfe6;">
        <el-table v-loading="loading" :data="notifyList" size="small" border style="width: 100%;">
          <el-table-column show-overflow-tooltip prop="notifyUrl" label="回调地址" min-width="140px" style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"/>
          <el-table-column label="回调参数" width="300px">
            <template slot-scope="scope">
              <el-popover
                :content="scope.row.notifyJson"
                placement="top-start"
                width="600"
                trigger="click"
                style="word-break: break-all;word-wrap: break-word;">
                <a slot="reference">{{ scope.row.notifyJson }}</a>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="商户返回" width="180px">
            <template slot-scope="scope">
              <el-popover
                :content="scope.row.notifyResult"
                placement="top-start"
                width="600"
                trigger="click"
                style="word-break: break-all;word-wrap: break-word;">
                <a slot="reference">{{ scope.row.notifyResult }}</a>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="回调状态" align="center" width="100px">
            <template slot-scope="scope">
              <span v-if="scope.row.notifyStatus" style="color: #67C23A">成功</span>
              <span v-else style="color: #F56C6C">返回值有误</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="回调日期" width="135px"/>
        </el-table>
      </div>
    </div>
    <h4 v-else>订单不存在</h4>
  </div>
</template>
<script>
import { isAuth } from '@/utils/auth'
import { getByOrderNo, auditOrder } from '@/api/order-pay'
import { mathMul, mathDiv } from '@/utils/math'
import { isEmpty } from '@/utils/index'
export default {
  data() {
    return {
      info: {}, loading: false, notifyList: [], form: { orderNo: null, actualAmount: null, deduct: 'false', remark: null }
    }
  },
  created() {
    this.$nextTick(() => {
      this.getOrderInfo()
    })
  },
  methods: {
    isAuth,
    mathMul,
    mathDiv,
    getOrderInfo() {
      const orderNo = this.$route.params.orderNo
      this.form.orderNo = orderNo
      getByOrderNo({ orderNo: orderNo }).then(res => {
        if (res.success) {
          this.info = res.data
          if (isEmpty(res.data.actualAmount) || res.data.actualAmount === 0) {
            this.form.actualAmount = mathDiv(res.data.orderAmount, 100)
          } else {
            this.form.actualAmount = mathDiv(res.data.actualAmount, 100)
          }
        }
      })
    },
    confirmOrder() {
      this.loading = true
      auditOrder({ orderNo: this.form.orderNo, actualAmount: mathMul(this.form.actualAmount, 100) }).then(res => {
        this.loading = false
        if (res.success) {
          this.$notify({
            title: '订单已确认',
            type: 'success',
            duration: 2500
          })
          this.getOrderInfo()
        }
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    }
  }
}
</script>
<style>
  ul{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .order-container {
    width: 1000px;
    padding: 24px;
    margin: 10px 20px;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
    overflow: hidden;
    color: #777;
    font-size: 14px;
  }
  .order-header{
    height: 30px;line-height: 30px;
  }
  .el-divider {
    display: block;
    height: 1px;
    width: 100%;
    margin: 15px 0;
    background-color: #dcdfe6;
    position: relative;
  }
  .order-line{
    line-height: 24px;
  }
  .order-line ul li{
    float: left; width: 232px;
  }
  .order-line p{
    margin-bottom: 0;padding-bottom: 0;
  }
  .order-line label {
    font-weight: 400;
    width: 100px;
    display: inline-block;
  }
  .number{
    font-size:18px;font-weight:400;
  }
  .el-tag{
    height: 24px;
    line-height: 24px;
  }
  .notify-table .el-table .cell{
    height: 24px;
    line-height: 24px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .el-popper{
    word-break: break-all;word-wrap: break-word;
  }
</style>
