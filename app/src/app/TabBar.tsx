import { useRouter } from 'expo-router'
import * as React from 'react'
import { Image, ImageProps, TouchableOpacity } from 'react-native'
import { memo } from 'react-util'

import { Center, HBox } from '~/components'
import { layout } from '~/styling'
import { observer } from '~/util'

import 'react-native-reanimated'

export const TabBar = observer('TabBar', () => {


  function render() {
    return (
      <HBox style={$.TabBar} justify='space-between'>
        <TabBarButton
          icon={require('%images/cocktail.png')}
          href='/cocktail'
        />
        <TabBarButton
          icon={require('%images/colander.png')}
          href='/colander'
        />
        <TabBarButton
          icon={require('%images/cropcircle.png')}
          href='/cropcircle'
        />
        <TabBarButton
          icon={require('%images/invitation.png')}
          href='/invitation'
        />
      </HBox>
    )
  }


  return render()

})

interface TabBarButtonProps {
  icon: ImageProps['source']
  href: string
}

const TabBarButton = memo('TabBarButton', (props: TabBarButtonProps) => {

  const {icon, href} = props

  const router = useRouter()
  const navigate = React.useCallback(() => {
    router.push(href)
  }, [href, router])

  function render() {
    return (
      <TouchableOpacity onPress={navigate}>
        <Center style={$.TabBarButton}>
          <Image source={icon}/>
        </Center>
      </TouchableOpacity>
    )
  }

  return render()

})

const $ = {
  TabBar: {
    padding: layout.padding.sm,
  },

  TabBarButton: {
    width:  76,
    height: 76,
    
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor:     'rgba(255, 255, 255, 1)',
    borderWidth:     2,
    borderRadius:    layout.radius.s,
  },
} as const