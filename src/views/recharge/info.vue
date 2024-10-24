<template>
  <div class="app-container">
    <div class="order-container">
      <div class="order-header">
        <h3 style="margin: 0;float: left">充值单号：{{ info.transNo }}</h3>
        <el-tag v-if="info.transStatus == 0" type="warning" style="float: right;font-size: 14px">待审核</el-tag>
        <el-tag v-if="info.transStatus == 1" type="success" style="float: right;font-size: 14px">充值成功</el-tag>
        <el-tag v-if="info.transStatus == 2" type="danger" style="float: right;font-size: 14px">充值驳回</el-tag>
      </div>
      <div class="el-divider"/>

      <div class="order-line">
        <table style="width: 100%">
          <tr>
            <td style="width: 220px"><label>码&emsp;&emsp;商：</label>
              {{ info.traderName }}
            </td>
            <td style="width: 400px" colspan="2"><label>充值单号：</label>{{ info.transNo }}</td>
            <td style="width: 230px"><label>创建时间：</label>{{ info.createTime }}</td>
          </tr>
          <tr>
            <td style="width: 220px"><label>订单金额：</label><span class="number" style="color:#F56C6C">￥{{ mathDiv(info.orderAmount, 100) }}</span></td>
            <td style="width: 200px"><label>到账金额：</label><span class="number" style="color:#F29407">￥{{ mathDiv(info.actualAmount, 100) }}</span></td>
            <td style="width: 200px">
              <label>结算状态：</label>
              <span v-if="!info.settled" style="color:#F56C6C">未结算</span>
              <span v-if="info.settled" style="color: #42b983">已结算</span>
            </td>
            <td style="width: 230px"><label>结算时间：</label>{{ info.settledTime }}</td>
          </tr>
          <tr>
            <td colspan="4">
              <div class="el-divider"/>
            </td>
          </tr>
          <tr>
            <td><label>收款户名：</label>{{ info.payeeName }}</td>
            <td colspan="2"><label>收款银行：</label>{{ info.payeeBank }}</td>
            <td><label>收款卡号：</label>{{ info.payeeCard }}</td>
          </tr>
          <tr>
            <td><label>付款户名：</label>{{ info.payerName }}</td>
            <td colspan="2"><label>付款银行：</label>{{ info.payerBank }}</td>
            <td><label>付款卡号：</label>{{ info.payerCard }}</td>
          </tr>
          <tr>
            <td><label>审&nbsp;&nbsp;核&nbsp;&nbsp;人：</label><span>{{ info.auditorName }}</span></td>
            <td><label>审核备注：</label><span>{{ info.auditRemark }}</span></td>
            <td colspan="2">&nbsp;</td>
          </tr>
        </table>
      </div>

      <div v-if="isAuth('rechg:confirm') && info.rechargeStatus == 0" style="margin: 20px 0px;padding-top: 10px;border-top: 1px solid #dcdfe6;">
        <p>
          以实际到账金额为准
        </p>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="实际到账金额" prop="mchWithdrawLimit">
            <el-input v-model="form.actualAmount" clearable placeholder="金额最多2位小数" style="width: 200px">
              <template slot="append">元&#8195;</template>
            </el-input>
          </el-form-item>
          <el-form-item label="到账审核备注" prop="forfeit">
            <el-input v-model="form.remark" type="textarea" placeholder="备注长度 0-30" clearable style="width: 200px"/>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-popover
              v-model="confirmPopover"
              placement="top"
              width="180">
              <p>确定实际到账金额为：<br> <span style="color: red; font-size: 16px">{{ form.actualAmount }}</span></p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="confirmPopover = false">取消</el-button>
                <el-button :loading="loading" type="primary" size="mini" @click="confirmOrder">确定</el-button>
              </div>
              <el-button slot="reference" type="primary" @click="confirmPopover = true">确认无误提交</el-button>
            </el-popover>
          </el-form-item>
        </el-form>
      </div>
      <div class="el-divider"/>
      <div class="order-body">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>付款凭证</span>
          </div>
          <div style="min-height: 500px;">
            <img v-if="info.certificate" :src="info.certificate" style="max-width: 100%;" class="bill">
            <span v-else>还未上传凭证</span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import { isAuth } from '@/utils/auth'
import { mathMul, mathDiv } from '@/utils/math'
import { isEmpty } from '@/utils/index'
import { getByRechgNo, confirmRecharge } from '@/api/order-rechg'

export default {
  data() {
    return {
      confirmPopover: false, loading: false, info: { orderAmount: 0, actualAmount: 0 }, form: { transNo: null, actualAmount: null, remark: '' }
    }
  },
  created() {
    this.getRechargeInfo()
  },
  methods: {
    isAuth,
    mathMul,
    mathDiv,
    getRechargeInfo() {
      const transNo = this.$route.params.transNo
      this.form.transNo = transNo
      getByRechgNo({ orderNo: transNo }).then(res => {
        if (res.success) {
          this.info = res.data
          if (isEmpty(res.data.actualAmount) || res.info.actualAmount === 0) {
            this.form.actualAmount = mathDiv(res.info.orderAmount, 100)
          } else {
            this.form.actualAmount = mathDiv(res.info.actualAmount, 100)
          }
        }
      })
    },
    confirmOrder() {
      this.loading = true
      const param = Object.assign({}, this.form)
      param.actualAmount = mathMul(this.form.actualAmount, 100)
      confirmRecharge(param).then(res => {
        this.loading = false
        this.confirmPopover = false
        if (res.success) {
          this.$notify({
            title: '充值确认成功',
            type: 'success',
            duration: 2500
          })
          this.getDepositInfo()
        }
      }).catch(err => {
        this.loading = false
        this.confirmPopover = false
        console.log(err)
      })
    }
  }
}
</script>
<style>
  ul {
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

  .order-header {
    height: 30px;
    line-height: 30px;
  }

  .order-body {
    margin-top: 20px;
  }

  .el-divider {
    display: block;
    height: 1px;
    width: 100%;
    margin: 15px 0;
    background-color: #dcdfe6;
    position: relative;
  }

  .order-line {
    line-height: 30px;
  }

  .order-line label {
    font-weight: 400;
    width: 100px;
    display: inline-block;
  }

  .number {
    font-size: 18px;
    font-weight: 400;
  }

  .el-card {
    color: #5e6d82;
  }

  .el-card__header {
    padding: 12px 20px;
    line-height: 20px;
    background-color: #f4f4f5;
  }

  .el-card__body {
    padding: 10px 15px;
  }

  .bill {
    max-width: 80%;
  }
</style>
