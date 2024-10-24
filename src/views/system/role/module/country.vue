<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" title="编辑角色国家权限" width="500px">
    <el-form ref="form" :model="form" size="small" label-width="66px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item size="mini" label="国家">
        <el-select v-model="form.list" filterable multiple placeholder="请选择国家" style="width: 370px;">
          <el-option
            v-for="item in countryOptions"
            :key="item.code"
            :label="item.code +'-'+ item.name"
            :value="item.code"/>
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
import countryOptions from '@/utils/country'
import { syncRoleCountry, getRoleCountryList } from '@/api/sys-role'
export default {
  props: {
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false, dialog: false, countryOptions: countryOptions,
      form: { id: null, name: null, list: [] }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      syncRoleCountry({ roleId: this.form.id, list: this.form.list }).then(res => {
        this.resetForm()
        this.$notify({
          title: '国家权限已同步',
          type: 'success',
          duration: 2500
        })
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    setChecked(id, name) {
      getRoleCountryList(id).then(res => {
        if (res.success) {
          this.form = {
            id: id,
            name: name,
            list: res.data
          }
        }
      })
      this.dialog = true
    },
    resetForm() {
      this.dialog = false
      this.form = { id: null, name: null, list: [] }
    }
  }
}
</script>

<style scoped>

</style>
