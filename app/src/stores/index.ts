// @index: export * from ${relpath}
export * from './AppStore'
export * from './AudioStore'
export * from './NFCStore'
// /index

const stores = [
  // @index: require(${relpath}).${variable},
  require('./AppStore').AppStore,
  require('./AudioStore').AudioStore,
  require('./NFCStore').NFCStore,
  // /index
]
export default stores