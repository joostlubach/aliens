import { TextStyle } from 'react-native'

export const fontFaces = {
  sans: fontFace('Futura', require('%fonts/futur.ttf')),
  alien: fontFace('SpaceDude', require('%fonts/spacedude.ttf'))
}

export const fonts = {
  'title-lg': font(fontFaces.sans, 700, 36),
  'title-md': font(fontFaces.sans, 700, 24),
  'title-sm': font(fontFaces.sans, 700, 18),

  'body-lg': font(fontFaces.sans, 400, 32),
  'body-md': font(fontFaces.sans, 400, 28),
  'body-sm': font(fontFaces.sans, 400, 24),

  'alien-lg': font(fontFaces.alien, 700, 46),
  'alien-md': font(fontFaces.alien, 700, 40),
  'alien-sm': font(fontFaces.alien, 700, 32),
}

function fontFace(family: string, source: any) {
  return {family, source}
}

function font(face: {family: string}, weight: number, size: number, lineHeight: number = 1.2) {
  return {family: face.family, weight, size, lineHeight}
}

export function getTextStyle(spec: FontSpec): TextStyle {
  return {
    fontFamily: spec.family,
    fontWeight: spec.weight.toString() as TextStyle['fontWeight'],
    fontSize:   spec.size,
    lineHeight: spec.size * spec.lineHeight,
    paddingTop: textOffset() * spec.size,
  }
}

export function textOffset() {
  return 0.125
}

export interface FontSpec {
  family:    string
  weight:    number
  size:      number
  lineHeight: number
}