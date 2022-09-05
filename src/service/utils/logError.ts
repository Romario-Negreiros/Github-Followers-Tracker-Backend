/* eslint-disable camelcase */
import { AxiosError } from '../types/Errors'

const logError = (err: AxiosError) => {
  if (err.response) {
    const { status, statusText } = err.response
    console.log(`Status: ${status}`)
    console.log(`Status text: ${statusText}`)
    const { data } = err.response
    if (data.message || data.documentation_url) {
      const { message, documentation_url } = err.response.data
      console.log('**** Github api error ****')
      console.log(`Message: ${message}`)
      console.log(`Documentation URL: ${documentation_url}`)
    } else {
      console.log(`Response's data: ${data}`)
      console.log(err.message)
    }
  } else {
    console.log('***** Unknown error ****')
    console.log(`Name: ${err.name}`)
    console.log(`Message: ${err.message}`)
    console.log(`Stack trace?: ${err.stack}`)
    console.log('\n\n\n**** Full Error Object ****')
    console.log(err)
  }
}

export default logError
