<template>
  <div class="app-container">
    <template>
      <div class="head-container">
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <!-- 搜索 -->
          <el-input v-model="query.parentDrawNo" clearable placeholder="提现总单号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.outDrawNo" clearable placeholder="提现申请单号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-select v-model="query.targetType" clearable placeholder="提现来源" class="filter-item" style="width: 120px" @change="toChange">
            <el-option label="商户" value="1"/>
            <el-option label="卡商" value="5"/>
            <el-option label="商户代理" value="2"/>
            <el-option label="通道代理" value="4"/>
          </el-select>
          <el-select v-model="query.targetId" clearable filterable placeholder="选择提现人" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option v-for="item in targetOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-select v-model="query.drawStatus" clearable placeholder="订单状态" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option label="待审核" value="0"/>
            <el-option label="提现成功" value="1"/>
            <el-option label="驳回提现" value="2"/>
            <el-option label="提现未明" value="3"/>
          </el-select>
          <el-date-picker v-model="query.createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" class="filter-item" style="width: 330px;" @change="toQuery"/>
          <br>
          <el-input v-model="query.childDrawNo" clearable placeholder="提现子单号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-input v-model="query.channelSerialNo" clearable placeholder="通道流水号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
          <el-select v-model="query.settled" clearable placeholder="提现结算" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option label="已结算" value="true"/>
            <el-option label="未结算" value="false"/>
          </el-select>
          <el-select v-model="query.sysSettled" clearable placeholder="平台结算" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option label="已结算" value="true"/>
            <el-option label="未结算" value="false"/>
          </el-select>
          <el-select v-model="query.channelSettled" clearable placeholder="通道结算" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option label="已结算" value="true"/>
            <el-option label="未结算" value="false"/>
          </el-select>
          <el-select v-model="query.drawType" clearable placeholder="代付类型" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option label="线下转账" value="0"/>
            <el-option label="通道代付" value="1"/>
          </el-select>
          <el-select v-model="query.frozen" clearable placeholder="金额冻结" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option label="已冻结" value="true"/>
            <el-option label="未冻结" value="false"/>
          </el-select>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <el-button :loading="downloadLoading" class="filter-item" size="mini" type="success" icon="el-icon-download" @click="download">导出</el-button>
        </blockquote>
        <blockquote class="my-blockquote statistics">
          <div>
            <span class="text">订单总数：</span><el-tag>{{ statistics.totalCount }}</el-tag>
            <span class="text">成功单数：</span><el-tag type="success">{{ statistics.successCount }}</el-tag>
            <span class="text">提现总额：</span><el-tag>{{ mathDiv(statistics.totalAmount,100) }}</el-tag>
            <span class="text">成功到账总额：</span><el-tag type="success">{{ mathDiv(statistics.successAmount,100) }}</el-tag>
            <span class="text">平台手续费：</span><el-tag type="warning">{{ mathDiv(statistics.totalProfit,100) }}</el-tag>
          </div>
        </blockquote>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" :header-cell-style="{background:'#f5f7fa',color:'#606266'}" size="small" border style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" prop="childDrawNo" label="提现子单号" min-width="185px"/>
      <el-table-column :show-overflow-tooltip="true" prop="targetType" label="提现来源" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.targetName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="drawType" label="代付类型" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.drawType == 0">线下转账</span>
          <span v-if="scope.row.drawType == 1">代付通道</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" label="单笔金额(元)" min-width="90px">
        <template slot-scope="scope">
          <span>{{ mathDiv(scope.row.totalAmount, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="realAmount" label="到账金额(元)" min-width="90px">
        <template slot-scope="scope">
          <span>{{ mathDiv(scope.row.realAmount, 100) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手续费(元)" min-width="80px">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">提现费率：{{ mathMul(scope.row.drawRate, 100) }}%</div>
            <span>{{ mathDiv(scope.row.drawFee, 100) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="提现账户" min-width="140px">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">
              开户银行：{{ scope.row.bankName }}<br>
              开户省市：{{ scope.row.bankProvince }} {{ scope.row.bankCity }}<br>
              开户支行：{{ scope.row.bankBranch }}<br>
              开&ensp;户&ensp;人：{{ scope.row.payeeName }}<br>
              银行卡号：{{ scope.row.payeeCardNo }}
            </div>
            <span>{{ scope.row.bankName }} {{ scope.row.payeeCardNo }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="channelName" label="代付通道" min-width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.drawType == 0" style="color: #909399">线下转账</span>
          <span v-else>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="channelName" label="通道费用(元)" min-width="90px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.drawType == 1" placement="top">
            <div slot="content">
              通道费率：{{ mathMul(scope.row.channelDfRates,100) }}%
            </div>
            <span>{{ mathDiv(scope.row.channelDfFee,100) }}</span>
          </el-tooltip>
          <span v-else style="color:#909399;">线下转账</span>
        </template>
      </el-table-column>
      <el-table-column label="通道结算" min-width="70px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.drawType == 1" placement="top">
            <div slot="content">
              结算日期：{{ scope.row.channelSettledTime }}
            </div>
            <span v-if="scope.row.channelSettled" style="color: #67C23A">已结算</span>
            <span v-else style="color:red;">未结算</span>
          </el-tooltip>
          <span v-else style="color:#909399;">无需结算</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="线下转账" min-width="92px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.drawType == 0" placement="top">
            <div slot="content">
              代付卡号：{{ scope.row.dfOffCard }}
              <br>
              代付流水号：{{ scope.row.dfOffSerial }}
            </div>
            <span>{{ scope.row.dfOffBank }}</span>
          </el-tooltip>
          <span v-else style="color:#909399;">走代付通道</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="channelName" label="转账费用(元)" min-width="90px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.drawType == 0" placement="top">
            <div slot="content">
              代付费率：{{ mathMul(scope.row.dfOffRates,100) }}%
            </div>
            <span>{{ mathDiv(scope.row.dfOffFee,100) }}</span>
          </el-tooltip>
          <span v-else style="color:#909399;">走代付通道</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="channelName" label="平台收益(元)" min-width="90px">
        <template slot-scope="scope">
          <span>{{ mathDiv(scope.row.sysDfFee,100) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台结算" align="center" min-width="70px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.sysSettled" placement="top">
            <div slot="content">
              结算日期：{{ scope.row.sysSettledTime }}
            </div>
            <span style="color: #67C23A">已结算</span>
          </el-tooltip>
          <span v-else style="color:red;">未结算</span>
        </template>
      </el-table-column>
      <el-table-column label="提现结算" align="center" min-width="70px">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.settled" placement="top">
            <div slot="content">结算日期：{{ scope.row.settledTime }}</div>
            <span style="color: #67C23A">已结算</span>
          </el-tooltip>
          <span v-else style="color:red;">未结算</span>
        </template>
      </el-table-column>
      <el-table-column label="提现状态" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.drawStatus == 0" style="color: #E6A23C">待审核</span>
          <span v-if="scope.row.drawStatus == 1" style="color: #67C23A">提现成功</span>
          <span v-if="scope.row.drawStatus == 2" style="color: #F56C6C">驳回提现</span>
          <span v-if="scope.row.drawStatus == 4" style="color: #1976D2">提现未明</span>
        </template>
      </el-table-column>
      <el-table-column label="金额冻结" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.frozen" style="color: #67C23A">已冻结</span>
          <span v-else style="color: #E6A23C">未冻结</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px" fixed="right">
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
import { isAuth } from '@/utils/auth'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import initData from '../../../mixins/initData'
import { getDrawChildSum } from '@/api/order-draw'
import { getPmOptions, getBankOptions } from '@/api/payment'
import { getMchOptions } from '@/api/mch'
import { getVenOptions } from '@/api/ven'
import { getAgentOptions } from '@/api/agent'
import { parseTime, isEmpty } from '@/utils/index'
import { mathMul, mathDiv } from '@/utils/math'
import edit from './module/edit'
export default {
  components: { edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, downloadLoading: false, downloadParam: {}, pageNum: 1, mchOptions: [], matOptions: [], catOptions: [], targetOptions: [], statistics: { totalCount: 0, totalAmount: 0, successCount: 0, successAmount: 0, totalProfit: 0 }
    }
  },
  computed: {
    ...mapGetters([
      'domainUrl'
    ])
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.getSum()
    this.loadOptions()
  },
  methods: {
    parseTime,
    isAuth,
    mathMul,
    mathDiv,
    beforeInit() {
      this.pageNum = this.page
      this.url = '/draw/order/child/page'
      const query = this.query
      const parentDrawNo = query.parentDrawNo
      const outDrawNo = query.outDrawNo
      const targetType = query.targetType
      const targetId = query.targetId
      const drawStatus = query.drawStatus
      const childDrawNo = query.childDrawNo
      const channelSerialNo = query.channelSerialNo
      const settled = query.settled
      const sysSettled = query.sysSettled
      const channelSettled = query.channelSettled
      const drawType = query.drawType
      const frozen = query.frozen
      const createTime = query.createTime
      this.params = { pageIndex: this.page, pageSize: this.size }
      if (!isEmpty(parentDrawNo)) { this.params['parentDrawNo'] = parentDrawNo }
      if (!isEmpty(outDrawNo)) { this.params['outDrawNo'] = outDrawNo }
      if (!isEmpty(targetType)) { this.params['targetType'] = targetType }
      if (!isEmpty(targetId)) { this.params['targetId'] = targetId }
      if (!isEmpty(drawStatus)) { this.params['drawStatus'] = drawStatus }
      if (!isEmpty(childDrawNo)) { this.params['childDrawNo'] = childDrawNo }
      if (!isEmpty(channelSerialNo)) { this.params['channelSerialNo'] = channelSerialNo }
      if (!isEmpty(settled)) { this.params['settled'] = settled }
      if (!isEmpty(channelSettled)) { this.params['channelSettled'] = channelSettled }
      if (!isEmpty(sysSettled)) { this.params['sysSettled'] = sysSettled }
      if (!isEmpty(drawType)) { this.params['drawType'] = drawType }
      if (!isEmpty(frozen)) { this.params['frozen'] = frozen }
      if (!isEmpty(createTime) && !isEmpty(createTime[0])) {
        this.params['startTime'] = createTime[0]
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[1])) {
        this.params['endTime'] = createTime[1]
      }
      return true
    },
    loadOptions() {
      getMchOptions().then(res => {
        this.mchOptions = res.data
      })
      getVenOptions().then(res => {
        this.venOptions = res.data
      })
      getAgentOptions(null, 4).then(res => {
        this.catOptions = res.data
      })
      getAgentOptions(null, 2).then(res => {
        this.matOptions = res.data
      })
      getBankOptions(this.query.countryCode).then(res => {
        this.bankOptions = res.data
      })
      getPmOptions({ countryCode: this.query.countryCode, drawSwitch: true }).then(res => {
        this.pmOptions = res.data
      })
    },
    toQuery() {
      this.page = 0
      this.init()
      this.getSum()
    },
    download() {
      this.downloadLoading = true
      const targetType = this.query.targetType
      const targetId = this.query.targetId
      const createTime = this.query.createTime
      if (!isEmpty(targetType)) {
        this.downloadParam['targetType'] = targetType
      }
      if (!isEmpty(targetId)) {
        this.downloadParam['targetId'] = targetId
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[0])) {
        this.downloadParam['startTime'] = createTime[0]
      }
      if (!isEmpty(createTime) && !isEmpty(createTime[1])) {
        this.downloadParam['endTime'] = createTime[1]
      }
      this.downloadParam['Authorization'] = 'Bearer ' + getToken()
      // window.open(this.domainUrl + '/excel/draw/order?targetType=' + targetType + '&targetId=' + targetId + '&startTime=' + startTime + '&endTime=' + endTime, '_blank')
      this.openWindowWithPost(this.domainUrl + '/excel/draw/order', this.downloadParam)
      this.downloadLoading = false
    },
    openWindowWithPost(url, data) {
      var form = document.createElement('form')
      form.target = '_blank'
      form.method = 'POST'
      form.action = url
      form.style.display = 'none'

      for (var key in data) {
        var input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = data[key]
        form.appendChild(input)
      }
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    },
    getSum() {
      getDrawChildSum(this.params).then(res => {
        this.statistics = res.statistics
      })
    },
    toChange() {
      const targetType = this.query.targetType
      this.targetOptions = []
      if (targetType === '1') {
        this.targetOptions = this.mchOptions
      }
      if (targetType === '5') {
        this.targetOptions = this.venOptions
      }
      if (targetType === '2') {
        this.targetOptions = this.matOptions
      }
      if (targetType === '4') {
        this.targetOptions = this.catOptions
      }
      this.query.targetId = null
      this.toQuery()
    },
    toTarget(val) {
      this.$set(this.query, this.query.targetId, val.value)
      this.toQuery()
    }
  }
}
</script>
