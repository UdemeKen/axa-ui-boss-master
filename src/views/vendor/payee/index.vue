<template>
  <div class="app-container" style="min-width: 1200px">
    <eHeader :query="query" :page-num="pageNum" :ven-options="venOptions" :pm-options="pmOptions" :online-count="onlineCount" :bank-options="bankOptions" :selections="selections"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="venName" label="卡商" min-width="90px"/>
      <el-table-column :formatter="formatPm" :show-overflow-tooltip="true" prop="methodCode" label="支付方式" min-width="100px"/>
      <el-table-column :show-overflow-tooltip="true" prop="bankCode" label="开户银行" min-width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.supportNo" style="color: #67C23A">{{ formatBankName(scope.row.bankCode) }}</span>
          <span v-else>{{ formatBankName(scope.row.bankCode) }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="payeeOwner" label="开户人" min-width="100px"/>
      <el-table-column :show-overflow-tooltip="true" prop="payeeKey" label="开户账号" min-width="140px"/>
      <el-table-column label="账户余额" min-width="92px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.balance, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款总额" min-width="92px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.inAmount, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出款总额" min-width="92px">
        <template slot-scope="scope">
          <span>{{ formatNum(mathDiv(scope.row.outAmount, 100)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款开关" align="center" min-width="70px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.paySwitch" placement="top">
            <div slot="content">
              金额区间：{{ mathDiv(scope.row.payMinAmount, 100) }}~{{ mathDiv(scope.row.payMaxAmount, 100) }}
            </div>
            <span style="color: #67C23A">开启</span>
          </el-tooltip>
          <span v-else style="color:#E6A23C;">关闭</span>
        </template>
      </el-table-column>
      <el-table-column label="代付开关" align="center" min-width="70px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.drawSwitch" placement="top">
            <div slot="content">
              金额区间：{{ mathDiv(scope.row.drawMinAmount, 100) }}~{{ mathDiv(scope.row.drawMaxAmount, 100) }}
            </div>
            <span style="color: #67C23A">开启</span>
          </el-tooltip>
          <span v-else style="color:#E6A23C;">关闭</span>
        </template>
      </el-table-column>
      <el-table-column label="中转开关" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.midSwitch" style="color: #67C23A">开启</span>
          <span v-else style="color:#E6A23C;">关闭</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="设备绑定" min-width="85px">
        <template slot-scope="scope">
          <span v-if="isEmpty(scope.row.deviceId)" style="color: #979A9A">未绑定设备</span>
          <el-tooltip v-else placement="top">
            <div slot="content">
              设备ID：{{ scope.row.deviceId }}
            </div>
            <span style="color: #409EFF">已绑定
              <span v-if="scope.row.online" style="color: #67C23A">在线</span>
              <span v-else style="color:red;">下线</span>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="账户状态" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.disabled" style="color: #E6A23C">禁用</span>
          <span v-else style="color: #67C23A">启用</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.auditStatus === 0" style="color: #E6A23C">待审</span>
          <span v-if="scope.row.auditStatus === 1" style="color: #67C23A">通过</span>
          <span v-if="scope.row.auditStatus === 2" style="color: #979A9A">驳回</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" width="133px" />
      <el-table-column label="操作" align="center" fixed="right" width="120px">
        <template slot-scope="scope">
          <edit :data="scope.row" :bank-options="bankOptions" :pm-options="pmOptions" :page-num="pageNum" :sup_this="sup_this"/>
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
import { getPmOptions } from '@/api/payment'
import { getBankOptions } from '@/api/payment'
import { getDevice } from '@/api/ven-payee'
import { isAuth } from '@/utils/auth'
import initData from '../../../mixins/initData'
import { isEmpty } from '@/utils/index'
import { mathDiv, formatNum } from '@/utils/math'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], venOptions: [], pmOptions: [], bankOptions: [], onlineCount: 0
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
    formatNum,
    beforeInit() {
      this.pageNum = this.page
      this.url = 'vendor/payee/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const venId = query.venId
      const countryCode = query.countryCode
      const methodCode = query.methodCode
      const bankCode = query.bankCode
      const payeeKey = query.payeeKey
      const payeeOwner = query.payeeOwner
      const deviceId = query.deviceId
      const paySwitch = query.paySwitch
      const drawSwitch = query.drawSwitch
      const midSwitch = query.midSwitch
      const auditStatus = query.auditStatus
      const countryCodeList = []
      if (!isEmpty(venId)) { this.params['venId'] = venId }
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(bankCode)) { this.params['bankCode'] = bankCode }
      if (!isEmpty(methodCode)) { this.params['methodCode'] = methodCode }
      if (!isEmpty(payeeKey)) { this.params['payeeKey'] = payeeKey }
      if (!isEmpty(payeeOwner)) { this.params['payeeOwner'] = payeeOwner }
      if (!isEmpty(deviceId)) { this.params['deviceId'] = deviceId }
      if (!isEmpty(paySwitch)) { this.params['paySwitch'] = paySwitch }
      if (!isEmpty(midSwitch)) { this.params['midSwitch'] = midSwitch }
      if (!isEmpty(drawSwitch)) { this.params['drawSwitch'] = drawSwitch }
      if (!isEmpty(auditStatus)) { this.params['auditStatus'] = auditStatus }
      return true
    },
    // 多选
    selectionChangeHandle(val) {
      this.selections = val
    },
    loadOptions() {
      getVenOptions().then(res => {
        this.venOptions = res.data
      })
      getPmOptions({ countryCode: null, disabled: false, drawSwitch: true }).then(res => {
        this.pmOptions = res.data
      })
      getBankOptions(null, false).then(res => {
        this.bankOptions = res.data
      })
      getDevice().then(res => {
        this.onlineCount = res.data
      })
    },
    formatPm(row, column) {
      const methodCode = row['methodCode']
      for (let i = 0; i < this.pmOptions.length; i++) {
        if (this.pmOptions[i].code === methodCode) {
          return this.pmOptions[i].name
        }
      }
      return methodCode
    },
    formatBankName(bankCode) {
      if (isEmpty(bankCode)) {
        return ''
      }
      if (bankCode === 'USD001') {
        return 'USDT'
      }
      for (let i = 0; i < this.bankOptions.length; i++) {
        if (this.bankOptions[i].code === bankCode) {
          return this.bankOptions[i].name
        }
      }
      return bankCode
    }
  }
}
</script>

<style scoped>

</style>
