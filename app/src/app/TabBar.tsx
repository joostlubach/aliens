import { useRouter } from 'expo-router'
import { useStore } from 'mobx-store'
import * as React from 'react'
import { Image, ImageProps, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Center, HBox } from '~/components'
import { GameStatus, GameStore } from '~/stores'
import { createUseStyles, layout } from '~/styling'
import { observer } from '~/util'
import Pop from '../components/Pop'

import 'react-native-reanimated'

export const TabBar = observer('TabBar', () => {

  const gameStore = useStore(GameStore)
  const safeArea = useSafeAreaInsets()
  const paddingBottom = Math.max(safeArea.bottom, layout.padding.sm)

  const $ = useStyles()

  function render() {
    return (
      <HBox style={[$.TabBar, {paddingBottom}]} justify='space-between'>
        <TabBarButton
          icon={require('%images/cocktail.png')}
          href='/cocktail'
          status={gameStore.statuses.cocktail}
        />
        <TabBarButton
          icon={require('%images/colander.png')}
          href='/colander'
          status={gameStore.statuses.colander}
        />
        <TabBarButton
          icon={require('%images/crop.png')}
          href='/crop'
          status={gameStore.statuses.crop}
        />
        <TabBarButton
          icon={require('%images/invitation.png')}
          href='/invitation'
          status={gameStore.statuses.invitation}
        />
      </HBox>
    )
  }


  return render()

})

interface TabBarButtonProps {
  icon:    ImageProps['source']
  href:    string
  status?: GameStatus
}

const TabBarButton = observer('TabBarButton', (props: TabBarButtonProps) => {

  const {icon, href, status} = props

  const router = useRouter()
  const navigate = React.useCallback(() => {
    router.push(href)
  }, [href, router])

  const $ = useStyles()

  function render() {
    return (
      <Pop in={status !== GameStatus.Unavailable}>
        <TouchableOpacity onPress={navigate} disabled={status !== GameStatus.Finished}>
          <Center style={$.TabBarButton}>
            <Image source={icon}/>
          </Center>
        </TouchableOpacity>
      </Pop>
    )
  }

  return render()

})

const useStyles = createUseStyles(theme => ({
  TabBar: {
    padding: layout.padding.sm,
  },

  TabBarButton: {
    width:  76,
    height: 76,

    opacity: 0.6,
    
    backgroundColor: theme.semantic.primary.alpha(0.6),
    borderRadius:    layout.radius.m,
  },
} as const))