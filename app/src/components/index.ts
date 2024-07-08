// @index(d:!): export { default as ${variable} } from ${relpath}
export { default as AlienLabel } from './AlienLabel'
export { default as Label } from './Label'
// /index

// @index(d:!,!withKeyboard): export type { Props as ${variable}Props } from ${relpath}
export type { Props as AlienLabelProps } from './AlienLabel'
export type { Props as LabelProps } from './Label'
// /index

// @index(f:!): export * from ${relpath}
export * from './layout'
// /index