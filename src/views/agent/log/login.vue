<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="2">商户代理</el-menu-item>
          <el-menu-item index="4">通道代理</el-menu-item>
        </el-menu>
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <el-select v-model="query.targetId" :placeholder="'选择'+targetName+'代理'" filterable clearable class="filter-item" style="width:160px" @change="toQuery">
            <el-option v-for="item in agentOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-input v-model="query.ip" clearable placeholder="IP地址" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.address" clearable placeholder="所属地区" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </blockquote>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 620px">
      <el-table-column :label="targetName+'代理'" prop="targetName" min-width="120"/>
      <el-table-column prop="ip" label="IP地址" width="120px"/>
      <el-table-column prop="address" label="所属地区"/>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :page-sizes="pageSizes"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import initData from '../../../mixins/initData'
import { getAgentOptions } from '@/api/agent'
import { parseTime, isEmpty } from '@/utils/index'
export default {
  mixins: [initData],
  data() {
    return {
      sup_this: this, activeIndex: '2', agentType: 2, targetName: '商户', agentOptions: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadOptions(2)
  },
  methods: {
    parseTime,
    toQuery() {
      this.page = 0
      this.init()
    },
    beforeInit() {
      this.url = '/client/log/login/page'
      const query = this.query
      const targetId = query.targetId
      const ip = query.ip
      const address = query.address
      this.params = { pageIndex: this.page, pageSize: this.size, targetTypeList: [this.agentType] }
      if (!isEmpty(targetId)) { this.params['targetId'] = targetId }
      if (!isEmpty(address)) { this.params['address'] = address }
      if (!isEmpty(ip)) { this.params['ip'] = ip }
      return true
    },
    loadOptions(agentType) {
      getAgentOptions(null, agentType).then(res => {
        this.agentOptions = res.data
      })
    },
    handleSelect(key, keyPath) {
      if (key === '2') {
        this.activeIndex = '2'
        this.targetName = '商户'
        this.agentType = 2
        this.loadOptions(2)
        this.query.targetId = null
        this.toQuery()
      } else {
        this.activeIndex = '4'
        this.targetName = '通道'
        this.agentType = 4
        this.loadOptions(4)
        this.query.targetId = null
        this.toQuery()
      }
    }
  }
}
</script>
<style>
.head-container .el-menu--horizontal{
  margin-bottom: 15px;
}
.head-container .el-menu--horizontal .el-menu-item{
  background-color: #f5f7fa;
  height: 40px;
  line-height: 40px;
  border: 1px solid #e4e7ed!important;
  border-radius: 4px 4px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-left: -1px;
  margin-bottom: -1px;
}
.head-container .el-menu--horizontal .el-menu-item.is-active{
  background-color: #fff;
  color: #409EFF;
  font-weight: bold;
  border-bottom: 1px solid #FFF!important;
}
</style>
