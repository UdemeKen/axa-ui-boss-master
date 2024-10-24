<template>
  <div class="head-container">
    <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
      <!-- 搜索 -->
      <el-input v-model="query.rechargeNo" clearable placeholder="请输入充值单号" style="width: 185px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-input v-model="query.drawNo" clearable placeholder="请输入提现单号" style="width: 185px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.traderId" clearable filterable placeholder="请选择码商" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id"/>
      </el-select>
      <el-select v-model="query.rechargeStatus" clearable placeholder="订单状态" class="filter-item" style="width: 100px" @change="toQuery">
        <el-option label="待核" value="0"/>
        <el-option label="通过" value="1"/>
        <el-option label="驳回" value="2"/>
        <el-option label="待转账" value="9"/>
      </el-select>
      <el-select v-model="query.settled" clearable placeholder="结算状态" class="filter-item" style="width: 100px" @change="toQuery">
        <el-option label="已结算" value="true"/>
        <el-option label="未结算" value="false"/>
      </el-select>
      <el-select v-model="query.targetSettled" clearable placeholder="提现结算" class="filter-item" style="width: 100px" @change="toQuery">
        <el-option label="已结算" value="true"/>
        <el-option label="未结算" value="false"/>
      </el-select>
      <el-select v-model="query.hadPayee" clearable placeholder="分配收款账号" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option label="已分配" value="true"/>
        <el-option label="未分配" value="false"/>
      </el-select>
      <el-date-picker v-model="query.createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="filter-item" style="width: 330px;" @change="toQuery"/>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <el-button :loading="downloadLoading" class="filter-item" size="mini" type="success" icon="el-icon-download" @click="download">导出</el-button>
    </blockquote>
    <blockquote class="my-blockquote statistics">
      <div>
        <span class="text">订单总数：</span><el-tag>{{ statistics.totalCount }}0</el-tag>
        <span class="text">成功单数：</span><el-tag type="success">{{ statistics.successCount }}0</el-tag>
        <span class="text">充值总额：</span><el-tag type="info">{{ mathDiv(statistics.totalAmount,100) }}</el-tag>
        <span class="text">成功到账总额：</span><el-tag type="danger">{{ mathDiv(statistics.successAmount,100) }}</el-tag>
      </div>
    </blockquote>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { isEmpty } from '@/utils/index'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import { mathMul, mathDiv } from '@/utils/math'
// 查询条件
export default {
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
    venOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false,
      downloadParam: {},
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
      const traderId = this.query.traderId
      const createTime = this.query.createTime
      if (!isEmpty(traderId)) {
        this.downloadParam['traderId'] = traderId
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[0])) {
        this.downloadParam['startTime'] = createTime[0]
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[1])) {
        this.downloadParam['endTime'] = createTime[1]
      }
      this.downloadParam['Authorization'] = 'Bearer ' + getToken()
      this.openWindowWithPost(this.domainUrl + '/excel/deposit', this.downloadParam)
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
    }
  }
}
</script>
<style>
  .head-container .el-input__inner, .el-select-dropdown .el-select-dropdown__item{
    font-size: 12px;
    height: 28px;
    line-height: 28px;
  }
  .head-container .el-input__icon, .el-date-editor .el-range-input, .el-date-editor .el-range-separator{
    float: left;
    font-size: 12px;
    height: 26px;
    line-height: 26px;
  }
  .head-container .el-range-editor.el-input__inner{
    height: 28px;
    line-height: 28px;
    border: 1px solid #dcdfe6;
    color: #606266;
    padding: 0px 10px;
    font-size: 12px;
  }
  .my-blockquote{
    margin: 0px 0px 10px;
    padding: 15px;
    line-height: 24px;
    border-left: 5px solid #409EFF;;
    border-radius: 0 2px 2px 0;
    background-color: #f2f2f2;
  }
  .my-blockquote .filter-item{
    margin-right: 5px;
  }
  .my-blockquote.statistics .text{
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    height: 24px;
    line-height: 24px;
  }
  .my-blockquote.statistics span.el-tag{
    height: 24px;
    padding: 0 5px;
    line-height: 24px;
    margin-right: 10px;
    min-width: 80px;
  }
  .my-blockquote .text{
    color: #999;
  }
</style>
