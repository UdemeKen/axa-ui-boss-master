<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isAuth('pc:update')" command="editInfo">编辑通道</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <eForm ref="form" :page-num="pageNum" :sup_this="sup_this" :is-add="false"/>
  </div>
</template>
<script>
import eForm from './form'
import { isAuth } from '@/utils/auth'
import { mathDiv, mathMul } from '@/utils/math'
import { isEmpty } from '@/utils/index'
import { getPcInfo } from '@/api/payment'

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
      getPcInfo({ id: this.data.id }).then(res => {
        if (res.success) {
          if (isEmpty(res.data.kvList)) {
            _this.kvList = [{ k: 'key', v: '' }]
          } else {
            _this.kvList = res.data.kvList
          }
          _this.loadCatOptions()
          _this.form = {
            id: res.data.id,
            channelName: res.data.channelName,
            channelCode: res.data.channelCode,
            channelRemark: res.data.channelRemark,
            channelType: res.data.channelType.toString(),
            catId: res.data.catId === 0 ? '0' : res.data.catId.toString(),
            catName: isEmpty(res.data.catName) ? '无代理' : res.data.catName,
            appId: res.data.appId,
            appSecret: res.data.appSecret,
            appJson: '',
            paySwitch: res.data.paySwitch.toString(),
            payUrl: res.data.payUrl,
            payNotifyUrl: res.data.payNotifyUrl,
            paySuccess: res.data.paySuccess,
            paySettleType: res.data.paySettleType.toString(),
            drawSwitch: res.data.drawSwitch.toString(),
            drawSuccess: res.data.drawSuccess,
            drawUrl: res.data.drawUrl,
            drawNotifyUrl: res.data.drawNotifyUrl,
            drawRate: mathMul(this.data.drawRate, 100),
            drawCost: mathDiv(this.data.drawCost, 100),
            drawMinAmount: mathDiv(this.data.drawMinAmount, 100),
            drawMaxAmount: mathDiv(this.data.drawMaxAmount, 100),
            drawSingleQuota: mathDiv(this.data.drawSingleQuota, 100),
            drawWeightNum: res.data.drawWeightNum.toString(),
            disabled: res.data.disabled.toString()
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
