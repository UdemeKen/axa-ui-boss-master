<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <el-select v-model="query.targetId" clearable filterable placeholder="选择商户" class="filter-item" style="width: 130px" @change="toQuery">
            <el-option v-for="item in mchOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-input v-model="query.title" clearable placeholder="标题" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.url" clearable placeholder="请求地址" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </blockquote>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column prop="targetName" label="商户" min-width="120"/>
      <el-table-column prop="title" label="标题" min-width="120"/>
      <el-table-column :show-overflow-tooltip="true" prop="method" label="方法名" min-width="130"/>
      <el-table-column :show-overflow-tooltip="true" prop="params" label="参数" min-width="100">
        <template slot-scope="scope">
          <el-popover
            v-if="!isEmpty(scope.row.params)"
            :content="scope.row.params"
            placement="top"
            width="600"
            trigger="click">
            <a slot="reference">点击查看</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="url" label="服务地址" min-width="130"/>
      <el-table-column :show-overflow-tooltip="false" prop="stackEx" label="堆栈异常信息" min-width="100">
        <template slot-scope="scope">
          <el-popover
            v-if="!isEmpty(scope.row.stackEx)"
            :content="scope.row.stackEx"
            placement="top"
            width="600"
            trigger="click">
            <a slot="reference">查看异常</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP地址" min-width="120"/>
      <el-table-column prop="msec" label="耗时毫秒" min-width="80"/>
      <el-table-column prop="createTime" label="创建日期" width="133"/>
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
import { isEmpty } from '@/utils/index'
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
    isEmpty,
    toQuery() {
      this.page = 0
      this.init()
    },
    beforeInit() {
      this.url = '/client/log/act/page'
      const query = this.query
      const targetId = query.targetId
      const url = query.url
      const title = query.title
      this.params = { pageIndex: this.page, pageSize: this.size, targetTypeList: [1] }
      if (!isEmpty(targetId)) { this.params['targetId'] = targetId }
      if (!isEmpty(title)) { this.params['title'] = title }
      if (!isEmpty(url)) { this.params['url'] = url }
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
<style>
.el-popover--plain{
  word-break: break-all;word-wrap: break-word;
}
</style>
