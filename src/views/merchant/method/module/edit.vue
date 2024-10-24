<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作
        <i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isAuth('mch:pm:update')" command="editInfo">编辑商户通道</el-dropdown-item>
        <el-dropdown-item v-if="isAuth('mch:pm:delete')" command="deleteInfo">删除商户通道</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <eForm ref="form" :mch-options="[]" :page-num="pageNum" :sup_this="sup_this" :is-add="false" />
  </div>
</template>
<script>
import eForm from './form'
import { isAuth } from '@/utils/auth'
import { mathMul, mathDiv } from '@/utils/math'
import { removeMpm } from '@/api/mch-pm'
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
    mchOptions: {
      type: Array,
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
        mchId: this.data.mchId.toString(),
        mchName: this.data.mchName,
        paymentType: this.data.paymentType,
        channelId: this.data.channelId.toString(),
        channelName: this.data.channelName,
        methodCode: this.data.methodCode.toString(),
        methodName: this.data.methodName,
        payRate: mathMul(this.data.payRate, 100),
        payCost: mathDiv(this.data.payCost, 100),
        agentRate: mathMul(this.data.agentRate, 100),
        pollWeight: this.data.pollWeight.toString(),
        disabled: this.data.disabled.toString(),
        minAmount: this.data.minAmount,
        maxAmount: this.data.maxAmount
      }
      _this.dialog = true
    },
    handleCommand: function (command) {
      switch (command) {
        case 'editInfo':
          this.editInfo()
          break
        case "deleteInfo":
          this.$confirm('确定要删除该通道吗?', '操作确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const loading = this.$loading({
              lock: true,
              text: '正在删除',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            const _this = this.$refs.form
            removeMpm({ id: this.data.id }).then(res => {
              this.$notify({
                title: '删除成功',
                type: 'success',
                duration: 2500
              })
              loading.close();
              _this.sup_this.page = this.pageNum
              _this.sup_this.init()
            }).catch(err => {
              loading.close();
            })
          }).catch(() => {

          });
          break;
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
