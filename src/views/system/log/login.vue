<template>
  <div class="app-container" style="width: 700px">
    <template>
      <div class="head-container">
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <el-select v-model="query.targetId" clearable filterable placeholder="选择用户" class="filter-item" style="width: 130px" @change="toQuery">
            <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-input v-model="query.ip" clearable placeholder="IP地址" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.address" clearable placeholder="所属地区" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </blockquote>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border>
      <el-table-column prop="targetName" label="用户名" min-width="120px"/>
      <el-table-column prop="ip" label="IP地址" min-width="120px"/>
      <el-table-column prop="address" label="所属地区" min-width="120px"/>
      <el-table-column prop="createTime" label="创建日期" min-width="135px"/>
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
import { getUserOptions } from '@/api/sys-user'
import { isEmpty } from '@/utils/index'
export default {
  mixins: [initData],
  data() {
    return {
      sup_this: this
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadOptions()
  },
  methods: {
    toQuery() {
      this.page = 0
      this.init()
    },
    beforeInit() {
      this.url = '/sys/log/login/page'
      const query = this.query
      const targetId = query.targetId
      const ip = query.ip
      const address = query.address
      this.params = { pageIndex: this.page, pageSize: this.size }
      if (!isEmpty(targetId)) { this.params['targetId'] = targetId }
      if (!isEmpty(address)) { this.params['address'] = address }
      if (!isEmpty(ip)) { this.params['ip'] = ip }
      return true
    },
    loadOptions() {
      getUserOptions().then(res => {
        this.userOptions = res.data
      })
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
</style>
