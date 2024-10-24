<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isAuth('bank:update')" command="editInfo">编辑银行</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <eForm ref="form" :ven-options="[]" :page-num="pageNum" :sup_this="sup_this" :is-add="false"/>
  </div>
</template>
<script>
import eForm from './form'
import { isAuth } from '@/utils/auth'

export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    pageNum: {
      type: Number,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  methods: {
    isAuth,
    editInfo() {
      const _this = this.$refs.form
      _this.countryName = this.data.countryName
      _this.form = {
        id: this.data.id,
        countryCode: this.data.countryCode,
        currencyCode: this.data.currencyCode,
        bankCode: this.data.bankCode,
        bankName: this.data.bankName,
        bankCnName: this.data.bankCnName,
        iconUrl: this.data.iconUrl,
        jsUrl: this.data.jsUrl,
        sortNum: this.data.sortNum,
        disabled: this.data.disabled.toString()
      }
      _this.dialog = true
    },
    handleCommand: function(command) {
      switch (command) {
        case 'editInfo':
          this.editInfo()
          break
        default:
          this.$message('请确认操作')
      }
    }
  }
}
</script>

<style scoped>
div {
  display: inline-block;
  margin-right: 3px;
}

.el-dropdown-menu__item {
  padding: 0 10px;
  line-height: 30px;
}
</style>
