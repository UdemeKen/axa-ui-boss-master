<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <el-select v-model="query.targetId" clearable filterable placeholder="选择目标" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in targetOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-input v-model="query.ip" clearable placeholder="IP地址" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.address" clearable placeholder="所属地区" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </blockquote>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column prop="targetName" label="用户名"/>
      <el-table-column prop="ip" label="IP地址"/>
      <el-table-column prop="address" label="所属地区"/>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" min-width="133px"/>
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
import { getVenOptions } from '@/api/ven'
import { isEmpty } from '@/utils/index'
export default {
  mixins: [initData],
  data() {
    return {
      sup_this: this, targetOptions: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadOptions()
  },
  methods: {
    beforeInit() {
      this.url = '/tgt/log/login'
      const query = this.query
      const targetId = query.targetId
      const ip = query.ip
      const address = query.address
      this.params = { pageIndex: this.page, pageSize: this.size, targetType: 5 }
      if (!isEmpty(targetId)) { this.params['targetId'] = targetId }
      if (!isEmpty(address)) { this.params['address'] = address }
      if (!isEmpty(ip)) { this.params['ip'] = ip }
      return true
    },
    loadOptions() {
      getVenOptions().then(res => {
        this.targetOptions = res.data
      })
    },
    toQuery() {
      this.page = 0
      this.init()
    }
  }
}
</script>

<style scoped>

</style>
