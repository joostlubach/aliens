// @index: export * from ${relpath}
export * from './AppStore'
export * from './AudioStore'
export * from './GameStore'
export * from './LetterStore'
export * from './QRStore'
export * from './game'
// /index

const stores = [
  // @index(Store.ts$): require(${relpath}).${variable},
  require('./AppStore').AppStore,
  require('./AudioStore').AudioStore,
  require('./GameStore').GameStore,
  require('./LetterStore').LetterStore,
  require('./QRStore').QRStore,
  // /index
]
export default stores