import { Image, Platform, StyleSheet, View } from 'react-native'
import { memo } from 'react-util'
import { HelloWave } from '~/components/HelloWave'
import ParallaxScrollView from '~/components/ParallaxScrollView'
import { ThemedText } from '~/components/ThemedText'
import { ThemedView } from '~/components/ThemedView'

const HomeScreen = memo('HomeScreen', () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

      <ThemedText>
        Hoi
      </ThemedText>

    </View>
  )  
})

export default HomeScreen