<template>
  <div class="head-container">
    <!-- 搜索 -->
    <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
      <el-input v-model="query.mchId" clearable placeholder="商户ID" style="width: 110px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-input v-model="query.ip" clearable placeholder="白名单IP" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px; float:right">
        <add v-if="isAuth('mch:ip:white:add')"/>
        <el-button v-if="isAuth('mch:ip:white:disabled')"
                   :disabled="this.$parent.selections.length <= 0" class="filter-item"
                   size="mini" type="warning" icon="el-icon-view" @click="disabledHandle(true)">批量删除
        </el-button>
      </div>
    </blockquote>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { disIpWhite } from '@/api/mch-ipWhite'
import add from './add'
import countryOptions from '@/utils/country'
export default {
  components: { add },
  props: {
    query: {
      type: Object,
      required: true
    },
    mchOptions: {
      type: Array,
      required: true
    },
    matOptions: {
      type: Array,
      required: true
    },
    pageNum: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      countryOptions: countryOptions,
      disabledOptions: [
        { key: 'true', name: '删除' },
        { key: 'false', name: '启用' }
      ]
    }
  },
  methods: {
    isAuth,
    toQuery() {
      this.$parent.page = 0
      this.$parent.init()
    },
    disabledHandle(dis) {
      const title = dis ? '删除' : '启用'
      const ids = this.$parent.selections.map(item => { return item.id })
      const names = this.$parent.selections.map(item => { return item.mchName })
      this.$confirm(`确定对【 ${names.join('，')} 】进行【 ${title} 】操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { 'idList': ids, 'disabled': dis }
        disIpWhite(data).then(res => {
          this.$notify({
            title: title + '成功',
            type: 'success',
            duration: 2500
          })
          this.$parent.page = this.pageNum
          this.$parent.init()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {})
    }
  }
}
</script>
