import { Dimensions } from 'react-native'

export const window = Dimensions.get('window')

export const console = {
  width:  window.width,
  height: 260,
}

export const z = {
  body:   0,
  header: 100,
}

export const smallDevice = window.height <= 640 || window.width <= 320

export function scaled(dim: number, scale: number = 0.75) {
  if (smallDevice) {
    return scale * dim
  } else {
    return dim
  }
}

export const padding = {
  inline: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 16,
  },

  xs: scaled(4),
  sm: scaled(12),
  md: scaled(16),
  lg: scaled(20),
  xl: scaled(32),
}

export const centerWidth = {
  full:   Math.min(540, window.width),
  padded: Math.min(540, window.width) - 2 * padding.lg,
}

export const radius = {
  s: 4,
  m: 8,
  l: 16,
}

export const overlay: any = {
  position: 'absolute',
  top:      0,
  bottom:   0,
  left:     0,
  right:    0,
}

export const center: any = {
  alignItems:     'center',
  justifyContent: 'center',
}

export const buttonHitSlop = {
  top:    12,
  left:   12,
  right:  12,
  bottom: 12,
}

export const icon = {
  xs:  {width: 12, height: 12},
  s:   {width: 16, height: 16},
  m:   {width: 20, height: 20},
  l:   {width: 24, height: 24},
  xl:  {width: 32, height: 32},
  xxl: {width: 40, height: 40},
}

export const avatar = {
  header:   {width: 40, height: 40},
  list:     {width: 40, height: 40},
  chat:     {width: 20, height: 20},
  chatTiny: {width: 12, height: 12},
}