import { isArray, isFunction, isPlainObject, mapValues } from 'lodash'
import { RegisteredStyle, StyleSheet } from 'react-native'

import { useTheme } from '~/hooks'
import { Theme } from '../Theme'

export function createUseStyles<T extends Styles>(styles: StylesConfig<T>): UseStylesFunction<T> {
  let cacheForStyles: StyleSheetCache = cache.get(styles) ?? new Map()
  cache.set(styles, cacheForStyles = new Map())

  if (isFunction(styles)) {
    return () => {
      const theme = useTheme()
      const styleSheet = cacheForStyles.get(theme) ?? createStyleSheet(styles(theme))
      cacheForStyles.set(theme, styleSheet)
      return styleSheet
    }
  } else {
    const styleSheet = cacheForStyles.get(NoTheme) ?? createStyleSheet(styles)
    cacheForStyles.set(NoTheme, styleSheet)
    return () => styleSheet
  }
}

function createStyleSheet<T extends Styles>(styles: T): DynamicStyleSheet<T> {
  const processed = preProcessStyles(styles)
  const styleSheet = StyleSheet.create(processed)

  return createDynamicStyleFunction(styleSheet) as DynamicStyleSheet<T>
}

function createDynamicStyleFunction<T extends Styles>(styleSheet: StyleSheet<T>): DynamicStyleSheet<T> {
  const keys = Object.keys(styleSheet)
  const values = Object.values(styleSheet)
  const dummy = () => {}

  return new Proxy(dummy, {
    ownKeys:                  () => [...keys, ...Reflect.ownKeys(dummy)],
    getOwnPropertyDescriptor: (_, prop) => {
      if (typeof prop === 'string' && keys.includes(prop)) {
        return Object.getOwnPropertyDescriptor(styleSheet, prop)
      } else {
        return Object.getOwnPropertyDescriptor(dummy, prop)
      }
    },

    get:   (_, prop) => styleSheet[prop as keyof T],
    apply: (_, thisArg, args) => {
      const styles: Array<RegisteredStyle<any> | null> = []

      let mostRecentStyleKey: keyof T | null = null
      const addStylesForArg = (arg: any) => {
        if (typeof arg === 'string') {
          const style = styleSheet[arg as keyof T] ?? null
          if (style != null) {
            mostRecentStyleKey = arg as keyof T
          }
          styles.push(style)
        } else if (isArray(arg)) {
          arg.forEach(addStylesForArg)
        } else if (values.includes(arg)) {
          mostRecentStyleKey = Object.entries(styleSheet).find(it => it[1] === arg)?.[0] ?? null
          styles.push(arg)
        } else if (isPlainObject(arg)) {
          for (const [name, value] of Object.entries(arg)) {
            if (!value) { continue }

            const styleKey = mostRecentStyleKey == null ? name : `${String(mostRecentStyleKey)}$${name}`
            styles.push(styleSheet[styleKey as keyof T] ?? null)
          }
        }
      }

      for (const arg of args) {
        addStylesForArg(arg)
      }

      return styles
    },
  }) as DynamicStyleSheet<T>
}

const SWITCH_REGEXP = /^&\.(.*)$/

function preProcessStyles<T extends Styles>(styles: T): {[key in keyof T]: any} {
  const processed: Record<string, any> = {}

  for (const [name, declarations] of Object.entries(styles)) {
    const rest: any = {}
    for (const [key, value] of Object.entries(declarations)) {
      const match = key.match(SWITCH_REGEXP)
      if (match != null) {
        processed[`${name}$${match[1]}`] = mapValues(value, preProcessStyle)
      } else {
        rest[key] = value
      }
    }

    processed[name] = mapValues(rest, preProcessStyle)
  }

  return processed as {[key in keyof T]: any}
}

function preProcessStyle(value: any) {
  if (value?.constructor.name === 'Color') {
    return value.css()
  } else {
    return value
  }
}

const cache = new Map<object, StyleSheetCache>()
const NoTheme = {}

export type Styles = Record<string, Record<string, any>>
export type StyleSheet<T> = Record<keyof T, RegisteredStyle<any>>
export type DynamicStyleSheet<T> = StyleSheet<T> & DynamicStyleFunction<T>
export type StyleSheetCache = WeakMap<Theme | typeof NoTheme, DynamicStyleSheet<any>>

export type StylesConfig<T> =
  | T
  | ((theme: Theme) => T)

export type UseStylesFunction<T> = () => DynamicStyleSheet<T>
export type DynamicStyleFunction<T> = (...args: DynamicStyleArg<T>[]) => RegisteredStyle<any> | null
export type DynamicStyleArg<T> = RegisteredStyle<keyof T> | Record<string, any> | null | false | undefined