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
      <el-select v-model="query.channelId" filterable clearable placeholder="支付通道" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in pcOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="query.methodCode" filterable clearable placeholder="支付方式" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in pmOptions" :key="item.code" :label="item.name +' - '+ item.code" :value="item.code"/>
      </el-select>
      <el-select v-model="query.disabled" clearable placeholder="状态" class="filter-item" style="width: 80px" @change="toQuery">
        <el-option v-for="item in disabledOptions" :key="item.key" :label="item.name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px; float:right">
        <el-button
          v-if="isAuth('pcm:add')"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="$refs.form.dialog = true">新增通道配置</el-button>
        <el-button v-if="isAuth('pcm:disabled')" :disabled="this.$parent.selections.length <= 0" class="filter-item" size="mini" type="warning" icon="el-icon-view" @click="disabledHandle(true)">批量禁用</el-button>
        <el-button v-if="isAuth('pcm:disabled')" :disabled="this.$parent.selections.length <= 0" class="filter-item" size="mini" type="success" icon="el-icon-view" @click="disabledHandle(false)">批量启用</el-button>
        <eForm ref="form" :pc-options="pcOptions" :page-num="pageNum" :is-add="true"/>
      </div>
    </blockquote>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { getPmOptions, disPcm } from '@/api/payment'
import countryOptions from '@/utils/country'
import eForm from './form'
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true
    },
    pcOptions: {
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
      const title = dis ? '禁用' : '启用'
      const ids = this.$parent.selections.map(item => { return item.id })
      const names = this.$parent.selections.map(item => { return item.channelName + '-' + item.methodCode })
      this.$confirm(`确定对【 ${names.join('，')} 】进行【 ${title} 】操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { 'idList': ids, 'disabled': dis }
        disPcm(data).then(res => {
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
      getPmOptions({ countryCode: code, disabled: false, channelId: null }).then(res => {
        this.pmOptions = res.data
      })
    }
  }
}
</script>
