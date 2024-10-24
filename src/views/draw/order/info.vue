<template>
  <div class="app-container">
    <div v-if="info.transNo" class="order-container">
      <div class="order-header">
        <h3 style="margin: 0;margin-right:15px;float: left">平台单号：{{ info.transNo }}</h3>
        <el-tag v-if="info.transStatus == 0" type="warning">等待审核</el-tag>
        <el-tag v-if="info.transStatus == 1" type="success">提现成功</el-tag>
        <el-tag v-if="info.transStatus == 2" type="danger">提现驳回</el-tag>
        <el-tag v-if="info.transStatus == 3" type="primary">提现受理</el-tag>
        <span v-if="info.targetFrozen" style="color: #42b983">&emsp;金额已冻结</span>
        &emsp;<b style="color: #409EFF">{{ info.methodName }}</b>
        <H2 style="margin: 0;float:right">{{ info.countryCode }} - {{ info.countryName }}</H2>
      </div>
      <div class="el-divider"/>

      <div class="order-line">
        <table style="width: 100%">
          <tr>
            <td style="width: 40%"><label>订单日期：</label> {{ info.createTime }}</td>
            <td style="width: 30%"><label>订单金额：</label>
              <span v-if="info.actualAmount>0 && info.actualAmount!=info.orderAmount">
                <s>{{ mathDiv(info.orderAmount, 100) }}</s> <span class="number" style="color:#F56C6C">{{ mathDiv(info.actualAmount, 100) }}</span>
              </span>
              <span v-else class="number" style="color:#F56C6C">
                {{ mathDiv(info.orderAmount, 100) }}
              </span>
            </td>
            <td style="width: 30%"><label>订单成功时间：</label> {{ info.successTime }}</td>
          </tr>
          <tr>
            <td><label>平台收益：</label> <span class="number" style="color:#F56C6C">{{ mathDiv(info.sysIncome, 100) }}</span></td>
            <td><label>平台结算状态：</label> <span v-if="info.sysSettled" style="color: #67C23A">已结算</span><span v-else style="color: red">待结算</span></td>
            <td><label>平台结算时间：</label> {{ info.sysSettledTime }}{{ info.createTime }}</td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="el-divider"/>
            </td>
          </tr>
          <tr>
            <td><b>提现账户</b></td>
            <td v-if="info.transType == 0" colspan="2"><label>身份标识：</label> <span>{{ info.payeeIdentityType }}&emsp;-&emsp;{{ info.payeeIdentity }}</span></td>
            <td v-if="info.transType == 1" colspan="2"><label>TRX地址：</label>
              <span style="color: #409EFF">{{ info.payeeBankAccount }}</span>
            </td>
          </tr>
          <tr v-if="info.transType == 0">
            <td><label>开户银行：</label> <span>{{ formatBankName(info.payeeBankCode) }}</span></td>
            <td><label>银行户名：</label> <span>{{ info.payeeBankOwner }}</span></td>
            <td><label>银行账号：</label> <span>{{ info.payeeBankAccount }}</span></td>
          </tr>
          <tr v-if="info.transType == 1">
            <td><label>USDT汇率：</label> {{ formatNum(info.usdRate, 4) }}</td>
            <td colspan="2"><label>USDT数量：</label> <span class="number" style="color:#F56C6C">{{ formatNum(info.usd) }} u</span></td>
          </tr>
          <tr>
            <td colspan="3">&nbsp;</td>
          </tr>
          <tr>
            <td><label>提&ensp;现&ensp;人：</label>
              <span>{{ info.targetName }}</span>&emsp;
              <span v-if="info.targetType == 1" style="color: #409EFF">(商户)</span>
              <span v-if="info.targetType == 5" style="color: #FF8700">(卡商)</span>
              <span v-if="info.targetType == 2" style="color: #E6A23C">(商户代理)</span>
              <span v-if="info.targetType == 4" style="color: #E6A23C">(通道代理)</span>
            </td>
            <td><label>提现费率：</label> {{ mathMul(info.drawRate, 100) }}%</td>
            <td><label>提现费用：</label> <span class="number" style="color:#F56C6C">{{ formatNum(mathDiv(info.drawFee, 100)) }}</span></td>
          </tr>
          <tr>
            <td><label>提现单号：</label><b>{{ info.outTransNo }}</b></td>
            <td><label>结算状态：</label> <span v-if="info.targetSettled" style="color: #67C23A">已结算</span><span v-else style="color: red">待结算</span></td>
            <td><label>结算时间：</label>{{ info.targetSettledTime }}</td>
          </tr>
          <tr v-if="info.targetType==1">
            <td><label>回调地址：</label> {{ info.targetNotifyUrl }}</td>
            <td><label>回调状态：</label> <span v-if="info.targetNotified">回调成功</span><span v-else style="color: red">回调失败</span></td>
            <td><label>回调时间：</label> {{ info.targetNotifyTime }}</td>
          </tr>
        </table>
        <table v-if="info.transType == 0" style="width: 100%">
          <tr>
            <td colspan="3">
              <div class="el-divider"/>
            </td>
          </tr>
          <tr>
            <td style="width: 40%"><label>代付通道：</label>{{ info.channelName }}</td>
            <td style="width: 30%"><label>通道费率：</label> {{ mathMul(info.channelRate, 100) }}%</td>
            <td style="width: 30%"><label>通道收益：</label> <span class="number" style="color:#F56C6C">{{ mathDiv(info.channelIncome, 100) }}</span></td>
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
          <tr>
            <td colspan="3">
              <div class="el-divider"/>
            </td>
          </tr>
          <tr>
            <td style="width: 40%"><label>代付卡商：</label>{{ info.venName }}&emsp;&emsp;<span v-if="info.venSettleMethod==0">流水分润</span><span v-else style="color:#979A9A">固定工资</span></td>
            <td style="width: 30%"><label>卡商费率：</label> {{ mathMul(info.venRate, 100) }}%</td>
            <td style="width: 30%"><label>卡商收益：</label> <span class="number" style="color:#F56C6C">{{ mathDiv(info.venIncome, 100) }}</span></td>
          </tr>
          <tr>
            <td><label>结算类型：</label>{{ info.venProfitSt==0?"D0T0":"D1T1" }}</td>
            <td><label>卡商结算状态：</label> <span v-if="info.venSettled" style="color: #67C23A">已结算</span><span v-else style="color: red">待结算</span></td>
            <td><label>卡商结算时间：</label> {{ info.venSettledTime }}</td>
          </tr>
          <tr>
            <td colspan="3">&nbsp;</td>
          </tr>
          <tr>
            <td><b>代付账户信息</b></td>
            <td><label>身份标识：</label> <span>{{ info.venIdentityType }}</span></td>
            <td><label>身份标识码：</label> {{ info.venIdentity }}</td>
          </tr>
          <tr>
            <td><label>开户银行：</label> <span>{{ formatBankName(info.venBankCode) }}</span></td>
            <td><label>银行户名：</label> <span>{{ info.venPayeeOwner }}</span></td>
            <td><label>银行账号：</label> <span>{{ info.venPayeeKey }}</span></td>
          </tr>
          <tr>
            <td colspan="3">
              <label>设备ID：</label> <span>{{ info.deviceId }}</span>
            </td>
          </tr>
        </table>

      </div>
      <el-form ref="form" :model="form">
        <el-form-item label="usd汇率">
          <el-input v-model="form.usdRate" clearable placeholder="金额最多4位小数" style="width: 200px">
            <template slot="append">$&#8195;</template>
          </el-input>
          &emsp;&emsp;<el-button :loading="loading" type="primary" @click="adjustUsdRate">确认调整USD汇率</el-button>
        </el-form-item>
      </el-form>
    </div>
    <h4 v-else>提现单不存在</h4>
  </div>
