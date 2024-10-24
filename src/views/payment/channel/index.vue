<template>
  <div class="app-container" style="min-width: 1200px">
    <eHeader :query="query" :page-num="pageNum" :pc-options="pcOptions" :selections="selections"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column label="通道ID" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="channelName" label="通道名称" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="channelCode" label="通道编码" min-width="90px"/>
      <el-table-column label="通道类型" min-width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.channelType==0" style="color:#303133">三方通道</span>
          <span v-if="scope.row.channelType==1" style="color:#E6A23C">卡商通道</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="appId" label="APP_ID" min-width="100px"/>
      <el-table-column label="通道代理" min-width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.agentId>0">{{ scope.row.agentName }}</span>
          <span v-else style="color:#909399;">无代理</span>
        </template>
      </el-table-column>
      <el-table-column label="支付开关" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.paySwitch" style="color: #67C23A">开启</span>
          <span v-else style="color:#E6A23C;">关闭</span>
        </template>
      </el-table-column>
      <el-table-column label="代付开关" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.drawSwitch" style="color: #67C23A">开启</span>
          <span v-else style="color:#E6A23C;">关闭</span>
        </template>
      </el-table-column>
      <el-table-column label="代付费率/手续费" align="center" min-width="110px">
        <template slot-scope="scope">
          <span>{{ mathMul(scope.row.drawRate, 100) }}% ，{{ mathDiv(scope.row.drawCost, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代付金额区间(元)" min-width="115px">
        <template slot-scope="scope">
          <span>{{ mathDiv(scope.row.drawMinAmount, 100) }}</span>
          -
          <span>{{ mathDiv(scope.row.drawMaxAmount, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="代付单笔限额(元)" min-width="115px">
        <template slot-scope="scope">
          <span>{{ mathDiv(scope.row.drawSingleQuota, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="drawWeightNum" label="代付权重" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.drawWeightNum==5" style="color:#409EFF">高</span>
          <span v-if="scope.row.drawWeightNum==3" style="color:rgb(102, 177, 255)">中</span>
          <span v-if="scope.row.drawWeightNum==2" style="color:rgb(121, 187, 255)">低</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.disabled" style="color:#E6A23C;">禁用</span>
          <span v-else style="color: #67C23A">启用</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" width="133px" />
      <el-table-column label="操作" align="center" fixed="right" width="110px">
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
import { getPcOptions } from '@/api/payment'
import { isAuth } from '@/utils/auth'
import initData from '@/mixins/initData'
import { isEmpty } from '@/utils/index'
import { mathDiv, mathMul } from '@/utils/math'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], pcOptions: []
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
    mathDiv,
    mathMul,
    beforeInit() {
      this.pageNum = this.page
      this.url = '/payment/channel/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const venId = query.venId
      const id = query.id
      const appId = query.appId
      const paySwitch = query.paySwitch
      const drawSwitch = query.drawSwitch
      const disabled = query.disabled
      if (!isEmpty(venId)) { this.params['venId'] = venId }
      if (!isEmpty(id)) { this.params['id'] = id }
      if (!isEmpty(appId)) { this.params['appId'] = appId }
      if (!isEmpty(paySwitch)) { this.params['paySwitch'] = paySwitch }
      if (!isEmpty(drawSwitch)) { this.params['drawSwitch'] = drawSwitch }
      if (!isEmpty(disabled)) { this.params['disabled'] = disabled }
      return true
    },
    // 多选
    selectionChangeHandle(val) {
      this.selections = val
    },
    loadOptions() {
      getPcOptions({ countryCode: null, disabled: false, mchId: null }).then(res => {
        this.pcOptions = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
