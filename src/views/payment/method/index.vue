<template>
  <div class="app-container" style="min-width: 1200px">
    <eHeader :query="query" :page-num="pageNum" :pm-options="pmOptions" :selections="selections"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="methodName" label="支付名称" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="methodCode" label="支付编码" min-width="100px"/>
      <el-table-column label="支付范围" min-width="110px">
        <template slot-scope="scope">
          <span v-if="scope.row.paySwitch" style="color: #409EFF">进单</span>&nbsp;
          <span v-if="scope.row.drawSwitch" style="color: #67C23A">代付</span>&nbsp;
          <span v-if="scope.row.rechgSwitch" style="color: #E6A23C">充值</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" label="订单时效" min-width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.expMin }}分钟</span>
        </template>
      </el-table-column>
      <el-table-column label="卡商代收浮动费率" align="left" min-width="200px">
        <template slot-scope="scope">
          <span v-if="scope.row.floatInSwitch" style="color: #67C23A">开启</span>
          <span v-else>关闭</span>
          <span>&emsp;{{ mathMul(scope.row.floatInRate,100) }}%&emsp;</span>
          <span>{{ scope.row.floatInStart }}~{{ scope.row.floatInEnd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡商代付浮动费率" align="left" min-width="200px">
        <template slot-scope="scope">
          <span v-if="scope.row.floatOutSwitch" style="color: #67C23A">开启</span>
          <span v-else>关闭</span>
          <span>&emsp;{{ mathMul(scope.row.floatOutRate,100) }}%&emsp;</span>
          <span>{{ scope.row.floatOutStart }}~{{ scope.row.floatOutEnd }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" prop="sortNum" label="序号" min-width="80px"/>
      <el-table-column label="状态" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.disabled" style="color: #E6A23C">禁用</span>
          <span v-else style="color: #67C23A">启用</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" width="133px" />
      <el-table-column label="操作" align="center" fixed="right" width="120px">
        <template slot-scope="scope">
          <edit :data="scope.row" :page-num="pageNum" :sup_this="sup_this"/>
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
import { getPmOptions } from '@/api/payment'
import { isAuth } from '@/utils/auth'
import initData from '../../../mixins/initData'
import { isEmpty } from '@/utils/index'
import { mathMul } from '@/utils/math'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], pmOptions: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadOptions()
  },
  methods: {
    isAuth,
    isEmpty,
    mathMul,
    beforeInit() {
      this.pageNum = this.page
      this.url = 'payment/method/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const countryCode = query.countryCode
      const methodCode = query.methodCode
      const disabled = query.disabled
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(methodCode)) { this.params['methodCode'] = methodCode }
      if (!isEmpty(disabled)) { this.params['disabled'] = disabled }
      return true
    },
    // 多选
    selectionChangeHandle(val) {
      this.selections = val
    },
    loadOptions() {
      getPmOptions().then(res => {
        this.pmOptions = res.data
      })
    }
  }
}
</script>
