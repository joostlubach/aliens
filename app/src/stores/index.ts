// @index: export * from ${relpath}
export * from './AppStore'
export * from './AudioStore'
export * from './GameStore'
export * from './NFCStore'
// /index

const stores = [
  // @index: require(${relpath}).${variable},
  require('./AppStore').AppStore,
  require('./AudioStore').AudioStore,
  require('./GameStore').GameStore,
  require('./NFCStore').NFCStore,
  // /index
]
export default stores