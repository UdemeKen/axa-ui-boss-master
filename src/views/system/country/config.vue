<template>
  <div class="app-container" style="min-width: 1200px">
    <eHeader :query="query" :page-num="pageNum"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="identityTypes" label="身份标识类型" min-width="140px"/>
      <el-table-column label="卡商默认费率" align="center" width="95px">
        <template slot-scope="scope">
          <span>{{ mathMul(scope.row.venPayRate, 100) }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="卡商最低费率" align="center" width="95px">
        <template slot-scope="scope">
          <span>{{ mathMul(scope.row.venMinRate, 100) }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="最低保证金" align="center" width="90px">
        <template slot-scope="scope">
          <span>{{ mathDiv(scope.row.venMinDeposit, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最低充值金额" align="center" width="95px">
        <template slot-scope="scope">
          <span>{{ mathDiv(scope.row.venMinRecharge, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡商代付配置" align="center" width="100px">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">
              保底手续费：{{ mathDiv(scope.row.venDrawFee,100) }} 元
              <br>
              代付金额区间：{{ mathDiv(scope.row.venDrawMin,100) }} ~ {{ mathDiv(scope.row.venDrawMax,100) }} 元
              <br>
              代付起止时间：{{ scope.row.venDrawStart }} ~ {{ scope.row.venDrawEnd }}
            </div>
            <span v-if="scope.row.venDrawSwitch" style="color: #67C23A">开启</span>
            <span v-else style="color:red;">关闭</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="商户代付配置" align="center" width="100px">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">
              保底手续费：{{ mathDiv(scope.row.mchDrawFee,100) }} 元
              <br>
              代付金额区间：{{ mathDiv(scope.row.mchDrawMin,100) }} ~ {{ mathDiv(scope.row.mchDrawMax,100) }} 元
              <br>
              代付起止时间：{{ scope.row.mchDrawStart }} ~ {{ scope.row.mchDrawEnd }}
            </div>
            <span v-if="scope.row.mchDrawSwitch" style="color: #67C23A">开启</span>
            <span v-else style="color:red;">关闭</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="代理代付配置" align="center" width="100px">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">
              保底手续费：{{ mathDiv(scope.row.agentDrawFee,100) }} 元
              <br>
              代付金额区间：{{ mathDiv(scope.row.agentDrawMin,100) }} ~ {{ mathDiv(scope.row.agentDrawMax,100) }} 元
              <br>
              代付起止时间：{{ scope.row.agentDrawStart }} ~ {{ scope.row.agentDrawEnd }}
            </div>
            <span v-if="scope.row.agentDrawSwitch" style="color: #67C23A">开启</span>
            <span v-else style="color:red;">关闭</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="cardInQuota" label="收款卡日轮询总额" min-width="120px">
        <template slot-scope="scope">
          <span>{{ mathDiv(scope.row.cardInQuota, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="cardInAmount" label="收款卡下发限额" min-width="130px">
        <template slot-scope="scope">
          <span>{{ mathDiv(scope.row.cardInAmount, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="cardInMinute" label="收款卡下发间隔分钟" min-width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.cardInMinute }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="cardOutQuota" label="代付卡日轮询总额" min-width="120px">
        <template slot-scope="scope">
          <span>{{ mathDiv(scope.row.cardOutQuota, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="cardWarnAmount" label="代付卡告警额度" min-width="105px">
        <template slot-scope="scope">
          <span>{{ mathDiv(scope.row.cardWarnAmount, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90px" align="center" fixed="right">
        <template slot-scope="scope">
          <edit v-if="isAuth('sys:conf:update')" :page-num="pageNum" :data="scope.row" :sup_this="sup_this"/>
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
import { isAuth } from '@/utils/auth'
import { isEmpty } from '@/utils/index'
import { mathMul, mathDiv } from '@/utils/math'
import eHeader from './config/header'
import edit from './config/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    isEmpty,
    isAuth,
    mathMul,
    mathDiv,
    beforeInit() {
      this.pageNum = this.page
      this.url = '/sys/country/config/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const countryCode = query.countryCode
      const disabled = query.disabled
      if (!isEmpty(countryCode)) { this.params['countryCode'] = countryCode }
      if (!isEmpty(disabled)) { this.params['disabled'] = disabled }
      return true
    }
  }
}
</script>
