// @nosort
import '~/init'

import { Slot } from 'expo-router'
import * as ExpoSplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { StoreProvider } from 'mobx-store'
import * as React from 'react'
import { Image, ImageBackground } from 'react-native'
import 'react-native-reanimated'
import { Center, VBox } from '~/components'
import Stores from '~/stores'
import { Themed } from '~/styling'
import { observer } from '~/util'

// Prevent the splash screen from auto-hiding before asset loading is complete.
ExpoSplashScreen.preventAutoHideAsync();

const RootLayout = observer('RootLayout', () => {

  const onStoresInitialized = React.useCallback(() => {
    ExpoSplashScreen.hideAsync()
  }, [])

  function render() {
    return (
      <StoreProvider Store={Stores} onInitialized={onStoresInitialized}>
      <ImageBackground
        style={$.RootLayout}
        source={require('%images/background.png')}
      >
        <StatusBar style='light'/>
        {renderArt()}

        <Themed dark>
          <Slot/>
        </Themed>
      </ImageBackground>
      </StoreProvider>
    )
  }

  function renderArt() {
    return (
      <VBox overlay>
        <Center position={{left: 10, top: 10}}>
          <Image
            source={require('%images/homeart1.png')}
          />
        </Center>
        <Center position={{bottom: -60, right: 0}}>
          <Image
            source={require('%images/homeart2.png')}
            style={{opacity: 0.5}}
          />
        </Center>

      </VBox>
    )
  }

  return render()

})

export default RootLayout

const $ = {
  RootLayout: {
    flex: 1,
    resizeMode: 'cover'
  }
} as const