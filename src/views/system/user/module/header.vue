<template>
  <div class="head-container">
    <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
      <el-input v-model="query.name" clearable placeholder="用户名关键字" style="width: 180px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.disabled" clearable placeholder="状态" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-select v-model="query.roleId" filterable clearable placeholder="角色" class="filter-item" style="width:150px" @change="toQuery">
        <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;float:right">
        <el-button
          v-if="isAuth('user:add')"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          style="margin-right: 12px;"
          @click="$refs.form.dialog = true">新增用户</el-button>
        <eForm ref="form" :role-options="roleOptions" :is-add="true"/>
        <el-button v-if="isAuth('user:disabled')" :disabled="this.$parent.selections.length <= 0" class="filter-item" size="mini" type="warning" icon="el-icon-view" @click="disabledHandle(true)">批量禁用</el-button>
        <el-button v-if="isAuth('user:disabled')" :disabled="this.$parent.selections.length <= 0" class="filter-item" size="mini" type="success" icon="el-icon-view" @click="disabledHandle(false)">批量启用</el-button>
      </div>
    </blockquote>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { disabled } from '@/api/sys-user'
import eForm from './form'
// 查询条件
export default {
  components: { eForm },
  props: {
    roleOptions: {
      type: Array,
      required: true
    },
    query: {
      type: Object,
      required: true
    },
    pageNum: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      enabledTypeOptions: [
        { key: 'true', display_name: '禁用' },
        { key: 'false', display_name: '启用' }
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
      const names = this.$parent.selections.map(item => { return item.name })
      this.$confirm(`确定对【 ${names.join('，')} 】进行【 ${title} 】操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = { 'idList': ids, 'disabled': dis }
        disabled(data).then(res => {
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
