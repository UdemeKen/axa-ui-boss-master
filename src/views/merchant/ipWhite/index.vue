<template>
  <div class="app-container" style="min-width: 1450px">
    <eHeader :query="query" :page-num="pageNum" :selections="selections"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="45px"/>
      <el-table-column label="编号" min-width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="mchId" label="商户ID" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="mchName" label="商户名称" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="ip" label="白名单IP" min-width="80px"/>
      <el-table-column :show-overflow-tooltip="true" prop="remark" label="备注" min-width="120px"/>
      <el-table-column :show-overflow-tooltip="true" prop="createdAt" label="创建时间" min-width="120px"/>
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
import { getMchOptions } from '@/api/mch'
import { mathDiv, mathMul } from '@/utils/math'
import { getAgentOptions } from '@/api/agent'
import { isAuth } from '@/utils/auth'
import { isEmpty } from '@/utils/index'
import initData from '../../../mixins/initData'
import edit from "@/views/merchant/ipWhite/module/edit";
import add from "@/views/merchant/ipWhite/module/add";
import eHeader from "@/views/merchant/ipWhite/module/header";
export default {
  components: { eHeader,add,edit },
  mixins: [initData],
  data() {
    return {
      sup_this: this, pageNum: 1, selections: [], mchOptions: [], matOptions: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    //this.loadMchOptions()
    //this.loadMatOptions()
  },
  methods: {
    isAuth,
    mathDiv,
    mathMul,
    beforeInit() {
      this.pageNum = this.page
      this.url = 'merchant/ip/white/page'
      this.params = { pageIndex: this.page, pageSize: this.size }
      const query = this.query
      const id = query.id
      const mchId = query.mchId
      const mchName = query.mchName
      const ip = query.ip
      const remark = query.remark
      const createdAt = query.createdAt

      if (!isEmpty(id)) { this.params['id'] = id }
      if (!isEmpty(mchId)) { this.params['mchId'] = mchId }
      if (!isEmpty(mchName)) { this.params['mchName'] = mchName }
      if (!isEmpty(ip)) { this.params['ip'] = ip }
      if (!isEmpty(remark)) { this.params['remark'] = remark }
      if (!isEmpty(createdAt)) { this.params['createdAt'] = createdAt }
      return true
    },
    // 多选
    selectionChangeHandle(val) {
      this.selections = val
    },
    loadMchOptions() {
      getMchOptions().then(res => {
        this.mchOptions = res.data
      })
    },
    loadMatOptions() {
      getAgentOptions(null, 2).then(res => {
        this.matOptions = res.data
      })
    },
    addHandle(){
      this.$nextTick(() => {
        this.$refs.add.init()
      })
    }
  }
}
</script>

<style scoped>

</style>
