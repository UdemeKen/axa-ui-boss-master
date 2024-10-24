<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isAuth('pcm:update')" command="editInfo">编辑通道配置</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <eForm ref="form" :pc-options="[]" :pm-options="[]" :page-num="pageNum" :sup_this="sup_this" :is-add="false"/>
  </div>
</template>
<script>
import eForm from './form'
import { isAuth } from '@/utils/auth'
import { mathDiv, mathMul } from '@/utils/math'

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
        channelId: this.data.channelId,
        channelName: this.data.channelName,
        methodCode: this.data.methodCode,
        upMethodCode: this.data.upMethodCode,
        payMinAmount: mathDiv(this.data.payMinAmount, 100),
        payMaxAmount: mathDiv(this.data.payMaxAmount, 100),
        payRate: mathMul(this.data.payRate, 100),
        payCost: mathDiv(this.data.payCost, 100),
        agentPayRate: mathMul(this.data.agentPayRate, 100),
        excludeAmount: this.data.excludeAmount,
        fixedAmount: this.data.fixedAmount,
        pollAmount: mathDiv(this.data.pollAmount, 100),
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
