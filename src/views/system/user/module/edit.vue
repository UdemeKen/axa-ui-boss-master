<template>
  <div>
    <el-button v-if="isAuth('user:update')" size="mini" type="primary" @click="to">编辑</el-button>
    <eForm ref="form" :role-options="roleOptions" :sup_this="sup_this" :is-add="false"/>
  </div>
</template>
<script>
import eForm from './form'
import { isAuth } from '@/utils/auth'
export default {
  components: { eForm },
  props: {
    roleOptions: {
      type: Array,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  methods: {
    isAuth,
    to() {
      const _this = this.$refs.form
      _this.form = {
        id: this.data.id,
        loginAccount: this.data.loginAccount,
        name: this.data.name,
        phone: this.data.phone,
        email: this.data.email,
        loginGoogleCode: this.data.loginGoogleCode,
        disabled: this.data.disabled.toString(),
        roleId: this.data.roleId
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
  div {
    display: inline-block;
    margin-right: 3px;
  }
</style>
