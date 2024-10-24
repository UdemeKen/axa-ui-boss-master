<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isAuth('vpe:update')" command="editInfo">编辑收款账户</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <eForm ref="form" :ven-options="[]" :bank-options="bankOptions" :pm-options="pmOptions" :page-num="pageNum" :sup_this="sup_this" :is-add="false"/>
  </div>
</template>
<script>
import eForm from './form'
import { isAuth } from '@/utils/auth'
import { mathDiv } from '@/utils/math'
import { isEmpty } from '@/utils/index'
import { getVenPayee } from '@/api/ven-payee'

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
    pmOptions: {
      type: Array,
      required: true
    },
    bankOptions: {
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
      getVenPayee({ id: this.data.id }).then(res => {
        if (res.success) {
          if (isEmpty(res.data.kvList)) {
            _this.kvList = [{ k: 'key', v: '' }]
          } else {
            _this.kvList = res.data.kvList
          }
          _this.countryName = res.data.countryName
          _this.changeVendor(res.data.countryCode)
          _this.form = {
            id: res.data.id,
            venId: res.data.venId,
            venName: res.data.venName,
            methodCode: res.data.methodCode,
            bankCode: res.data.bankCode,
            identityType: res.data.identityType,
            identity: res.data.identity,
            payeeOwner: res.data.payeeOwner,
            payeeKey: res.data.payeeKey,
            payeeSecret: res.data.payeeSecret,
            payeeAttach: res.data.payeeAttach,
            payeeJson: '',
            loginPwd: res.data.loginPwd,
            xferPwd: res.data.xferPwd,
            supportNo: res.data.supportNo.toString(),
            paySwitch: res.data.paySwitch.toString(),
            payMinAmount: mathDiv(this.data.payMinAmount, 100),
            payMaxAmount: mathDiv(this.data.payMaxAmount, 100),
            midSwitch: res.data.midSwitch.toString(),
            drawSwitch: res.data.drawSwitch.toString(),
            drawMinAmount: mathDiv(this.data.drawMinAmount, 100),
            drawMaxAmount: mathDiv(this.data.drawMaxAmount, 100),
            disabled: res.data.disabled.toString(),
            auditStatus: res.data.auditStatus.toString(),
            auditRemark: res.data.auditRemark
          }
        }
      }).catch(err => {
        console.log(err)
      })
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
