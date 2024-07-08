import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { initStore, StoreProvider } from 'mobx-store'
import * as React from 'react'
import { ImageBackground } from 'react-native'
import 'react-native-reanimated'
import { AlienLabel, Label, VBox } from '~/components'
import { useStore } from '~/hooks'
import Stores, { AppStore } from '~/stores'
import { layout, Themed } from '~/styling'
import { observer } from '~/util'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = observer('RootLayout', () => {

  const onStoresInitialized = React.useCallback(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <StoreProvider Store={Stores} onInitialized={onStoresInitialized}>
      <ImageBackground
        style={$.RootLayout}
        source={require('%images/background.png')}
      >
        
        <StatusBar style='light'/>

        <Themed dark>
          <VBox style={$.content} safeArea>
            <AlienLabel align='center'>
              Hoi
            </AlienLabel>
          </VBox>
        </Themed>
      </ImageBackground>
    </StoreProvider>
  );

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