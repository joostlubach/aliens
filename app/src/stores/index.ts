// @index: export * from ${relpath}
export * from './AppStore'
export * from './NfcStore'
// /index

const stores = [
  // @index: require(${relpath}).${variable},
  require('./AppStore').AppStore,
  require('./NfcStore').NfcStore,
  // /index
]
export default stores