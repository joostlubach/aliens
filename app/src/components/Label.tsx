import { Color } from 'chroma-js'
import React from 'react'
import {
  Linking,
  RegisteredStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from 'react-native'
import { memo } from 'react-util'
import { flatMap } from 'ytil'
import { createUseStyles, DynamicStyleSheet, fonts, text, useTheme } from '~/styling'
import { applyLinks, LinkRange } from '~/util/autolink'
import { flexStyle, VBoxProps } from './layout'

export interface Props extends TextProps {
  children?: React.ReactNode

  href?:     string
  links?:    LinkRange[]

  markup?:   boolean
  align?:    'left' | 'center' | 'right'

  font?: keyof typeof fonts

  color?:     Color
  dim?:       boolean
  dimmer?:    boolean
  highlight?: boolean

  truncate?: boolean | 'middle' | 'head' | 'tail' | 'clip'
  allowFontScaling?: boolean

  flex?: VBoxProps['flex']

  style?:      StyleProp<TextStyle>
  linkStyle?:  StyleProp<TextStyle>
}

interface MarkupPart {
  style: StyleProp<TextStyle>
  text:  string
}

const Label = memo('Label', (props: Props) => {

  const {
    linkStyle = null,
    links,
    allowFontScaling = false,
    adjustsFontSizeToFit = false,
    numberOfLines = props.adjustsFontSizeToFit ? 1 : undefined,
    markup = false,

    align = 'left',
    font = 'body-md',

    color,
    dim = false,
    dimmer = false,
    highlight = false,

    truncate = true,

    flex,
    children,

    href,

    ...rest
  } = props

  const theme  = useTheme()

  const textColor = React.useMemo((): Color => {
    if (color != null) {
      return color
    }

    if (highlight) {
      return theme.fg.highlight
    } else if (href != null) {
      return theme.fg.link
    } else {
      return theme.fg.normal
    }
  }, [color, highlight, href, theme.fg.highlight, theme.fg.link, theme.fg.normal])

  const fontStyle = React.useMemo(
    () => text.getTextStyle(fonts[font]),
    []
  )

  //-------
  // Rendering

  const $ = useStyles()

  const textContent = React.Children.toArray(children).join(' ')
  const nodes = React.useMemo((): React.ReactNode[] => {
    if (links != null && links.length > 0) {
      return applyLinks(textContent, links, $.link)
    } else {
      return [textContent]
    }
  }, [links, textContent, $])

  function render() {
    const styles: StyleProp<TextStyle> = [
      $.Label,

      fontStyle,
      {color: textColor.css()},

      dim && $[`dim-${theme.isDark ? 'dark' : 'light'}`],
      dimmer && $[`dimmer-${theme.isDark ? 'dark' : 'light'}`],

      href != null && [$.link, {textDecorationColor: theme.fg.link.css()}],
      {textAlign: align},

      flex != null && flexStyle(flex),
      props.style,
      href != null && linkStyle,
    ]

    const textProps: TextProps = {
      ellipsizeMode:    truncate === true ? 'middle' : truncate === false ? undefined : truncate,
      allowFontScaling: allowFontScaling,
    }

    return (
      <Text
        {...rest}
        {...textProps}
        style={styles}
        allowFontScaling={allowFontScaling}
        adjustsFontSizeToFit={adjustsFontSizeToFit}
        numberOfLines={numberOfLines}
        onPress={href == null ? undefined : handlePress}
        children={markup ? renderWithMarkup() : textContent}
      />
    )
  }

  function renderWithMarkup() {
    return flatMap(nodes, (node, nodeIndex): React.ReactNode[] => {
      if (typeof node === 'string') {
        const parts = parseMarkup(node, $)
        return parts.map(({style, text}, index) => (
          <Text
            key={`${nodeIndex}-${index}`}
            style={style}
            children={text}
          />
        ))
      } else {
        return [node]
      }
    })
  }

  const handlePress = React.useCallback(() => {
    if (href == null) { return }
    Linking.openURL(href)
  }, [href])

  return render()

})

export default Label

//------
// Markup

type MarkupStyle = RegisteredStyle<TextStyle>

interface ParserState {
  pos:    number
  styles: Set<MarkupStyle>
}

interface Boundary {
  index: number
  start: number
  end:   number
  style: MarkupStyle
}

const matchers: Array<[string, ($: DynamicStyleSheet<any>) => MarkupStyle]> = [
  ['**', $ => $.bold],
  ['*',  $ => $.italic],
  ['_',  $ => $.italic],
]

function parseMarkup(text: string, $: DynamicStyleSheet<any>): MarkupPart[] {
  const state: ParserState  = {pos: 0, styles: new Set()}
  const parts: MarkupPart[] = []

  const findNextBoundary = () => {
    const remaining = text.slice(state.pos)

    const occurrences = matchers
      .map(([boundary, style], index): Boundary | null => {
        const start = remaining.indexOf(boundary)
        if (start === -1) { return null }

        return {
          index,
          start: state.pos + start,
          end:   state.pos + start + boundary.length,
          style: style($),
        }
      }).filter(Boolean) as Boundary[]
    if (occurrences.length === 0) { return null }

    occurrences.sort((a, b) => a.start === b.start ? a.index - b.index : a.start - b.start)
    return occurrences[0]
  }
  const toggleStyle = (style: MarkupStyle) => {
    if (state.styles.has(style)) {
      state.styles.delete(style)
    } else {
      state.styles.add(style)
    }
  }

  while (state.pos < text.length) {
    const nextBoundary = findNextBoundary()
    if (nextBoundary == null) {
      parts.push({style: [...state.styles], text: text.slice(state.pos)})
      state.pos = text.length
    } else {
      if (nextBoundary.start > state.pos) {
        parts.push({style: [...state.styles], text: text.slice(state.pos, nextBoundary.start)})
      }

      toggleStyle(nextBoundary.style)
      state.pos = nextBoundary.end
    }
  }

  return parts
}

const useStyles = createUseStyles(theme => ({
  Label: {
    backgroundColor: 'transparent',
  },

  'dim-light': {
    opacity: 0.6,
  },
  'dim-dark': {
    opacity: 0.5,
  },

  'dimmer-light': {
    opacity: 0.3,
  },
  'dimmer-dark': {
    opacity: 0.2,
  },

  link: {
    fontWeight: '700',
    color:      theme.fg.link,
  },
}))