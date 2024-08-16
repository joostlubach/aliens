import Axios from 'axios'

export const axios = Axios.create({
  // Never throw errors.
  validateStatus: null,
})