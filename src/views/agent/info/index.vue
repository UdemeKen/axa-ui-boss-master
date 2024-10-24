<template>
  <div class="app-container" style="min-width: 1200px">
    <template>
      <div class="head-container">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="2">商户代理</el-menu-item>
          <el-menu-item index="4">通道代理</el-menu-item>
        </el-menu>
        <!-- 搜索 -->
        <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
          <el-select v-model="query.countryCode" filterable clearable placeholder="请选择国家" class="filter-item" style="width: 120px" @change="toQuery">
            <el-option
              v-for="item in countryOptions"
              :key="item.code"
              :label="item.code +'-'+ item.name"
              :value="item.code"/>
          </el-select>
          <el-select v-model="query.agentId" :placeholder="'选择'+targetName+'代理'" filterable clearable class="filter-item" style="width:160px" @change="toQuery">
            <el-option v-for="item in agentOptions" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <el-input v-model="query.name" clearable placeholder="商户代理名" style="width: 120px;" class="filter-item"/>
          <el-input v-model="query.loginAccount" clearable placeholder="登录账户" style="width: 125px;" class="filter-item"/>
          <el-select v-model="query.auditStatus" clearable placeholder="审核" class="filter-item" style="width: 80px" @change="toQuery">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.key"/>
          </el-select>
          <el-select v-model="query.disabled" clearable placeholder="状态" class="filter-item" style="width: 90px" @change="toQuery">
            <el-option v-for="item in disabledOptions" :key="item.key" :label="item.name" :value="item.key"/>
          </el-select>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
          <div style="display: inline-block;margin: 0px 2px; float:right">
            <add v-if="isAuth('agt:add')"/>
            <el-button v-if="isAuth('agt:disabled')" :disabled="selections.length <= 0" class="filter-item" size="mini" type="warning" icon="el-icon-view" @click="disabledHandle(true)">批量禁用</el-button>
            <el-button v-if="isAuth('agt:disabled')" :disabled="selections.length <= 0" class="filter-item" size="mini" type="success" icon="el-icon-view" @click="disabledHandle(false)">批量启用</el-button>
          </div>
        </blockquote>
      </div>
    </template>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column label="国家" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode +'-'+ scope.row.countryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" :label="targetName+'代理'" prop="name" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="loginAccount" label="登录账号" min-width="80px"/>
      <el-table-column :show-overflow-tooltip="true" prop="mobile" label="电话" min-width="100px"/>
      <el-table-column :show-overflow-tooltip="true" prop="trxAddress" label="TRX地址" width="265px"/>
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
      <el-table-column label="提现开关" align="center" min-width="70px">
        <template slot-scope="scope">
          <span v-if="scope.row.drawSwitch" style="color: #67C23A">开启</span>
          <span v-else style="color:red;">关闭</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="loginLastTime" label="最后登录日期" min-width="133px" />
      <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期" min-width="133px" />
      <el-table-column label="操作" align="center" fixed="right" width="120px">
        <template slot-scope="scope">
          <edit :data="scope.row" :sup_this="sup_this"/>
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
import { disAgent, getAgentOptions } from '@/api/agent'
import initData from '../../../mixins/initData'
import { isEmpty } from '@/utils/index'
import edit from './module/edit'
import add from './module/add'
import countryOptions from '@/utils/country'
export default {
  components: { add, edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, countryOptions: countryOptions, activeIndex: '2', agentType: 2, targetName: '商户', pageNum: 1, selections: [], agentOptions: [],
      disabledOptions: [
        { key: 'true', name: '禁用' },
        { key: 'false', name: '启用' }
      ],
      statusOptions: [
        { key: '0', name: '待审' },
        { key: '1', name: '通过' },
        { key: '2', name: '驳回' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.loadOptions(2)
  },
  methods: {
    isAuth,
    isEmpty,
    beforeInit() {
      this.pageNum = this.page
      this.url = 'agent/page'
      this.params = { pageIndex: this.page, pageSize: this.size, agentType: this.agentType }
      const query = this.query
      const agentId = query.agentId
      const disabled = query.disabled
      const name = query.name
      const loginAccount = query.loginAccount
      const auditStatus = query.auditStatus
      const countryCode = query.countryCode
      const countryCodeList = []
      if (!isEmpty(countryCode)) {
        countryCodeList.push(countryCode)
        this.params['countryCodeList'] = countryCodeList
      }
      if (!isEmpty(agentId)) { this.params['agentId'] = agentId }
      if (!isEmpty(name)) { this.params['name'] = name }
      if (!isEmpty(loginAccount)) { this.params['loginAccount'] = loginAccount }
      if (!isEmpty(disabled)) { this.params['disabled'] = disabled }
      if (!isEmpty(auditStatus)) { this.params['auditStatus'] = auditStatus }
      return true
    },
    toQuery() {
      this.page = 0
      this.init()
    },
    disabledHandle(dis) {
      const title = dis ? '禁用' : '启用'
      const ids = this.selections.map(item => { return item.id })
      const names = this.selections.map(item => { return item.name })
      this.$confirm(`确定对【 ${names.join('，')} 】进行【 ${title} 】操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { 'idList': ids, 'disabled': dis }
        disAgent(data).then(res => {
          this.$notify({
            title: title + '成功',
            type: 'success',
            duration: 2500
          })
          this.page = this.pageNum
          this.init()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {})
    },
    selectionChangeHandle(val) {
      this.selections = val
    },
    loadOptions(agentType) {
      getAgentOptions(null, agentType).then(res => {
        this.agentOptions = res.data
      })
    },
    handleSelect(key, keyPath) {
      if (key === '2') {
        this.activeIndex = '2'
        this.targetName = '商户'
        this.agentType = 2
        this.loadOptions(2)
        this.query.agentId = null
        this.toQuery()
      } else {
        this.activeIndex = '4'
        this.targetName = '通道'
        this.agentType = 4
        this.loadOptions(4)
        this.query.agentId = null
        this.toQuery()
      }
    }
  }
}
</script>
<style>
.head-container .el-menu--horizontal{
  margin-bottom: 15px;
}
.head-container .el-menu--horizontal .el-menu-item{
  background-color: #f5f7fa;
  height: 40px;
  line-height: 40px;
  border: 1px solid #e4e7ed!important;
  border-radius: 4px 4px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-left: -1px;
  margin-bottom: -1px;
}
.head-container .el-menu--horizontal .el-menu-item.is-active{
  background-color: #fff;
  color: #409EFF;
  font-weight: bold;
  border-bottom: 1px solid #FFF!important;
}
</style>
