<template>
  <div class="head-container">
    <!-- 搜索 -->
    <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
      <el-select v-model="query.id" filterable clearable placeholder="支付通道" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option v-for="item in pcOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-input v-model="query.appId" clearable placeholder="APP_ID" style="width: 150px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.paySwitch" clearable placeholder="支付开关" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option v-for="item in switchOptions" :key="item.key" :label="item.name" :value="item.key"/>
      </el-select>
      <el-select v-model="query.disabled" clearable placeholder="通道状态" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option label="启用" value="false"/>
        <el-option label="禁用" value="true"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px; float:right">
        <el-button
          v-if="isAuth('pc:add')"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="$refs.form.dialog = true">新增通道</el-button>
        <el-button v-if="isAuth('pc:disabled')" :disabled="this.$parent.selections.length <= 0" class="filter-item" size="mini" type="warning" icon="el-icon-view" @click="disabledHandle(true)">批量禁用</el-button>
        <el-button v-if="isAuth('pc:disabled')" :disabled="this.$parent.selections.length <= 0" class="filter-item" size="mini" type="success" icon="el-icon-view" @click="disabledHandle(false)">批量启用</el-button>
        <eForm ref="form" :page-num="pageNum" :is-add="true"/>
      </div>
    </blockquote>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { disPc } from '@/api/payment'
import eForm from './form'
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true
    },
    pcOptions: {
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
      switchOptions: [
        { key: 'true', name: '开启' },
        { key: 'false', name: '关闭' }
      ],
      statusOptions: [
        { key: '0', name: '待审' },
        { key: '1', name: '通过' },
        { key: '2', name: '驳回' }
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
      const title = dis ? '禁用' : '启用'
      const ids = this.$parent.selections.map(item => { return item.id })
      const names = this.$parent.selections.map(item => { return item.channelName })
      this.$confirm(`确定对【 ${names.join('，')} 】进行【 ${title} 】操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { 'idList': ids, 'disabled': dis }
        disPc(data).then(res => {
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
