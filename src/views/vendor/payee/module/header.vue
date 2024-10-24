<template>
  <div class="head-container">
    <!-- 搜索 -->
    <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
      <el-select v-model="query.countryCode" filterable clearable placeholder="请选择国家" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option
          v-for="item in countryOptions"
          :key="item.code"
          :label="item.code +'-'+ item.name"
          :value="item.code"/>
      </el-select>
      <el-select v-model="query.venId" clearable filterable placeholder="选择卡商" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id" @click.native="changeVendor(item.code)"/>
      </el-select>
      <el-select v-model="query.methodCode" filterable clearable placeholder="支付方式" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in pmOptions" :key="item.code" :label="item.name +' - '+ item.code" :value="item.code"/>
      </el-select>
      <el-input v-model="query.payeeKey" clearable placeholder="收款账户" style="width: 120px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.paySwitch" clearable placeholder="支付开关" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option v-for="item in switchOptions" :key="item.key" :label="item.name" :value="item.key"/>
      </el-select>
      <el-select v-model="query.midSwitch" clearable placeholder="中转开关" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option v-for="item in switchOptions" :key="item.key" :label="item.name" :value="item.key"/>
      </el-select>
      <el-select v-model="query.drawSwitch" clearable placeholder="代付开关" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option v-for="item in switchOptions" :key="item.key" :label="item.name" :value="item.key"/>
      </el-select>
      <el-select v-model="query.auditStatus" clearable placeholder="审核" class="filter-item" style="width: 80px" @change="toQuery">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px; float:right">
        <el-button
          v-if="isAuth('vpe:add')"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="$refs.form.dialog = true">新增收款账户</el-button>
        <el-button v-if="isAuth('vpe:disabled')" :disabled="this.$parent.selections.length <= 0" class="filter-item" size="mini" type="warning" icon="el-icon-view" @click="disabledHandle(true)">批量禁用</el-button>
        <el-button v-if="isAuth('vpe:disabled')" :disabled="this.$parent.selections.length <= 0" class="filter-item" size="mini" type="success" icon="el-icon-view" @click="disabledHandle(false)">批量启用</el-button>
        <eForm ref="form" :ven-options="venOptions" :bank-options="bankOptions" :pm-options="pmOptions" :page-num="pageNum" :is-add="true"/>
      </div>
    </blockquote>
    <blockquote class="my-blockquote statistics">
      <div>
        <span class="text">在线设备数：</span><el-tag>{{ onlineCount }}</el-tag>&emsp;&emsp;&emsp;<span class="text">银行为绿色代表支持自定义订单号</span>
      </div>
    </blockquote>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { disVenPayee } from '@/api/ven-payee'
import { getPmOptions } from '@/api/payment'
import countryOptions from '@/utils/country'
import eForm from './form'
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
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
    bankOptions: {
      type: Array,
      required: true
    },
    devices: {
      type: Array,
      required: true
    },
    pageNum: {
      type: Number,
      required: true
    },
    onlineCount: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      countryOptions: countryOptions,
      switchOptions: [
        { key: 'true', name: '开启' },
        { key: 'false', name: '关闭' }
      ],
      statusOptions: [
        { key: '0', name: '待审' },
        { key: '1', name: '通过' },
        { key: '2', name: '驳回' }
      ]
    }
  },
  methods: {
    isAuth,
    toQuery() {
      this.$parent.page = 0
      this.$parent.init()
    },
    disabledHandle(dis) {
      const title = dis ? '禁用' : '启用'
      const ids = this.$parent.selections.map(item => { return item.id })
      const names = this.$parent.selections.map(item => { return item.payeeOwner })
      this.$confirm(`确定对【 ${names.join('，')} 】进行【 ${title} 】操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { 'idList': ids, 'disabled': dis }
        disVenPayee(data).then(res => {
          this.$notify({
            title: title + '成功',
            type: 'success',
            duration: 2500
          })
          this.$parent.page = this.pageNum
          this.$parent.init()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {})
    },
    changeVendor(code) {
      getPmOptions({ countryCode: code, disabled: false, drawSwitch: true }).then(res => {
        this.pmOptions = res.data
      })
    }
  }
}
</script>
