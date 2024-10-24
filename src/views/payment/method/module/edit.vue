<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isAuth('pm:update')" command="editInfo">编辑产品</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <eForm ref="form" :ven-options="[]" :page-num="pageNum" :sup_this="sup_this" :is-add="false"/>
  </div>
</template>
<script>
import eForm from './form'
import { isAuth } from '@/utils/auth'
import { mathMul } from '@/utils/math'

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
        methodCode: this.data.methodCode,
        methodName: this.data.methodName,
        floatInSwitch: this.data.floatInSwitch.toString(),
        floatInRate: mathMul(this.data.floatInRate, 100),
        floatInDate: [this.data.floatInStart, this.data.floatInEnd],
        floatInStart: this.data.floatInStart,
        floatInEnd: this.data.floatInEnd,
        floatOutSwitch: this.data.floatOutSwitch.toString(),
        floatOutRate: mathMul(this.data.floatOutRate, 100),
        floatOutDate: [this.data.floatOutStart, this.data.floatOutEnd],
        floatOutStart: this.data.floatOutStart,
        floatOutEnd: this.data.floatOutEnd,
        iconUrl: this.data.iconUrl,
        paySwitch: this.data.paySwitch,
        drawSwitch: this.data.drawSwitch,
        rechgSwitch: this.data.rechgSwitch,
        expMin: this.data.expMin,
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
