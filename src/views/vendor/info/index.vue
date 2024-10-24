<template>
  <div class="app-container" style="min-width: 1260px">
    <eHeader :query="query" :page-num="pageNum" :ven-options="venOptions" :selections="selections"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="name" label="卡商姓名" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="loginAccount" label="登录账号" min-width="80px"/>
      <el-table-column :show-overflow-tooltip="true" prop="inviteCode" label="邀请码" min-width="100px"/>
      <el-table-column :show-overflow-tooltip="true" prop="phone" label="手机" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="trxAddress" label="TRX地址" width="265px"/>
      <el-table-column label="签约费率" min-width="70px">
        <template slot-scope="scope">
          <span>{{ mathMul(scope.row.payRate, 100) }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="提现费率" min-width="70px">
        <template slot-scope="scope">
          <span>{{ mathMul(scope.row.drawRate, 100) }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="提现开关" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.drawSwitch" style="color: #67C23A">开启</span>
          <span v-else style="color:red;">关闭</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.auditStatus === 0" style="color: #E6A23C">待审</span>
          <span v-if="scope.row.auditStatus === 1" style="color: #67C23A">通过</span>
          <span v-if="scope.row.auditStatus === 2" style="color: #979A9A">驳回</span>
        </template>
      </el-table-column>
      <el-table-column label="账户状态" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.disabled" style="color: #E6A23C">禁用</span>
          <span v-else style="color: #67C23A">启用</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" min-width="133px" />
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
import { getVenOptions } from '@/api/ven'
import { isAuth } from '@/utils/auth'
import { mathMul } from '@/utils/math'
import initData from '../../../mixins/initData'
import { isEmpty } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], venOptions: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadVenOptions()
  },
  methods: {
    isAuth,
    isEmpty,
    mathMul,
    beforeInit() {
      this.pageNum = this.page
      this.url = 'vendor/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const venId = query.venId
      const countryCode = query.countryCode
      const disabled = query.disabled
      const name = query.name
      const inviteCode = query.inviteCode
      const auditStatus = query.auditStatus
      const phone = query.phone
      const countryCodeList = []
      if (!isEmpty(venId)) { this.params['venId'] = venId }
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(name)) { this.params['name'] = name }
      if (!isEmpty(disabled)) { this.params['disabled'] = disabled }
      if (!isEmpty(inviteCode)) { this.params['inviteCode'] = inviteCode }
      if (!isEmpty(auditStatus)) { this.params['auditStatus'] = auditStatus }
      if (!isEmpty(inviteCode)) { this.params['payPollType'] = inviteCode }
      if (!isEmpty(phone)) { this.params['phone'] = phone }
      return true
    },
    // 多选
    selectionChangeHandle(val) {
      this.selections = val
    },
    loadVenOptions() {
      getVenOptions().then(res => {
        this.venOptions = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
