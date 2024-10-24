<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog"
    :title="isAdd ? '新增商户通道' : '编辑商户通道'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="95px">
      <el-form-item label="通道类型" prop="paymentType">
        <el-select v-if="isEmpty(form.id)" v-model="form.paymentType" placeholder="选择通道类型" class="filter-item"
          style="width: 365px">
          <el-option label="支付通道" value="0" />
          <el-option label="代付通道" value="1" />
        </el-select>
        <span v-else>{{ form.paymentType == 0 ? '支付' : '代付' }}通道</span>
      </el-form-item>
      <el-form-item label="选择商户" prop="mchId">
        <el-select v-if="isEmpty(form.id)" v-model="form.mchId" clearable filterable placeholder="请选择商户"
          class="filter-item" style="width: 365px">
          <el-option v-for="item in mchOptions" :key="item.id" :label="item.name + ' - ' + item.code" :value="item.id"
            @click.native="changeMerchant(item.code)" />
        </el-select>
        <span v-else>{{ form.mchName }}</span>
      </el-form-item>
      <el-form-item label="支付通道" prop="channelId">
        <el-select v-if="isEmpty(form.id)" v-model="form.channelId" clearable filterable placeholder="请选择支付通道"
          class="filter-item" style="width: 365px" @change="changeChannel()">
          <el-option v-for="item in pcOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <span v-else>{{ form.channelName }}</span>
      </el-form-item>
      <el-form-item label="支付方式" prop="methodCode">
        <el-select v-if="isEmpty(form.id)" v-model="form.methodCode" clearable filterable placeholder="请选择支付方式"
          class="filter-item" style="width: 365px">
          <el-option v-for="item in pmOptions" :key="item.code" :label="item.name + ' - ' + item.code" :value="item.code" />
        </el-select>
        <span v-else>{{ form.methodName }}</span>
      </el-form-item>
      <el-form-item v-show="form.paymentType == 0" label="代收费率" prop="payRate" style="margin-bottom:5px">
        <el-input v-if="isEmpty(form.paymentType) || form.paymentType == 0" v-model="form.payRate"
          placeholder="0-30 最多1位小数(千分)">
          <template slot="append">%</template>
        </el-input>
        <span v-else>0%</span>
        <br><span style="color:#606266;font-size: 12px">进单代收费率</span>
      </el-form-item>
      <el-form-item v-show="form.paymentType == 0" label="代收费用" prop="payCost" style="margin-bottom:5px">
        <el-input v-if="isEmpty(form.paymentType) || form.paymentType == 0" v-model="form.payCost"
          placeholder="0-10000 最多2位小数">
          <template slot="append">元</template>
        </el-input>
        <span v-else>0%</span>
        <br><span style="color:#606266;font-size: 12px">进单代收费用</span>
      </el-form-item>
      <el-form-item v-show="form.paymentType == 0" label="代理费率" prop="agentRate" style="margin-bottom:5px">
        <el-input v-if="isEmpty(form.paymentType) || form.paymentType == 0" v-model="form.agentRate"
          placeholder="0-30 最多1位小数(千分)">
          <template slot="append">%</template>
        </el-input>
        <span v-else>0%</span>
        <br><span style="color:#606266;font-size: 12px">商户代理费率</span>
      </el-form-item>
      <el-form-item label="轮询权重" prop="pollWeight">
        <el-select v-model="form.pollWeight" placeholder="选择权重值">
          <el-option label="高" value="3" />
          <el-option label="中" value="2" />
          <el-option label="低" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="通道金额" required>
        <el-row>
          <el-col :span="11">
            <el-form-item prop="minAmount" style="margin-bottom: 0px">
              <el-input v-model.number="form.minAmount" clearable placeholder="最小支付金额">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="line" style="text-align: center">-</el-col>
          <el-col :span="11">
            <el-form-item prop="maxAmount" style="margin-bottom: 0px">
              <el-input v-model.number="form.maxAmount" clearable placeholder="最大支付金额">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="启用状态" prop="disabled">
        <el-radio v-model="form.disabled" label="false">启用</el-radio>
        <el-radio v-model="form.disabled" label="true">禁用</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { getPmOptions, getPcOptions } from '@/api/payment'
