import { Platform, TextStyle } from 'react-native'

export const fontFaces = {
  sans: Platform.select<string | FontFace>({
    android: 'futura',
    default: fontFace('Futura', require('%fonts/futura.otf')),
  }),
  alien: Platform.select<string | FontFace>({
    android: 'spacedude',
    default: fontFace('spacedude', require('%fonts/spacedude.otf')),
  }),
}

export const fonts = {
  'title-lg': font(fontFaces.sans, 700, 20),
  'title-md': font(fontFaces.sans, 700, 16),
  'title-sm': font(fontFaces.sans, 700, 14),

  'body-lg': font(fontFaces.sans, 400, 24),
  'body-md': font(fontFaces.sans, 400, 20),
  'body-sm': font(fontFaces.sans, 400, 16, 1.5),

  'alien-lg': font(fontFaces.alien, 700, 41),
  'alien-md': font(fontFaces.alien, 700, 26),
  'alien-sm': font(fontFaces.alien, 700, 22, 1.2),
}

interface FontFace {
  family: string
  source: any
}

function fontFace(family: string, source: any): FontFace {
  return {family, source}
}

function font(face: string | FontFace, weight: number, size: number, lineHeight: number = 1.2) {
  return {family: typeof face === 'string' ? face : face.family, weight, size, lineHeight}
}

export function getTextStyle(spec: FontSpec): TextStyle {
  const offset = textOffset(spec)
  return {
    fontFamily: spec.family,
    fontWeight: spec.weight.toString() as TextStyle['fontWeight'],
    fontSize:   spec.size,
    lineHeight: spec.size * spec.lineHeight,
    top:        offset.y,
    left:       offset.x,
  }
}

export function textOffset(font: FontSpec) {
  if (font.family === 'Futura') {
    return {x: 0, y: 0}
  } else {
    return {x: 0, y: 0}
  }
}

export interface FontSpec {
  family:     string
  weight:     number
  size:       number
  lineHeight: number
}