import React from 'react'
import Animated, { ZoomIn } from 'react-native-reanimated'
import { memo } from 'react-util'

import { Center, HBox, Label } from '~/components'
import { colors, createUseStyles, layout } from '~/styling'

export interface UnlockedLetterNoticeProps {
  letter: string 
}

export const UnlockedLetterNotice = memo('UnlockedLetterNotice', (props: UnlockedLetterNoticeProps) => {

  const {letter} = props

  // #region Rendering

  const $ = useStyles()

  function render() {
    return (
      <Center style={layout.overlay} pointerEvents='none'>
        <Animated.View entering={ZoomIn} style={$.notice}>
          <HBox gap={layout.padding.inline.md}>
            <Label font='alien-lg'>
              {letter}
            </Label>
            <Label font='title-lg'>
              = {letter}
            </Label>
          </HBox>
        </Animated.View>
      </Center>
    )
  }

  // #endregion

  return render()

})

const useStyles = createUseStyles({
  notice: {
    borderRadius:    layout.radius.l,
    backgroundColor: colors.black.alpha(0.6),
    padding:         layout.padding.xl,
    minWidth:        80,
    minHeight:       80,
  },
})