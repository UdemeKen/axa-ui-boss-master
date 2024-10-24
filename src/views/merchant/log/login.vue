<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <el-select v-model="query.targetId" clearable filterable placeholder="选择商户" class="filter-item" style="width: 130px" @change="toQuery">
            <el-option v-for="item in mchOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-input v-model="query.ip" clearable placeholder="IP地址" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.address" clearable placeholder="所属地区" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </blockquote>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 620px">
      <el-table-column prop="targetName" label="商户"/>
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
import { getMchOptions } from '@/api/mch'
import { parseTime, isEmpty } from '@/utils/index'
export default {
  mixins: [initData],
  data() {
    return {
      sup_this: this, mchOptions: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadOptions()
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
      this.params = { pageIndex: this.page, pageSize: this.size, targetTypeList: [2, 4] }
      if (!isEmpty(targetId)) { this.params['targetId'] = targetId }
      if (!isEmpty(address)) { this.params['address'] = address }
      if (!isEmpty(ip)) { this.params['ip'] = ip }
      return true
    },
    loadOptions() {
      getMchOptions().then(res => {
        this.mchOptions = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