</template>
<script>
import { isAuth } from '@/utils/auth'
import { isEmpty } from '@/utils/index'
import { mathMul, mathDiv, formatNum } from '@/utils/math'
import { getByDrawNo,adjustUsdRate } from '@/api/order-draw'
import { getBankOptions } from '@/api/payment'
export default {
  data() {
    return {
      loading: false, info: {}, bankOptions: [],form: { orderNo: null, usdRate: null }
    }
  },
  created() {
    this.$nextTick(() => {
      this.getDrawInfo()
    })
  },
  methods: {
    isAuth,
    mathMul,
    mathDiv,
    formatNum,
    getDrawInfo() {
      const transNo = this.$route.params.transNo
      this.form.orderNo = transNo
      getByDrawNo({ orderNo: transNo }).then(res => {
        if (res.success) {
          this.info = res.data
          this.form.usdRate = res.data.usdRate
        }
      })
      this.loadOptions(this.info.countryCode)
    },
    loadOptions(countryCode) {
      getBankOptions(countryCode, null).then(res => {
        this.bankOptions = res.data
      })
    },
    formatBankName(bankCode) {
      if (isEmpty(bankCode)) {
        return ''
      }
      if (bankCode === 'USD001') {
        return 'USDT'
      }
      if (bankCode === '000000') {
        return ''
      }
      for (let i = 0; i < this.bankOptions.length; i++) {
        if (this.bankOptions[i].code === bankCode) {
          return this.bankOptions[i].name
        }
      }
      return bankCode
    },
    adjustUsdRate() {
      this.loading = true
      adjustUsdRate({ orderNo: this.form.orderNo, usdRate: this.form.usdRate }).then(res => {
        this.loading = false
        if (res.success) {
          this.$notify({
            title: 'usd汇率已调整',
            type: 'success',
            duration: 2500
          })
          this.getDrawInfo()
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
