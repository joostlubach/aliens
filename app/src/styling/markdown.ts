import { Theme } from './Theme'
import * as layout from './layout'
import * as text from './text'

const base = (theme: Theme) => ({
  plainText: {
    ...text.getTextStyle(text.fonts['body-md']),
    color:      theme.fg.normal.css(),
    fontStyle:  'normal',
    fontWeight: '400',
  },

  em: {
    fontStyle: 'italic',
  },

  strong: {
    fontWeight: '800',
  },

  u: {
    textDecorationLine: 'underline',
  },

  link: {
    fontWeight: '700',
    color:      theme.fg.link.css(),
  },

  url: {
    fontWeight: '700',
    color:      theme.fg.link.css(),
  },

  mailTo: {
    fontWeight: '700',
    color:      theme.fg.link.css(),
  },

  paragraph: {
    paddingBottom: layout.padding.s,
  },

  list: {
    padding:       0,
    paddingBottom: layout.padding.s,
  },

  nestedList: {
    marginBottom: 0,
  },

  listItem: {
    flexDirection: 'row',
    marginBottom:  4,
  },

  listItemBullet: {
    color: theme.semantic.primary.css(),
  },

  listItemContent: {
    flexGrow:   1,
    flexShrink: 1,
    flexBasis: 'auto',
  },

  heading1: {
    ...text.getTextStyle(text.fonts['title-lg']),
    marginBottom:  layout.padding.s,
    color:         theme.fg.highlight.css(),
  },

  heading2: {
    ...text.getTextStyle(text.fonts['title-md']),
    marginBottom: layout.padding.s,
  },

  heading3: {
    ...text.getTextStyle(text.fonts['title-sm']),
    marginBottom: layout.padding.s,
  },

  image: {
    marginBottom: layout.padding.s,
  },

  imageFullWidth: {
    marginBottom:     layout.padding.m,
    marginHorizontal: -layout.padding.m,
    width:            layout.window.width,
  },

  video: {
    marginBottom:     layout.padding.m,
    marginHorizontal: -layout.padding.m,

    width:            layout.window.width,
    height:           layout.window.width / 16 * 9,
  },

  widget: {
    marginBottom: layout.padding.m,
  },

  fullWidthMediaCaption: {
    paddingHorizontal: layout.padding.m,
  },

  hr: {
    height: layout.padding.l,
  },
})

export default base