import { layout } from '~/styling'

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

export function unfocusedPromptLayout(index: number) {
  const column = index % columnCount
  const row = Math.floor(index / columnCount)

  return {
    left:  promptGap + column * (unfocusedPromptWidth + promptGap),
    top:   promptGap + row * (unfocusedPromptWidth / focusedPromptSize.width * focusedPromptSize.height + promptGap),
    scale: unfocusedPromptScale,
  }
}

