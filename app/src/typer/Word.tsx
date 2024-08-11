import React from 'react'
import { memo } from 'react-util'

import { Center, Label } from '~/components'
import { colors, createUseStyles, layout } from '~/styling'

export interface WordProps {
  text: string
  
}

export const Word = memo('Word', (props: WordProps) => {

  const {text} = props

  // #region Rendering

  const $ = useStyles()

  function render() {
    return (
      <Center style={$.Word}>
        <Label font='alien-sm' shadow={false} color={colors.black}>
          {text}
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
    paddingVertical:   layout.padding.inline.sm,
    paddingHorizontal: layout.padding.inline.md,

    backgroundColor: colors.white,

    borderWidth:       2,
    borderTopColor:    colors.white,
    borderLeftColor:   colors.white,
    borderRightColor:  colors.black.alpha(0.3),
    borderBottomColor: colors.black.alpha(0.3),
  },
})