// @index: export * from ${relpath}
export * from './AppStore'
// /index

const stores = [
  // @index: require(${relpath}).${variable}
  require('./AppStore').AppStore
  // /index
]
export default stores