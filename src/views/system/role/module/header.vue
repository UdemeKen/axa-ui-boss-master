<template>
  <div class="head-container">
    <!-- 新增 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        v-if="isAuth('role:add')"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="$refs.form.dialog = true">新增</el-button>
      <eForm ref="form" :res-options="resOptions" :is-add="true"/>
    </div>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import eForm from './form'
// 查询条件
export default {
  components: { eForm },
  props: {
    resOptions: {
      type: Array,
      required: true
    }
  },
  methods: {
    isAuth
  }
}
</script>