import { editMpm, addMpm } from '@/api/mch-pm'
import { validatPercent } from '@/utils/validate'
import { mathDiv, mathMul } from '@/utils/math'
import { isEmpty } from '@/utils/index'
export default {
  name: 'Form',
  props: {
    sup_this: {
      type: Object,
      default: null
    },
    isAdd: {
      type: Boolean,
      required: true
    },
    mchOptions: {
      type: Array,
      required: true
    },
    pageNum: {
      type: Number,
      required: true
    }
  },
  data() {
    const checkRates = (rule, value, callback) => {
      if (!isEmpty(value) && !validatPercent(mathDiv(value, 100))) {
        this.activeName = 'payment'
        callback(new Error('费率为 0-30 最多1位小数(千分)'))
      } else {
        callback()
      }
    }
    const checkMax = (rule,value,callback) => {
      if (isEmpty(value)) {
        callback(new Error('请输入最大金额'))
      }else if(value <= this.form.minAmount){
        callback(new Error('必须大于最小金额'))
      }else{
        callback()
      }
    }
    return {
      dialog: false, loading: false, countryName: '', pmOptions: [], pcOptions: [],
      form: {
        id: null,
        countryCode: null,
        mchId: null,
        mchName: '',
        paymentType: null,
        channelId: null,
        channelName: '',
        methodCode: '',
        methodName: '',
        payRate: 0,
        payCost: 0,
        agentRate: 0,
        pollWeight: null,
        disabled: null,
        minAmount: 1,
        maxAmount: 100000
      },
      rules: {
        countryCode: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ],
        mchId: [
          { required: true, message: '请选择商户', trigger: 'change' }
        ],
        paymentType: [
          { required: true, message: '请选择通道类型', trigger: 'change' }
        ],
        channelId: [
          { required: true, message: '请选择支付通道', trigger: 'change' }
        ],
        methodCode: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        payRate: [
          { required: true, validator: checkRates, trigger: 'blur' }
        ],
        payCost: [
          { required: true, message: '0-10000 最多2位小数', trigger: 'blur' }
        ],
        agentRate: [
          { required: true, validator: checkRates, trigger: 'blur' }
        ],
        pollWeight: [
          { required: true, message: '请选择轮询权重', trigger: 'change' }
        ],
        disabled: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        minAmount: [
          { required: true, message: '请输入单笔最小金额', trigger: 'blur' },
          { type: 'number', min: 1, max: 10000000, message: '金额 1-10000000', trigger: 'blur' }
        ],
        maxAmount:[
          { required: true, validator: checkMax, trigger: 'blur' },
          { type: 'number', min: 1, max: 100000000, message: '金额 1-100000000', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    isAuth,
    isEmpty,
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const param = Object.assign({}, this.form)
          param.payRate = mathDiv(this.form.payRate, 100)
          param.payCost = mathMul(this.form.payCost, 100)
          param.agentRate = mathDiv(this.form.agentRate, 100)
          this.loading = true
          if (this.isAdd) {
            this.doAdd(param)
          } else {
            this.doEdit(param)
          }
        } else {
          return false
        }
      })
    },
    doAdd(param) {
      addMpm(param).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.page = 1
        this.$parent.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit(param) {
      editMpm(param).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.page = this.pageNum
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: null,
        countryCode: null,
        mchId: null,
        mchName: '',
        paymentType: null,
        channelId: null,
        channelName: '',
        methodCode: '',
        methodName: '',
        payRate: 0,
        payCost: 0,
        agentRate: 0,
        pollWeight: null,
        disabled: null
      }
    },
    changeMerchant(countryCode) {
      if (isEmpty(this.form.paymentType)) {
        this.$notify({
          title: '请选择通道类型',
          type: 'warning',
          duration: 2500
        })
        return
      }
      countryCode = isEmpty(countryCode) ? this.form.countryCode : countryCode
      this.form.countryCode = countryCode
      this.form.channelId = null
      this.form.methodCode = null
      this.pcOptions = []
      this.pmOptions = []
      if (!isEmpty(countryCode)) {
        getPcOptions({ countryCode: countryCode, paymentType: this.form.paymentType, disabled: false }).then(res => {
          this.pcOptions = res.data
        })
      }
    },
    changeChannel(channelId) {
      if (isEmpty(this.form.paymentType)) {
        this.$notify({
          title: '请选择通道类型',
          type: 'warning',
          duration: 2500
        })
        return
      }
      channelId = isEmpty(channelId) ? this.form.channelId : channelId
      const countryCode = isEmpty(countryCode) ? this.form.countryCode : countryCode
      const paySwitch = this.form.paymentType === '0' ? true : null
      const drawSwitch = this.form.paymentType === '1' ? true : null
      this.pmOptions = []
      this.form.methodCode = null
      if (!isEmpty(channelId)) {
        getPmOptions({ countryCode: countryCode, disabled: false, paySwitch: paySwitch, drawSwitch: drawSwitch, channelId: channelId }).then(res => {
          this.pmOptions = res.data
        })
      }
    }
  }
}
</script>

<style>
.el-dialog .el-dialog__header {
  padding: 15px 20px 10px 20px;
}

.el-dialog .el-dialog__body {
  padding: 10px 20px;
}

.mer-img-name {
  cursor: pointer;
  width: 120px;
  color: #999;
}

.mer-img {
  width: 120px;
}</style>
