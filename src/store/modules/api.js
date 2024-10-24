const baseUrl = process.env.VUE_APP_BASE_API
const api = {
  state: {
    domainUrl: baseUrl,
    imagesUpload: baseUrl + '/file/upload'
  }
}

export default api
