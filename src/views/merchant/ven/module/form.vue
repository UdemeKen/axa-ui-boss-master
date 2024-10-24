<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :title="isAdd ? '指定卡商' : '指定卡商'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
      <el-form-item label="选择商户" prop="mchId">
        <el-select v-if="isEmpty(form.id)" v-model="form.mchId" clearable filterable placeholder="请选择商户" class="filter-item" style="width: 365px">
          <el-option v-for="item in mchOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id" @click.native="changeMerchant(item.id, item.code)"/>
        </el-select>
        <span v-else>{{ form.mchName }}</span>
      </el-form-item>
      <el-form-item label="支付方式" prop="methodCode">
        <el-select v-model="form.methodCode" clearable filterable placeholder="请选择支付方式" class="filter-item" style="width: 365px">
          <el-option v-for="item in pmOptions" :key="item.methodCode" :label="item.methodName +' - '+ item.methodCode" :value="item.methodCode"/>
        </el-select>
      </el-form-item>
      <el-form-item label="多选卡商" prop="venIdList">
        <el-select v-model="form.venIdList" clearable filterable multiple placeholder="请选择卡商" class="filter-item" style="width: 365px">
          <el-option v-for="item in venOptions" :key="item.id" :label="item.name +' - '+ item.code" :value="item.id"/>
        </el-select>
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
import { addMv, getMpmList } from '@/api/mch-pm'
import { getVenOptions } from '@/api/ven'
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
    return {
      dialog: false, loading: false, pmOptions: [], venOptions: [],
      form: {
        id: null,
        mchId: null,
        methodCode: '',
        venIdList: []
      },
      rules: {
        mchId: [
          { required: true, message: '请选择商户', trigger: 'change' }
        ],
        venIdList: [
          { required: true, message: '请选择卡商', trigger: 'change' }
        ],
        methodCode: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
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
          this.loading = true
          this.doAdd(param)
        } else {
          return false
        }
      })
    },
    doAdd(param) {
      addMv(param).then(res => {
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
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: null,
        mchId: null,
        methodCode: '',
        venIdList: []
      }
    },
    changeMerchant(mchId, countryCode) {
      this.pmOptions = []
      this.venOptions = []
      this.form.methodCode = null
      this.form.venIdList = []
      getMpmList({ id: mchId }).then(res => {
        this.pmOptions = res.data
      })
      getVenOptions(null, null, countryCode).then(res => {
        this.venOptions = res.data
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
</style>
