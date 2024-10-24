<template>
  <div>
    <el-button size="mini" type="primary" @click="to">编辑</el-button>
    <eForm ref="form" :menus="menus" :sup_this="sup_this" :is-add="false"/>
  </div>
</template>
<script>
import eForm from './form'
import { isEmpty } from '@/utils/index'
export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    },
    menus: {
      type: Array,
      required: true
    }
  },
  methods: {
    to() {
      const iconClass = isEmpty(this.data.icon) ? '' : this.data.icon
      const _this = this.$refs.form
      _this.form = { id: this.data.id, iconClass: iconClass, name: this.data.name, codeStr: this.data.codeStr, sortNum: this.data.ordinal, resType: this.data.resType.toString(), reqMethod: this.data.method, path: this.data.path, component: this.data.component, parentId: this.data.parentId }
      _this.dialog = true
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
