import chroma, { Color } from 'chroma-js'

export const transparent = chroma(0, 0, 0, 0)
export const white = chroma('white')
export const black = chroma('black')

export const dimple = {
  dark:  chroma('black').alpha(0.05),
  light: chroma('white').alpha(0.4),
}

export const shim = {
  light: chroma('black').alpha(0.3),
  dark:  chroma('black').alpha(0.6),
  white: chroma('white').alpha(0.6),
}

export const bg = {
  dark:  chroma('#212121'),
  light: chroma('white'),
}

export const button = {
  bg: chroma('#8E8E8E'),
  fg: chroma('#434343'),
}

export const fg = {
  dark: {
    normal:    chroma('black'),
    link:      chroma('blue'),
    highlight: chroma('yellow'),
  },
  light: {
    normal:    chroma('white'),
    link:      chroma('blue'),
    highlight: chroma('yellow'),
  },
}

export const semantic = {
  dark: {
    primary: chroma('#663C7E'),
  },
  light: {
    primary: chroma('#663C7E'),  
  },
} as const

export function isDark(color: Color) {
  return color.luminance() < 0.5
}