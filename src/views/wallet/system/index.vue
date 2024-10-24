<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <!-- 搜索 -->
          <el-select v-model="query.countryCode" filterable clearable placeholder="请选择国家" class="filter-item" style="width: 130px" @change="toQuery">
            <el-option
              v-for="item in countryOptions"
              :key="item.code"
              :label="item.code +'-'+ item.name"
              :value="item.code"/>
          </el-select>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </blockquote>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width:600px">
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" label="钱包余额(元)" min-width="120px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.balance, 100)) }}</span>
        </template>
      </el-table-column>
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
import { isEmpty } from '@/utils/index'
import { mathMul, mathDiv, formatNum } from '@/utils/math'
import initData from '../../../mixins/initData'
import countryOptions from '@/utils/country'

export default {
  mixins: [initData],
  data: function() {
    return {
      delLoading: false, sysBalance: 0, sup_this: this, pageNum: 1, countryOptions: countryOptions
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    mathMul, mathDiv, formatNum,
    toQuery() {
      this.page = 1
      this.init()
    },
    beforeInit() {
      this.pageNum = this.page
      this.url = 'sys/wallet/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const countryCode = query.countryCode
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      return true
    }
  }
}
</script>
