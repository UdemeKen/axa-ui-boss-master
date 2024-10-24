<template>
  <div class="head-container">
    <!-- 新增 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        v-if="isAuth('res:add')"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="$refs.form.dialog = true">新增</el-button>
      <eForm ref="form" :menus="menus" :is-add="true"/>
    </div>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import eForm from './form'
export default {
  components: { eForm },
  props: {
    menus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      downloadLoading: false
    }
  },
  methods: {
    isAuth
  }
}
</script>
