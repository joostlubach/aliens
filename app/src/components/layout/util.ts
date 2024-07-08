import { DimensionValue } from 'react-native'

export type FlexProp = number | boolean | 'grow' | 'shrink' | 'both'

export function flexStyle(flex: FlexProp) {
  if (!flex) { return null }
  if (flex === true) { return {flex: 1, flexBasis: 0} }

  if (flex === 'grow') {
    return {flexGrow: 1, flexShrink: 0, flexBasis: 'auto' as DimensionValue}
  } else if (flex === 'shrink') {
    return {flexGrow: 0, flexShrink: 1, flexBasis: 'auto' as DimensionValue}
  } else if (flex === 'both') {
    return {flexGrow: 1, flexShrink: 1, flexBasis: 'auto' as DimensionValue}
  } else {
    return {flex}
  }
}
