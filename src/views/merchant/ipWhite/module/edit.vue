<template>
  <div>
    <el-dropdown @command="handleCommand">
      <el-button size="mini" type="primary">
        更多操作<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="isAuth('mch:ip:white:update')" command="editInfo">编辑白名单IP</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <eForm ref="form" :mat-options="matOptions" :page-num="pageNum" :sup_this="sup_this"/>
  </div>
</template>
<script>
import eForm from './form'
import { isAuth } from '@/utils/auth'
import { getIpWhiteInfo } from '@/api/mch-ipWhite'
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
  data() {
    return {
      matOptions: []
    }
  },
  methods: {
    isAuth,
    editInfo() {
      const _this = this.$refs.form
      getIpWhiteInfo({ id: this.data.id }).then(res => {
        if (res.success) {
          _this.form = {
            id: res.data.id,
            mchId: res.data.mchId,
            ip: res.data.ip,
            remark: res.data.remark
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
.el-dropdown-menu__item{
  padding: 0 10px;
  line-height: 30px;
}
</style>
