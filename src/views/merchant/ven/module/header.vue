<template>
  <div class="head-container">
    <!--@click.native="changeCountry(item.code)"-->
    <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
      <el-select v-model="query.countryCode" filterable clearable placeholder="请选择国家" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option
          v-for="item in countryOptions"
          :key="item.code"
          :label="item.code +'-'+ item.name"
          :value="item.code"/>
      </el-select>
      <el-select v-model="query.methodCode" filterable clearable placeholder="支付方式" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in pmOptions" :key="item.code" :label="item.name +' - '+ item.code" :value="item.code"/>
      </el-select>
      <el-select v-model="query.mchId" filterable clearable placeholder="选择商户" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in mchOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id"/>
      </el-select>
      <el-select v-model="query.venId" clearable filterable placeholder="选择卡商" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px; float:right">
        <el-button
          v-if="isAuth('mch:ven:add')"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="$refs.form.dialog = true">新指定卡商</el-button>
        <el-button v-if="isAuth('mch:ven:delete')" :disabled="this.$parent.selections.length <= 0" class="filter-item" size="mini" type="danger" icon="el-icon-delete" @click="disabledHandle(true)">批量删除</el-button>
        <eForm ref="form" :mch-options="mchOptions" :page-num="pageNum" :is-add="true"/>
      </div>
    </blockquote>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { removeMv } from '@/api/mch-pm'
/* import { getPmOptions } from '@/api/payment' */
import countryOptions from '@/utils/country'
import eForm from './form'
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
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
    pageNum: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      countryOptions: countryOptions,
      disabledOptions: [
        { key: 'true', name: '禁用' },
        { key: 'false', name: '启用' }
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
      const ids = this.$parent.selections.map(item => { return item.id })
      const names = this.$parent.selections.map(item => { return item.venName })
      this.$confirm(`确定删除指定的卡商【 ${names.join('，')} 】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { 'idList': ids, 'disabled': dis }
        removeMv(data).then(res => {
          this.$notify({
            title: '删除成功',
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
    changeCountry(code) {
      /* getPmOptions({ countryCode: code, disabled: false, paySwitch: true }).then(res => {
        this.pmOptions = res.data
      }) */
    }
  }
}
</script>
