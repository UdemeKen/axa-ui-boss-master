<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="isAdd ? '新增通道支付方式' : '编辑通道支付方式'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="支付通道" prop="channelId">
        <el-select v-if="isEmpty(form.id)" v-model="form.channelId" clearable filterable placeholder="请选择支付通道" class="filter-item" style="width: 360px">
          <el-option v-for="item in pcOptions" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
        <span v-else>{{ form.channelName }}</span>
      </el-form-item>
      <el-form-item size="mini" label="所属国家" prop="countryCode">
        <el-select v-if="isEmpty(form.id)" v-model="form.countryCode" filterable clearable placeholder="请选择国家" style="width: 360px">
          <el-option v-for="item in countryOptions" :key="item.code" :label="item.code +'-'+ item.name" :value="item.code" @click.native="changeCountry(item.code)"/>
        </el-select>
        <span v-else>{{ countryName }}</span>
      </el-form-item>
      <el-form-item label="支付方式" prop="methodCode">
        <el-select v-if="isEmpty(form.id)" v-model="form.methodCode" clearable filterable placeholder="请选择支付方式" class="filter-item" style="width: 365px">
          <el-option v-for="item in pmOptions" :key="item.code" :label="item.name +' - '+ item.code" :value="item.code"/>
        </el-select>
        <span v-else>{{ form.methodCode }}</span>
      </el-form-item>
      <el-form-item label="上游支付编码" prop="upMethodCode">
        <el-input v-model="form.upMethodCode" placeholder="上游支付编码长度 2-32" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="代收费率" prop="payRate">
        <el-input v-model="form.payRate" placeholder="0-30 最多1位小数" style="width: 360px;">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="代收费用" prop="payCost">
        <el-input v-model="form.payCost" placeholder="0-10000 最多2位小数" style="width: 360px;">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="代理费率" prop="agentPayRate">
        <el-input v-model="form.agentPayRate" placeholder="0-30 最多1位小数(千分)" style="width: 360px;">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="支付区间" required>
        <el-row>
          <el-col :span="11">
            <el-form-item prop="payMinAmount" style="margin-bottom: 0px">
              <el-input v-model.number="form.payMinAmount" clearable placeholder="最小支付金额" >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="line" style="text-align: center">-</el-col>
          <el-col :span="11">
            <el-form-item prop="payMaxAmount" style="margin-bottom: 0px">
              <el-input v-model.number="form.payMaxAmount" clearable placeholder="最大支付金额">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="轮询金额" prop="pollAmount">
        <el-input v-model.number="form.pollAmount" clearable placeholder="轮询金额" style="width: 360px;">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="支付排除金额" prop="excludeAmount">
        <el-input v-model="form.excludeAmount" placeholder="金额(元) 逗号隔开，0 不限制" style="width: 360px;"/>
      </el-form-item>
      <el-form-item label="支付固定金额" prop="fixedAmount">
        <el-input v-model="form.fixedAmount" placeholder="金额(元) 逗号隔开，0 不限制" style="width: 360px;"/>
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
import countryOptions from '@/utils/country'
import { getPmOptions, editPcm, addPcm } from '@/api/payment'
import { isEmpty } from '@/utils/index'
import { validatPercent, validatIDS } from '@/utils/validate'
import { mathMul, mathDiv } from '@/utils/math'
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
    pcOptions: {
      type: Array,
      required: true
    },
    pageNum: {
      type: Number,
      required: true
    }
  },
  data() {
    const checkMax = (rule, value, callback) => {
      if (isEmpty(value)) {
        callback(new Error('请输入最大金额'))
      } else if (value <= this.form.payMinAmount) {
        callback(new Error('必须大于最小金额'))
      } else {
        callback()
      }
    }
    const checkExMoney = (rule, value, callback) => {
      if (!isEmpty(value) && !validatIDS(value)) {
        callback(new Error('金额格式有误'))
      } else {
        callback()
      }
    }
    const checkRate = (rule, value, callback) => {
      if (isEmpty(value)) {
        callback(new Error('请输入费率'))
      } else if (validatPercent(mathDiv(value, 100))) {
        callback()
      } else {
        callback(new Error('费率为 0-30 最多1位小数(千分)'))
      }
    }
    return {
      dialog: false, loading: false, countryName: '', countryOptions: countryOptions, pmOptions: [],
      form: {
        id: null,
        countryCode: null,
        channelId: null,
        channelName: '',
        methodCode: '',
        upMethodCode: '',
        payMinAmount: 1,
        payMaxAmount: 100000,
        payRate: 0,
        payCost: 0,
        agentPayRate: 0,
        excludeAmount: '',
        fixedAmount: '',
        pollAmount: 0,
        disabled: null
      },
      rules: {
        channelId: [
          { required: true, message: '请选择支付通道', trigger: 'change' }
        ],
        countryCode: [
          { required: true, message: '请选择所属国家', trigger: 'change' }
        ],
        methodCode: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        payRate: [
          { required: true, validator: checkRate, trigger: 'blur' }
        ],
        payCost: [
          { required: true, message: '请输入代收费用', trigger: 'blur' }
        ],
        agentPayRate: [
          { required: true, validator: checkRate, trigger: 'blur' }
        ],
        payMinAmount: [
          { required: true, message: '请输入单笔最小金额', trigger: 'blur' },
          { type: 'number', min: 1, max: 10000000, message: '金额 1-10000000', trigger: 'blur' }
        ],
        payMaxAmount: [
          { required: true, validator: checkMax, trigger: 'blur' },
          { type: 'number', min: 1, max: 100000000, message: '金额 1-100000000', trigger: 'blur' }
        ],
        excludeAmount: [
          { required: false, validator: checkExMoney, trigger: 'blur' },
          { max: 120, message: '长度不能超过 120', trigger: 'blur' }
        ],
        fixedAmount: [
          { required: false, validator: checkExMoney, trigger: 'blur' },
          { max: 240, message: '长度不能超过 240', trigger: 'blur' }
        ],
        disabled: [
          { required: true, message: '请选择状态', trigger: 'change' }
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
          param.payMinAmount = mathMul(this.form.payMinAmount, 100)
          param.payMaxAmount = mathMul(this.form.payMaxAmount, 100)
          param.pollAmount = mathMul(this.form.pollAmount, 100)
          param.payRate = mathDiv(this.form.payRate, 100)
          param.payCost = mathMul(this.form.payCost, 100)
          param.agentPayRate = mathDiv(this.form.agentPayRate, 100)
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
      addPcm(param).then(res => {
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
      editPcm(param).then(res => {
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
        channelId: null,
        channelName: '',
        methodCode: '',
        upMethodCode: '',
        payMinAmount: 1,
        payMaxAmount: 100000,
        payRate: 0,
        payCost: 0,
        agentPayRate: 0,
        excludeAmount: '',
        fixedAmount: '',
        pollAmount: 0,
        disabled: null
      }
    },
    changeCountry(countryCode) {
      this.pmOptions = []
      this.form.methodCode = null
      getPmOptions({ countryCode: countryCode, disabled: false, channelId: null }).then(res => {
        this.pmOptions = res.data
      })
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
  .mer-img-name{
    cursor:pointer;
    width: 120px;
    color: #999;
  }
  .mer-img{
    width: 120px;
  }
</style>
