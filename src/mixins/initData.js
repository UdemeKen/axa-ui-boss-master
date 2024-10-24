import { initData } from '@/api/data'

export default {
  data() {
    return {
      loading: true, data: [], page: 1, size: 15, total: 0, url: '', params: {}, query: {}, pageSizes: [15, 30, 50, 100]
    }
  },
  methods: {
    init: async function() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        initData(this.url, this.params).then(res => {
          this.total = res.totalCount
          this.data = res.data
          setTimeout(() => {
            this.loading = false
          }, 230)
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.page = e
      this.init()
    },
    sizeChange(e) {
      this.page = 1
      this.size = e
      this.init()
    }
  }
}
