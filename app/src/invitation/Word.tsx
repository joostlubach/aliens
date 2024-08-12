import React from 'react'
import { memo } from 'react-util'

import { Center, Label } from '~/components'
import { colors, createUseStyles, layout } from '~/styling'
import { wordHeight } from './layout'

export interface WordProps {
  word: string
}

export const Word = memo('Word', (props: WordProps) => {

  const {word} = props

  // #region Rendering

  const $ = useStyles()

  function render() {
    return (
      <Center style={$.Word}>
        <Label font='alien-sm' shadow={false} color={colors.black}>
          {word}
        </Label>
      </Center>
    )
  }

  // #endregion

  return render()

})

export default Word

const useStyles = createUseStyles({
  Word: {
    height: wordHeight,

    paddingVertical:   layout.padding.inline.xs,
    paddingHorizontal: layout.padding.inline.md,

    backgroundColor: colors.white,

    borderWidth:       2,
    borderTopColor:    colors.white,
    borderLeftColor:   colors.white,
    borderRightColor:  colors.black.alpha(0.3),
    borderBottomColor: colors.black.alpha(0.3),
  },
})