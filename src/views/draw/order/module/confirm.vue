<template>
  <el-dialog :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialog" :title="(form.transType==0?'法币':'USDT')+'提现通过'" width="340px" @close="cancel">
    <p style="line-height: 24px; margin: -20px 0px 15px">
      提现金额：<span style="color: #F56C6C">{{ form.orderAmount }}</span><br>
      转账金额：<span style="color: #67C23A">{{ form.amount }}</span>&emsp;&emsp;
      手续费用：<span style="color: #E6A23C">{{ form.drawFee }}</span>
    </p>
    <p v-if="form.transType==1" style="line-height: 24px; margin: -10px 0px 15px">
      TRX接收地址：<br><span style="color: #409EFF">{{ form.payeeBankAccount }}</span>
    </p>
    <el-form ref="form" :model="form" size="small" label-width="70px">
      <el-form-item v-if="form.transType==1" label="转账凭证">
        <el-tooltip v-if="!isEmpty(form.bill)" placement="top" style="float:left;margin-right: 20px">
          <div slot="content"><img :src="form.bill" class="mer-img" style="max-width: 200px"></div>
          <span class="mer-img-name">{{ form.bill.substring(form.bill.length - 24,form.bill.length) }}</span>
        </el-tooltip>
        <el-upload
          :headers="headers"
          :show-file-list="false"
          :action="uploadImg"
          :before-upload="beforeUploadHandle"
          :on-success="successHandle">
          <el-button :loading="upLoading" size="mini" type="info" round icon="el-icon-upload">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="padding-top: 0px;margin-top: -15px">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" size="mini" @click="confirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { isEmpty } from '@/utils/index'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { passDraw, uploadDraw } from '@/api/order-draw'
import { mathMul, mathDiv } from '@/utils/math'
export default {
  props: {
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
      loading: false, dialog: false, upLoading: false, bankOptions: [], form: { transNo: null, transType: 0, orderAmount: 0, amount: 0, drawFee: 0, payeeBankAccount: '', bill: '' },
      headers: {
        'Authorization': 'Bearer ' + getToken()
      }
    }
  },
  computed: {
    ...mapGetters([
      'uploadImg'
    ])
  },
  methods: {
    isEmpty,
    mathMul,
    mathDiv,
    cancel() {
      this.resetForm()
    },
    confirm() {
      this.loading = true
      if (this.form.transType === 1) {
        this.pass(this.form.transNo, this.form.bill)
      }
      if (this.form.transType === 0) {
        this.upload(this.form.transNo)
      }
      this.loading = false
    },
    pass(orderNo, bill) {
      passDraw({ orderNo: orderNo, bill: bill }).then(res => {
        this.resetForm()
        if (res.success) {
          this.$notify({
            title: '提现确认成功',
            type: 'success',
            duration: 2500
          })
          this.sup_this.page = this.pageNum
          this.sup_this.init()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    upload(orderNo) {
      uploadDraw({ orderNo: orderNo }).then(res => {
        this.resetForm()
        if (res.success) {
          this.$notify({
            title: '提现已上报至通道',
            type: 'success',
            duration: 2500
          })
          this.sup_this.page = this.pageNum
          this.sup_this.init()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { transNo: null, transType: 0, orderAmount: 0, amount: 0, drawFee: 0, payeeBankAccount: '', bill: '' }
    },
    beforeUploadHandle(file) {
      if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        this.$message.error('只支持jpg、png、gif格式的图片！')
        return false
      }
      const size = file.size / 1024 / 1024
      if (size > 2) {
        this.$message.error('图片大小不能超过2M！')
        return false
      }
      this.upLoading = true
    },
    successHandle(response) {
      this.upLoading = false
      const form = this.form
      if (response && response.success) {
        form.bill = response.data
      } else {
        this.$message.error(response.msg)
      }
    }
  }
}
</script>

<style scoped>

</style>
