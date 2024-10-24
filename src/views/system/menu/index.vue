<template>
  <div class="app-container">
    <eHeader :menus="menus"/>
    <!--表格渲染-->
    <tree-table v-loading="loading" :data="data" :expand-all="true" :columns="columns" :tree-type="true" border size="small">
      <el-table-column prop="codeStr" label="编码" row-key="id">
        <template slot-scope="scope">
          <span>{{ scope.row.codeStr }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100px">
        <template v-if="!isEmpty(scope.row.icon)" slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="ordinal" align="center" width="100px" label="排序">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.ordinal }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="path" label="请求地址"/>
      <el-table-column :show-overflow-tooltip="true" prop="component" label="组件路径"/>
      <el-table-column prop="resType" width="100px" label="类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.resType === 0">菜单</span>
          <span v-else>按钮</span>
        </template>
      </el-table-column>
      <el-table-column prop="method" width="100px" label="请求方式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center" fixed="right">
        <template slot-scope="scope">
          <edit v-if="isAuth('res:update')" :menus="menus" :data="scope.row" :sup_this="sup_this"/>
          <el-popover
            v-if="isAuth('res:delete')"
            v-model="scope.row.delPopover"
            placement="top"
            width="200">
            <p>确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.delPopover = false">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" @click="scope.row.delPopover = true">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import treeTable from '@/components/TreeTable'
import { removeRes, getResPage, getResOptions } from '@/api/sys-menu'
import eHeader from './module/header'
import edit from './module/edit'
import { isEmpty } from '@/utils/index'
export default {
  components: { eHeader, edit, treeTable },
  data() {
    return {
      columns: [
        {
          text: '名称',
          value: 'name'
        }
      ],
      loading: false, delLoading: false, sup_this: this, menus: [], data: []
    }
  },
  created() {
    this.loadResOptions()
    this.$nextTick(() => {
      this.loadResTable()
    })
  },
  methods: {
    isEmpty,
    isAuth,
    subDelete(index, row) {
      this.delLoading = true
      removeRes(row.id).then(res => {
        this.delLoading = false
        row.delPopover = false
        this.loadResTable()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        row.delPopover = false
        console.log(err.response.data.message)
      })
    },
    loadResOptions() {
      getResOptions(0).then(res => {
        this.menus = []
        const menu = { id: 0, label: '顶级类目', children: res }
        this.menus.push(menu)
      })
    },
    loadResTable() {
      this.loading = true
      getResPage().then(res => {
        this.data = res
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    }
  }
}
</script>
