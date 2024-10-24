<template>
  <div class="head-container">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="2">商户代理钱包</el-menu-item>
      <el-menu-item index="4">通道代理钱包</el-menu-item>
    </el-menu>
    <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
      <el-select v-model="query.countryCode" filterable clearable placeholder="请选择国家" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option
          v-for="item in countryOptions"
          :key="item.code"
          :label="item.code +'-'+ item.name"
          :value="item.code"/>
      </el-select>
      <el-select v-model="query.id" clearable filterable placeholder="选择商户代理" class="filter-item" style="width: 130px" @change="toQuery">
        <el-option v-for="item in matOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-input v-model="query.name" clearable placeholder="商户代理名" style="width: 120px;" class="filter-item"/>
      <el-input v-model="query.loginAccount" clearable placeholder="登录账户" style="width: 125px;" class="filter-item"/>
      <el-select v-model="query.auditStatus" clearable placeholder="审核" class="filter-item" style="width: 80px" @change="toQuery">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.key"/>
      </el-select>
      <el-select v-model="query.disabled" clearable placeholder="状态" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option v-for="item in disabledOptions" :key="item.key" :label="item.name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px; float:right">
        <add v-if="isAuth('agt:add')"/>
        <el-button v-if="isAuth('agt:disabled')" :disabled="this.$parent.selections.length <= 0" class="filter-item" size="mini" type="warning" icon="el-icon-view" @click="disabledHandle(true)">批量禁用</el-button>
        <el-button v-if="isAuth('agt:disabled')" :disabled="this.$parent.selections.length <= 0" class="filter-item" size="mini" type="success" icon="el-icon-view" @click="disabledHandle(false)">批量启用</el-button>
      </div>
    </blockquote>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { disAgent } from '@/api/agent'
import countryOptions from '@/utils/country'
import add from './add'
// 查询条件
export default {
  components: { add },
  props: {
    query: {
      type: Object,
      required: true
    },
    matOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeIndex: '2',
      countryOptions: countryOptions,
      downloadLoading: false,
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
      const names = this.$parent.selections.map(item => { return item.name })
      this.$confirm(`确定对【 ${names.join('，')} 】进行【 ${title} 】操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { 'idList': ids, 'disabled': dis }
        disAgent(data).then(res => {
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
    }
  }
}
</script>
