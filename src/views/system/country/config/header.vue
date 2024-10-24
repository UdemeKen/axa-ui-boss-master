<template>
  <div class="head-container">
    <!-- 搜索 -->
    <blockquote class="my-blockquote" size="mini" style="padding-bottom: 5px;">
      <el-select v-model="query.countryCode" filterable clearable placeholder="请选择国家" class="filter-item" style="width: 120px" @change="toQuery">
        <el-option
          v-for="item in countryOptions"
          :key="item.code"
          :label="item.code +'-'+ item.name"
          :value="item.code"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </blockquote>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import countryOptions from '@/utils/country'
export default {
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      countryOptions: countryOptions
    }
  },
  methods: {
    isAuth,
    toQuery() {
      this.$parent.page = 0
      this.$parent.init()
    }
  }
}
</script>
