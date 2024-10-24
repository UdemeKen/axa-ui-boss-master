<template>
  <div>
    <el-button size="mini" type="primary" @click="to">编辑</el-button>
    <eForm ref="form" :page-num="pageNum" :sup_this="sup_this"/>
  </div>
</template>
<script>
import eForm from './form'
import { isEmpty } from '@/utils/index'
import { mathMul, mathDiv } from '@/utils/math'

export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    pageNum: {
      type: Number,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  methods: {
    mathMul,
    mathDiv,
    to() {
      const _this = this.$refs.form
      _this.countryName = this.data.countryName
      _this.form = {
        id: this.data.id,
        countryCode: this.data.countryCode,
        idTypeArray: isEmpty(this.data.identityTypes) ? [] : this.data.identityTypes.split(','),
        venPayRate: mathMul(this.data.venPayRate, 100),
        venMinRate: mathMul(this.data.venMinRate, 100),
        venMinDeposit: mathDiv(this.data.venMinDeposit, 100),
        venMinRecharge: mathDiv(this.data.venMinRecharge, 100),
        venDrawSwitch: this.data.venDrawSwitch.toString(),
        venDrawMin: mathDiv(this.data.venDrawMin, 100),
        venDrawMax: mathDiv(this.data.venDrawMax, 100),
        venDrawDate: [this.data.venDrawStart, this.data.venDrawEnd],
        venDrawStart: this.data.venDrawStart,
        venDrawEnd: this.data.venDrawEnd,
        venDrawFee: mathDiv(this.data.venDrawFee, 100),
        mchDrawSwitch: this.data.mchDrawSwitch.toString(),
        mchDrawMin: mathDiv(this.data.mchDrawMin, 100),
        mchDrawMax: mathDiv(this.data.mchDrawMax, 100),
        mchDrawDate: [this.data.mchDrawStart, this.data.mchDrawEnd],
        mchDrawStart: this.data.mchDrawStart,
        mchDrawEnd: this.data.mchDrawEnd,
        mchDrawFee: mathDiv(this.data.mchDrawFee, 100),
        agentDrawSwitch: this.data.agentDrawSwitch.toString(),
        agentDrawMin: mathDiv(this.data.agentDrawMin, 100),
        agentDrawMax: mathDiv(this.data.agentDrawMax, 100),
        agentDrawDate: [this.data.agentDrawStart, this.data.agentDrawEnd],
        agentDrawStart: this.data.agentDrawStart,
        agentDrawEnd: this.data.agentDrawEnd,
        agentDrawFee: mathDiv(this.data.agentDrawFee, 100),
        cardInQuota: mathDiv(this.data.cardInQuota, 100),
        cardInAmount: mathDiv(this.data.cardInAmount, 100),
        cardInMinute: this.data.cardInMinute,
        cardOutQuota: mathDiv(this.data.cardOutQuota, 100),
        cardWarnAmount: mathDiv(this.data.cardWarnAmount, 100)
      }
      _this.dialog = true
    }
  }
}
</script>
