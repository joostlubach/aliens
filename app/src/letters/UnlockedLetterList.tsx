import { useStore } from 'mobx-store'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button, HBox, Label, VBox } from '~/components'
import { GameStore } from '~/stores'
import { colors, createUseStyles, layout } from '~/styling'
import { observer } from '~/util'

export interface UnlockedLetterListProps {
  requestHide: () => any
}

export const UnlockedLetterList = observer('UnlockedLetterList', (props: UnlockedLetterListProps) => {

  const {requestHide} = props
  const {unlockedLetters} = useStore(GameStore)

  const [t] = useTranslation()
  const safeArea = useSafeAreaInsets()

  // #region Rendering

  const $ = useStyles()

  function render() {
    return (
      <View style={[$.UnlockedLetterList, {
        paddingTop:    layout.padding.md + safeArea.top,
        paddingBottom: layout.padding.md + safeArea.bottom,
      }]}>
        <VBox flex style={$.panel}>
          <HBox style={$.header}>
            <Label flex align='center'>
              {t('letters:header')}
            </Label>
            <Button icon onPress={requestHide}>
              <Label>⨉</Label>
            </Button>
          </HBox>
          <View style={$.divider}/>
          <ScrollView contentContainerStyle={$.container}>
            <VBox>
              {Array.from(unlockedLetters).sort().map(renderLetter)}
            </VBox>
          </ScrollView>
        </VBox>
      </View>
    )
  }

  function renderLetter(letter: string) {
    return (
      <HBox key={letter} gap={layout.padding.md} justify='center'>
        <Label font='alien-lg'>
          {letter}
        </Label>
        <Label font='title-lg'>
          = {letter}
        </Label>
      </HBox>
    )
  }

  // #endregion

  return render()

})

const useStyles = createUseStyles({
  UnlockedLetterList: {
    ...layout.overlay,
    padding: layout.padding.md,
  },

  container: {
    flexGrow: 1,
    padding:  0,
  },

  panel: {
    borderRadius:    layout.radius.l,
    backgroundColor: colors.black.alpha(0.6),

    paddingHorizontal: layout.padding.md,
  },

  header: {
    paddingVertical: layout.padding.md,
  },

  divider: {
    height:          1,
    backgroundColor: 'white',
  },
})