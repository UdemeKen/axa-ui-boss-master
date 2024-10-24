<template>
  <div>
    <el-button v-if="isAuth('role:update')" size="mini" type="primary" @click="to">编辑角色</el-button>
    <el-button v-if="isAuth('role:res')" size="mini" type="primary" @click="toResource">菜单权限</el-button>
    <el-button v-if="isAuth('role:country')" size="mini" type="primary" @click="toCountry">国家权限</el-button>
    <eForm ref="form" :sup_this="sup_this" :is-add="false"/>
    <rForm ref="resource" :sup_this="sup_this"/>
    <cForm ref="country" :sup_this="sup_this"/>
  </div>
</template>
<script>
import { isAuth } from '@/utils/auth'
import eForm from './form'
import rForm from './resource'
import cForm from './country'
import { treeDataTranslate } from '@/utils/index'
export default {
  components: { eForm, rForm, cForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    },
    resOptions: {
      type: Array,
      required: true
    }
  },
  methods: {
    isAuth,
    to() {
      const _this = this.$refs.form
      _this.form = { id: this.data.id, name: this.data.name, codeStr: this.data.codeStr, sortNum: this.data.sortNum }
      _this.dialog = true
    },
    toResource() {
      const _this = this.$refs.resource
      _this.resOptions = treeDataTranslate(this.resOptions, 'id')
      _this.dialog = true
      this.$nextTick(function() {
        _this.setChecked(this.data.id, this.data.name)
      })
    },
    toCountry() {
      const _this = this.$refs.country
      _this.setChecked(this.data.id, this.data.name)
    }
  }
}
</script>

<style scoped>
  div{
    display: inline-block;
    margin-right: 3px;
  }
</style>
