import { useStore } from 'mobx-store'
import * as React from 'react'
import { Image, ImageProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Center, HBox } from '~/components'
import { GameStatus, GameStore } from '~/stores'
import { createUseStyles, layout } from '~/styling'
import { observer } from '~/util'
import Pop from '../components/Pop'

export const GameStatusBar = observer('GameStatusBar', () => {

  const gameStore = useStore(GameStore)
  const safeArea = useSafeAreaInsets()
  const paddingBottom = Math.max(safeArea.bottom, layout.padding.sm)

  const $ = useStyles()

  function render() {
    return (
      <HBox style={[$.GameStatusBar, {paddingBottom}]} justify='space-between'>
        <GameStatusIndicator
          icon={require('%images/cocktail.png')}
          status={gameStore.statuses.cocktail}
        />
        <GameStatusIndicator
          icon={require('%images/colander.png')}
          status={gameStore.statuses.colander}
        />
        <GameStatusIndicator
          icon={require('%images/crop.png')}
          status={gameStore.statuses.crop}
        />
        <GameStatusIndicator
          icon={require('%images/invitation.png')}
          status={gameStore.statuses.invitation}
        />
      </HBox>
    )
  }


  return render()

})

interface GameStatusIndicatorProps {
  icon:   ImageProps['source']
  status: GameStatus | undefined
}

const GameStatusIndicator = observer('GameStatusIndicator', (props: GameStatusIndicatorProps) => {

  const {icon, status} = props

  const $ = useStyles()

  function render() {
    return (
      <Pop in={status != null}>
        <Center style={$.GameStatusIndicator}>
          <Image source={icon}/>
        </Center>
      </Pop>
    )
  }

  return render()

})

const useStyles = createUseStyles(theme => ({
  GameStatusBar: {
    padding: layout.padding.sm,
  },

  GameStatusIndicator: {
    width:  76,
    height: 76,

    opacity: 0.6,
    
    backgroundColor: theme.semantic.primary.alpha(0.6),
    borderRadius:    layout.radius.m,
  },
} as const))