<template>
  <div class="app-container">
    <panel-group/>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
