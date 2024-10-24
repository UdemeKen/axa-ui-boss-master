<template>
  <div class="head-container">
    <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
      <!-- 搜索 -->
      <el-select v-model="query.countryCode" filterable clearable placeholder="请选择国家" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option
          v-for="item in countryOptions"
          :key="item.code"
          :label="item.code +'-'+ item.name"
          :value="item.code"/>
      </el-select>
      <el-input v-model="query.orderNo" clearable placeholder="系统订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.methodCode" clearable filterable placeholder="支付方式" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in pmOptions" :key="item.code" :label="item.name +' - '+ item.code" :value="item.code"/>
      </el-select>
      <el-select v-model="query.channelId" clearable filterable placeholder="选择通道" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in pcOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="query.orderStatus" clearable placeholder="订单状态" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option label="支付失败" value="0"/>
        <el-option label="支付成功" value="1"/>
        <el-option label="支付未明" value="2"/>
        <el-option label="待审核" value="9"/>
      </el-select>
      <el-select v-model="query.orderType" clearable placeholder="订单类型" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option label="正常" value="0"/>
        <el-option label="测试" value="1"/>
        <el-option label="补单" value="2"/>
      </el-select>
      <el-select v-model="query.mchNotified" clearable placeholder="商户回调" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option label="失败" value="false"/>
        <el-option label="成功" value="true"/>
      </el-select>
      <el-date-picker v-model="query.createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="filter-item" style="width: 320px;" @change="toQuery"/>
      <br>
      <el-input v-model="query.outTradeNo" clearable placeholder="商户订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.mchId" clearable filterable placeholder="选择商户" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in mchOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="query.mchSettled" clearable placeholder="商户结算状态" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option label="已结算" value="true"/>
        <el-option label="未结算" value="false"/>
      </el-select>
      <el-select v-model="query.venId" clearable filterable placeholder="选择卡商" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id"/>
      </el-select>
      <el-select v-model="query.venSettled" clearable placeholder="卡商结算状态" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option label="已结算" value="true"/>
        <el-option label="未结算" value="false"/>
      </el-select>
      <el-select v-model="query.channelSettled" clearable placeholder="通道结算状态" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option label="已结算" value="true"/>
        <el-option label="未结算" value="false"/>
      </el-select>
      <el-select v-model="query.catSettled" clearable placeholder="通道代理结算" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option label="已结算" value="true"/>
        <el-option label="未结算" value="false"/>
      </el-select>
      <el-select v-model="query.matSettled" clearable placeholder="商户代理结算" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option label="已结算" value="true"/>
        <el-option label="未结算" value="false"/>
      </el-select>
      <el-select v-model="query.sysSettled" clearable placeholder="平台结算状态" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option label="已结算" value="true"/>
        <el-option label="未结算" value="false"/>
      </el-select>
      <el-select v-model="query.venBankCode" clearable filterable placeholder="代收银行" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in bankOptions" :key="item.code" :label="item.name" :value="item.code"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <el-button :loading="downloadLoading" class="filter-item" size="mini" type="success" icon="el-icon-download" @click="download">导出</el-button>
    </blockquote>
    <blockquote class="my-blockquote statistics" style="height: 90px">
      <div>
        <span class="text">订单总数：</span><el-tag>{{ statistics.totalCount }}</el-tag>
        <span class="text">成功单数：</span><el-tag type="success">{{ statistics.successCount }}</el-tag>
        <span class="text">失败单数：</span><el-tag type="info">{{ statistics.failCount }}</el-tag>
        <span class="text">单数成功率：</span><el-tag type="danger">{{ mathMul(statistics.numSucRate,100) }}%</el-tag>
        <el-button v-if="isAuth('trade:copy')" size="mini" type="primary" icon="el-icon-plus" style="float:right;" @click="toPad">手工补单</el-button>
      </div>
      <div style="margin-top: 10px">
        <span class="text">订单总额：</span><el-tag>{{ mathDiv(statistics.totalAmount,100) }}</el-tag>
        <span class="text">成功总额：</span><el-tag type="success">{{ mathDiv(statistics.successAmount,100) }}</el-tag>
        <span class="text">失败总额：</span><el-tag type="info">{{ mathDiv(statistics.failAmount,100) }}</el-tag>
        <span class="text">金额成功率：</span><el-tag type="danger">{{ mathMul(statistics.moneySucRate,100) }}%</el-tag>
        <span v-if="statistics.totalIncome > 0" class="text">平台利润：</span><el-tag v-if="statistics.totalIncome > 0" type="warning">{{ mathDiv(statistics.totalIncome,100) }}</el-tag>
      </div>
      <pad v-if="isAuth('trade:copy')" ref="form" :pm-options="pmOptions" :sup_this="sup_this"/>
    </blockquote>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { isEmpty } from '@/utils/index'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import countryOptions from '@/utils/country'
import pad from './pad'
import { mathMul, mathDiv } from '@/utils/math'
export default {
  components: { pad },
  props: {
    query: {
      type: Object,
      required: true
    },
    statistics: {
      type: Object,
      required: true
    },
    pageNum: {
      type: Number,
      required: true
    },
    mchOptions: {
      type: Array,
      required: true
    },
    venOptions: {
      type: Array,
      required: true
    },
    pmOptions: {
      type: Array,
      required: true
    },
    pcOptions: {
      type: Array,
      required: true
    },
    bankOptions: {
      type: Array,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false,
      downloadParam: {},
      countryOptions: countryOptions,
      enabledTypeOptions: [
        { key: 'true', display_name: '禁用' },
        { key: 'false', display_name: '启用' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'domainUrl'
    ])
  },
  methods: {
    isAuth,
    mathDiv,
    mathMul,
    toQuery() {
      this.$parent.page = 0
      this.$parent.init()
      this.$parent.getSum()
    },
    download() {
      this.downloadLoading = true
      const channelId = this.query.channelId
      const mchId = this.query.mchId
      const methodCode = this.query.methodCode
      const createTime = this.query.createTime
      if (!isEmpty(channelId)) {
        this.downloadParam['channelId'] = channelId
      }
      if (!isEmpty(mchId)) {
        this.downloadParam['mchId'] = mchId
      }
      if (!isEmpty(methodCode)) {
        this.downloadParam['methodCode'] = methodCode
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[0])) {
        this.downloadParam['startTime'] = createTime[0]
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[1])) {
        this.downloadParam['endTime'] = createTime[1]
      }
      this.downloadParam['Authorization'] = 'Bearer ' + getToken()
      // window.open(this.domainUrl + '/excel/pay/order?channelId=' + channelId + '&mchId=' + mchId + '&methodCode=' + methodCode + '&startTime=' + startTime + '&endTime=' + endTime, '_blank')
      this.openWindowWithPost(this.domainUrl + '/excel/pay/order', this.downloadParam)
      this.downloadLoading = false
    },
    openWindowWithPost(url, data) {
      var form = document.createElement('form')
      form.target = '_blank'
      form.method = 'POST'
      form.action = url
      form.style.display = 'none'

      for (var key in data) {
        var input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = data[key]
        form.appendChild(input)
      }
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    },
    toPad() {
      const _this = this.$refs.form
      _this.resetForm()
      _this.dialog = true
    }
  }
}
</script>
