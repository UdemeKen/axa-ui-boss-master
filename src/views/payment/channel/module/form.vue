<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="isAdd ? '新增支付通道' : '编辑支付通道'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
      <el-tabs v-model="activeName" type="card" style="min-height: 500px;">
        <el-form-item label="请选择国家" prop="countryCode" v-if="isAdd">
          <el-select v-model="form.countryCode" filterable clearable placeholder="请选择国家" class="filter-item"
                     style="width: 120px" @change="toQuery">
            <el-option
              v-for="item in countryOptions"
              :key="item.code"
              :label="item.code +'-'+ item.name"
              :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-tab-pane label="通道信息" name="basic">
          <el-form-item label="通道代理" prop="catId">
            <el-select v-model="form.catId" filterable clearable placeholder="选择代理" class="filter-item" style="width: 185px;">
              <el-option label="无代理" value="0"/>
              <el-option v-for="item in catOptions" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="通道名称" prop="channelName">
            <el-input v-model="form.channelName" placeholder="名称长度 2-32"/>
          </el-form-item>
          <el-form-item label="通道编码" prop="channelCode">
            <el-input v-model="form.channelCode" placeholder="联系研发获取编码"/>
          </el-form-item>
          <el-form-item label="通道类型" prop="channelType">
            <el-radio v-model="form.channelType" label="0">三方通道</el-radio>
            <el-radio v-model="form.channelType" label="1">卡商通道</el-radio>
          </el-form-item>
          <el-form-item label="通道状态" prop="disabled">
            <el-radio v-model="form.disabled" label="false">启用</el-radio>
            <el-radio v-model="form.disabled" label="true">禁用</el-radio>
          </el-form-item>
          <el-form-item label="通道备注" prop="channelRemark" style="margin-bottom: 0px">
            <el-input v-model="form.channelRemark" :rows="2" clearable type="textarea" placeholder="备注长度 0-120"/>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="支付配置" name="pay">
          <el-form-item label="支付开关" prop="paySwitch">
            <el-radio v-model="form.paySwitch" label="true">开启</el-radio>
            <el-radio v-model="form.paySwitch" label="false">关闭</el-radio>
          </el-form-item>
          <el-form-item label="支付地址" prop="payUrl">
            <el-input v-model="form.payUrl" placeholder="下单地址长度 12 - 120"/>
          </el-form-item>
          <el-form-item label="回调地址" prop="payNotifyUrl">
            <el-input v-model="form.payNotifyUrl" placeholder="支付回调地址长度 12 - 120"/>
          </el-form-item>
          <el-form-item label="成功标记" prop="paySuccess">
            <el-input v-model="form.paySuccess" placeholder="支付成功回调返回值"/>
          </el-form-item>
          <el-form-item label="结算方式" prop="paySettleType">
            <el-radio v-model="form.paySettleType" label="0">D0T0</el-radio>
            <el-radio v-model="form.paySettleType" label="1">D1T1</el-radio>
          </el-form-item>
          <el-form-item label="APP_ID" prop="appId">
            <el-input v-model="form.appId" placeholder="APP_SECRET长度 1-64"/>
          </el-form-item>
          <el-form-item label="APP_密钥" prop="appSecret">
            <el-input v-model="form.appSecret" :rows="3" clearable type="textarea" placeholder="APP_SECRET长度 1-1200"/>
          </el-form-item>
          <el-form-item
            v-for="(config, index) in kvList"
            :label="'上游配置' + (index+1)"
            :key="config.k +'-'+ (index+1)"
            class="is-required"
            style="margin-bottom: 10px">
            <el-input v-model="config.k" placeholder="KEY" style="width: 90px"/>
            <el-input v-model="config.v" placeholder="VALUE" style="width: 200px"/>
            <el-button icon="el-icon-plus" style="padding: 7px 10px" @click="addConfig"/>
            <el-button style="margin-left:0px;padding: 7px 10px" icon="el-icon-minus" @click.prevent="removeConfig(config)"/>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="代付配置" name="draw">
          <el-form-item label="代付开关" prop="drawSwitch">
            <el-radio v-model="form.drawSwitch" label="true">开启</el-radio>
            <el-radio v-model="form.drawSwitch" label="false">关闭</el-radio>
          </el-form-item>
          <el-form-item label="代付地址" prop="drawUrl">
            <el-input v-model="form.drawUrl" placeholder="下单地址长度 12 - 120"/>
          </el-form-item>
          <el-form-item label="回调地址" prop="drawNotifyUrl">
            <el-input v-model="form.drawNotifyUrl" placeholder="代付回调地址长度 12 - 120"/>
          </el-form-item>
          <el-form-item label="成功标记" prop="drawSuccess">
            <el-input v-model="form.drawSuccess" placeholder="代付成功回调返回值"/>
          </el-form-item>
          <el-form-item label="代付费率" prop="drawRate">
            <el-input v-model="form.drawRate" placeholder="0-30 最多1位小数(千分)">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="代付单笔费用" prop="drawCost">
            <el-input v-model="form.drawCost" clearable placeholder="代付单笔费用 最多2位小数">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="单笔限额" prop="drawSingleQuota">
            <el-input v-model="form.drawSingleQuota" placeholder="超过此金额自动拆单">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="金额区间" required="true">
            <el-row>
              <el-col :span="11">
                <el-form-item prop="drawMinAmount" style="margin-bottom: 0px">
                  <el-input v-model.number="form.drawMinAmount" clearable placeholder="最小代付金额" >
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="line" style="text-align: center">-</el-col>
              <el-col :span="11">
                <el-form-item prop="drawMaxAmount" style="margin-bottom: 0px">
                  <el-input v-model.number="form.drawMaxAmount" clearable placeholder="最大代付金额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="轮询权重" prop="drawWeightNum" style="margin-bottom: 0px">
            <el-select v-model="form.drawWeightNum" placeholder="选择权重值">
              <el-option label="高" value="5"/>
              <el-option label="中" value="3"/>
              <el-option label="低" value="2"/>
            </el-select>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { editPc, addPc } from '@/api/payment'
