const axios = require('axios')

export const request = ({ url, data = {}, method = 'GET', headers = {} }) => {
  let options = {}
  let params =
    Object.keys(data).length > 0
      ? Object.keys(data)
          .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
          .join('&')
      : ''
  if (method == 'GET' && params) {
    url += `?${params}`
  } else {
    options.data = data
  }
  options.headers = {
    ...headers
  }
  return axios(url, options)
    .then(response => response.json())
    .catch(err => {
      console.log('fetch failed', err)
      return { success: false, msg: 'failed' }
    })
}
