<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <!-- 搜索 -->
        <el-select v-model="query.noticeType" clearable placeholder="公告类型" class="filter-item" style="width: 160px" @change="toQuery">
          <el-option label="全部" value="0"/>
          <el-option label="商户" value="1"/>
          <el-option label="商户代理" value="2"/>
          <el-option label="通道代理" value="4"/>
        </el-select>
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        <!-- 新增 -->
        <div style="display: inline-block;margin: 0px 2px; float:right">
          <el-button v-if="isAuth('notice:add')" class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="toAdd()">新增</el-button>
        </div>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column prop="noticeType" label="公告类型">
        <template slot-scope="scope">
          <span v-if="scope.row.noticeType == 0">全部</span>
          <span v-if="scope.row.noticeType == 1">商户</span>
          <span v-if="scope.row.noticeType == 2">商户代理</span>
          <span v-if="scope.row.noticeType == 4">通道代理</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"/>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="isAuth('notice:update')" size="mini" type="primary" @click="toEdit(scope.row)">编辑</el-button>
          <el-popover
            v-model="scope.row.delPopover"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.delPopover = false">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button v-if="isAuth('notice:delete')" slot="reference" type="danger" size="mini" @click="scope.row.delPopover = true">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <eForm ref="form" :sup_this="sup_this" :is-add="false"/>
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
import { isAuth } from '@/utils/auth'
import eForm from './module/form'
import initData from '../../../mixins/initData'
import { del } from '@/api/sys-notice'
import { parseTime, isEmpty } from '@/utils/index'

export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      sup_this: this, delLoading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    isAuth,
    parseTime,
    toQuery() {
      this.page = 0
      this.init()
    },
    beforeInit() {
      this.url = 'sys/notice/page'
      const query = this.query
      const noticeType = query.noticeType
      this.params = { pageIndex: this.page, pageSize: this.size }
      if (!isEmpty(noticeType)) {
        this.params['noticeType'] = noticeType
      }
      return true
    },
    toAdd() {
      const _this = this.$refs.form
      _this.resetForm()
      _this.isAdd = true
      _this.dialog = true
    },
    toEdit(data) {
      const _this = this.$refs.form
      _this.resetForm()
      _this.form = {
        id: data.id,
        noticeType: data.noticeType.toString(),
        title: data.title,
        coverImg: data.coverImg,
        content: data.content,
        topest: data.topest.toString()
      }
      _this.isAdd = false
      _this.dialog = true
    },
    subDelete(index, row) {
      this.delLoading = true
      del(row.id).then(res => {
        this.delLoading = false
        row.delPopover = false
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        row.delPopover = false
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