import { getAgentOptions } from '@/api/agent'
import { mathDiv, mathMul } from '@/utils/math'
import { isEmpty } from '@/utils/index'
import countryOptions from '@/utils/country'
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
    pageNum: {
      type: Number,
      required: true
    }
  },
  data() {
    const checkPay = (rule, value, callback) => {
      if (isEmpty(value)) {
        this.activeName = 'pay'
        callback(new Error('此项必填项'))
      } else {
        callback()
      }
    }
    const checkDraw = (rule, value, callback) => {
      if (isEmpty(value)) {
        this.activeName = 'draw'
        callback(new Error('此项必填项'))
      } else {
        callback()
      }
    }
    return {
      dialog: false, loading: false, activeName: 'basic', catOptions: [], kvList: [{ k: 'key', v: '' }], countryOptions: countryOptions,
      form: {
        id: null,
        countryCode: '',
        channelName: '',
        channelCode: '',
        channelRemark: '',
        channelType: '0',
        catId: null,
        agentName: '',
        appId: '',
        appSecret: '',
        appJson: '',
        paySwitch: 'true',
        payUrl: '',
        payNotifyUrl: '',
        paySuccess: '',
        paySettleType: null,
        drawSwitch: 'false',
        drawSuccess: '',
        drawUrl: '',
        drawNotifyUrl: '',
        drawRate: 0,
        drawCost: 0,
        drawMinAmount: 100,
        drawMaxAmount: 100000,
        drawSingleQuota: 5000,
        drawWeightNum: null,
        disabled: 'true'
      },
      rules: {
        channelName: [
          { required: true, message: '请输入通道名称', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
        ],
        channelCode: [
          { required: true, message: '请输入通道编码', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
        ],
        channelType: [
          { required: true, message: '请选择通道类型', trigger: 'change' }
        ],
        disabled: [
          { required: true, message: '请选择通道状态', trigger: 'change' }
        ],
        channelRemark: [
          { min: 1, max: 64, message: '长度在 1 到 120 个字符', trigger: 'blur' }
        ],
        paySwitch: [
          { required: true, validator: checkPay, trigger: 'change' }
        ],
        payUrl: [
          { required: true, validator: checkPay, trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' }
        ],
        payNotifyUrl: [
          { required: true, validator: checkPay, trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur' }
        ],
        paySuccess: [
          { required: true, validator: checkPay, trigger: 'blur' },
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        paySettleType: [
          { required: true, validator: checkPay, trigger: 'change' }
        ],
        appId: [
          { required: true, validator: checkPay, trigger: 'blur' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, validator: checkPay, trigger: 'blur' },
          { min: 1, max: 1200, message: '长度在 1 到 1200 个字符', trigger: 'blur' }
        ],
        drawSwitch: [
          { required: true, message: '请选择代付开关', trigger: 'change' }
        ],
        drawUrl: [
          { required: true, validator: checkDraw, trigger: 'blur' },
          { min: 1, max: 120, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        drawNotifyUrl: [
          { min: 1, max: 120, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        drawSuccess: [
          { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
        ],
        drawSingleQuota: [
          { required: true, validator: checkDraw, trigger: 'blur' }
        ],
        drawRate: [
          { required: true, validator: checkDraw, trigger: 'blur' }
        ],
        drawCost: [
          { required: true, validator: checkDraw, trigger: 'blur' }
        ],
        payMinAmount: [
          { required: true, validator: checkDraw, trigger: 'blur' },
          { type: 'number', min: 1, max: 100000, message: '金额 1~100000', trigger: 'blur' }
        ],
        payMaxAmount: [
          { required: true, validator: checkDraw, trigger: 'blur' },
          { type: 'number', min: 1, max: 100000000, message: '金额 1~100000000', trigger: 'blur' }
        ],
        drawWeightNum: [
          { required: true, validator: checkDraw, trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.loadCatOptions()
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
          let sub = false
          const map = {}
          this.kvList.forEach(function(data, index) {
            if (isEmpty(data.k) || isEmpty(data.v)) {
              this.activeName = 'pay'
              this.$message({
                message: '配置项' + (index + 1) + ': KEY与VALUE都不能为空',
                type: 'warning'
              })
              sub = true
            } else {
              map[data.k] = data.v
            }
          })
          if (sub) {
            return false
          }
          this.form.appJson = JSON.stringify(map)
          const param = Object.assign({}, this.form)
          param.drawRate = mathDiv(this.form.drawRate, 100)
          param.drawCost = mathMul(this.form.drawCost, 100)
          param.drawMinAmount = mathMul(this.form.drawMinAmount, 100)
          param.drawMaxAmount = mathMul(this.form.drawMaxAmount, 100)
          param.drawSingleQuota = mathMul(this.form.drawSingleQuota, 100)
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
      addPc(param).then(res => {
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
      editPc(param).then(res => {
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
      this.kvList = [{ k: 'key', v: '' }]
      this.$refs['form'].resetFields()
      this.form = {
        id: null,
        countryCode: '',
        channelName: '',
        channelCode: '',
        channelRemark: '',
        channelType: null,
        catId: null,
        appId: '',
        appSecret: '',
        appJson: '',
        paySwitch: null,
        payUrl: '',
        payNotifyUrl: '',
        paySuccess: '',
        paySettleType: null,
        drawSwitch: null,
        drawSuccess: '',
        drawUrl: '',
        drawNotifyUrl: '',
        drawRate: 0,
        drawCost: 0,
        drawMinAmount: 100,
        drawMaxAmount: 100000,
        drawSingleQuota: 5000,
        drawWeightNum: null,
        disabled: null
      }
    },
    addConfig() {
      this.kvList.push({
        k: '',
        v: ''
      })
    },
    removeConfig(item) {
      const index = this.kvList.indexOf(item)
      if (index !== -1 && this.kvList.length !== 1) {
        this.kvList.splice(index, 1)
      }
    },
    loadCatOptions() {
      getAgentOptions(null, 4).then(res => {
        this.catOptions = res.data
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
