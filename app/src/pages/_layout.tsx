import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { StoreProvider } from 'mobx-store'
import * as React from 'react'
import { Image, ImageBackground } from 'react-native'
import 'react-native-reanimated'
import { AlienLabel, Center, VBox } from '~/components'
import Stores from '~/stores'
import { layout, Themed } from '~/styling'
import { observer } from '~/util'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = observer('RootLayout', () => {

  const onStoresInitialized = React.useCallback(() => {
    SplashScreen.hideAsync()
  }, [])

  function render() {
    return (
      <StoreProvider Store={Stores} onInitialized={onStoresInitialized}>
        <ImageBackground
          style={$.RootLayout}
          source={require('%images/background.png')}
        >
          <StatusBar style='light'/>

          <Themed dark>
            <VBox style={$.content} safeArea>
              <VBox flex style={{justifyContent: 'center'}}>
                {renderArt()}
                <AlienLabel align='center' size='lg'>
                  DE BRUILOFT
                </AlienLabel>
              </VBox>
            </VBox>
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
  },

  content: {
    flex: 1,
    padding: layout.padding.md
  }
} as const