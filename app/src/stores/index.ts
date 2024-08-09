// @index: export * from ${relpath}
export * from './AppStore'
export * from './AudioStore'
export * from './NfcStore'
// /index

const stores = [
  // @index: require(${relpath}).${variable},
  require('./AppStore').AppStore,
  require('./AudioStore').AudioStore,
  require('./NfcStore').NfcStore,
  // /index
]
export default stores