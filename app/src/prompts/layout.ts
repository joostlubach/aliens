import { EdgeInsets } from 'react-native-safe-area-context'

import { fonts, layout } from '~/styling'

const columnCount = 4
const promptGap = layout.padding.md
export const focusedPromptSize = {
  width:  396,
  height: 420,
}

const unfocusedPromptWidth = (layout.window.width - 2 * promptGap + promptGap) / columnCount - promptGap
const unfocusedPromptScale = unfocusedPromptWidth / focusedPromptSize.width

export const unfocusedPromptSize = {
  width:  unfocusedPromptWidth,
  height: focusedPromptSize.height / focusedPromptSize.width * unfocusedPromptWidth,
}

export const focusedPromptLayout = {
  left:  (layout.window.width - focusedPromptSize.width) / 2,
  top:   (layout.window.height - focusedPromptSize.height) / 2,
  scale: 1,
}

export function unfocusedPromptLayout(index: number, safeArea: EdgeInsets) {
  const column = index % columnCount
  const row = Math.floor(index / columnCount)

  const captionSpace = fonts['title-sm'].size + layout.padding.inline.sm
  const width = unfocusedPromptWidth + promptGap
  const height = unfocusedPromptWidth / focusedPromptSize.width * focusedPromptSize.height + promptGap + captionSpace

  return {
    left:  promptGap + column * width,
    top:   promptGap + row * height + safeArea.top,
    scale: unfocusedPromptScale,
  }
}

