<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="isAdd ? '新增支付产品' : '编辑支付产品'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" style="padding-right: 10px;">
      <el-form-item size="mini" label="所在国家" prop="countryCode">
        <el-select v-if="isEmpty(form.id)" v-model="form.countryCode" filterable clearable placeholder="请选择国家" style="width: 100%;">
          <el-option
            v-for="item in countryOptions"
            :key="item.code"
            :label="item.code +'-'+ item.name"
            :value="item.code"/>
        </el-select>
        <span v-else>{{ countryName }}</span>
      </el-form-item>
      <el-form-item label="支付名称" prop="methodName">
        <el-input v-model="form.methodName" placeholder="支付方式名称长度 2-64"/>
      </el-form-item>
      <el-form-item label="支付编码" prop="methodCode" style="margin-bottom: 5px">
        <el-input v-model="form.methodCode" placeholder="6位支付方式编码" />
        <br><span style="color:#606266">编码规则：2位国家编码 + T + 3位数字</span>
      </el-form-item>
      <el-form-item label="支付图标" prop="iconUrl">
        <el-input v-model="form.iconUrl" placeholder="图标地址长度 2-120"/>
      </el-form-item>
      <el-form-item label="订单时效" prop="expMin">
        <el-input v-model.number="form.expMin" placeholder="过期时间 1~30 分钟">
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item label="支付范围" required style="margin-bottom: 10px">
        <el-checkbox v-model="form.paySwitch">进 单</el-checkbox>
        <el-checkbox v-model="form.drawSwitch">代 付</el-checkbox>
        <el-checkbox v-model="form.rechgSwitch">充 值</el-checkbox>
      </el-form-item>
      <el-form-item label="代收浮动" prop="floatInSwitch" style="margin-bottom: 10px">
        <el-radio v-model="form.floatInSwitch" label="false">关闭</el-radio>
        <el-radio v-model="form.floatInSwitch" label="true">开启</el-radio>
        <span style="color:#606266; float: right">控制卡商代收费率上下浮动</span>
      </el-form-item>
      <el-form-item label="浮动费率" prop="floatInRate">
        <el-input v-model="form.floatInRate" placeholder="0-30 最多1位小数(千分)">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="浮动时间" prop="floatInDate">
        <el-time-picker v-model="form.floatInDate" is-range value-format="HH:mm:ss" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%"/>
      </el-form-item>
      <el-form-item label="代付浮动" prop="floatOutSwitch" style="margin-bottom: 10px">
        <el-radio v-model="form.floatOutSwitch" label="false">关闭</el-radio>
        <el-radio v-model="form.floatOutSwitch" label="true">开启</el-radio> <span style="color:#606266; float: right">控制卡商代付费率上下浮动</span>
      </el-form-item>
      <el-form-item label="浮动费率" prop="floatOutRate">
        <el-input v-model="form.floatOutRate" placeholder="0-30 最多1位小数(千分)">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="浮动时间" prop="floatOutDate">
        <el-time-picker v-model="form.floatOutDate" is-range value-format="HH:mm:ss" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%"/>
      </el-form-item>
      <el-form-item label="排列序号" prop="sortNum">
        <el-input v-model.number="form.sortNum" placeholder="排列序号"/>
      </el-form-item>
      <el-form-item label="启用状态" prop="disabled" style="margin-bottom: 0px">
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
import { editPm, addPm } from '@/api/payment'
import countryOptions from '@/utils/country'
import { mathDiv } from '@/utils/math'
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
    pageNum: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      dialog: false, loading: false, countryName: '', countryOptions: countryOptions,
      form: {
        id: null,
        countryCode: null,
        methodCode: '',
        methodName: '',
        floatInSwitch: null,
        floatInRate: 0,
        floatInDate: ['00:00:00', '23:59:59'],
        floatInStart: '00:00:00',
        floatInEnd: '23:59:59',
        floatOutSwitch: null,
        floatOutRate: 0,
        floatOutDate: ['00:00:00', '23:59:59'],
        floatOutStart: '00:00:00',
        floatOutEnd: '23:59:59',
        paySwitch: true,
        drawSwitch: false,
        rechgSwitch: false,
        iconUrl: '',
        expMin: 3,
        sortNum: 1,
        disabled: null
      },
      rules: {
        countryCode: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ],
        methodCode: [
          { required: true, message: '请输入支付编码', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        methodName: [
          { required: true, message: '请输入支付名称', trigger: 'blur' },
          { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
        ],
        expMin: [
          { required: true, message: '请输入订单过期时间', trigger: 'blur' },
          { type: 'number', min: 1, max: 30, message: '过期时间 1~30 分钟', trigger: 'blur' }
        ],
        sortNum: [
          { required: true, message: '请输入序号', trigger: 'blur' }
        ],
        floatInSwitch: [
          { required: true, message: '请选择代收浮动费率', trigger: 'change' }
        ],
        floatOutSwitch: [
          { required: true, message: '请选择代付浮动费率', trigger: 'change' }
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
          if (this.form.floatInDate == null || this.form.floatInDate.length === 0) {
            this.form.floatInDate = ['00:00:00', '23:59:59']
          }
          this.form.floatInStart = this.form.floatInDate[0]
          this.form.floatInEnd = this.form.floatInDate[1]
          const param = Object.assign({}, this.form)
          param.floatInRate = mathDiv(this.form.floatInRate, 100)
          param.floatInDate = null
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
      addPm(param).then(res => {
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
      editPm(param).then(res => {
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
        methodCode: '',
        methodName: '',
        floatInSwitch: null,
        floatInRate: 0,
        floatInDate: ['00:00:00', '23:59:59'],
        floatInStart: '00:00:00',
        floatInEnd: '23:59:59',
        floatOutSwitch: null,
        floatOutRate: 0,
        floatOutDate: ['00:00:00', '23:59:59'],
        floatOutStart: '00:00:00',
        floatOutEnd: '23:59:59',
        paySwitch: true,
        drawSwitch: false,
        rechgSwitch: false,
        iconUrl: '',
        expMin: 3,
        sortNum: 1,
        disabled: null
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
  .mer-img-name{
    cursor:pointer;
    width: 120px;
    color: #999;
  }
  .mer-img{
    width: 120px;
  }
</style>
