import { Link } from 'expo-router'
import * as React from 'react'
import 'react-native-reanimated'
import { AlienLabel, VBox } from '~/components'
import { observer } from '~/util'

const RootLayout = observer('RootLayout', () => {

  function render() {
    return (
      <VBox flex justify='middle'>
        <AlienLabel align='center' size='lg'>
          DE BRUILOFT
        </AlienLabel>

        <Link href="/overview">
          Overview
        </Link>
      </VBox>
    )
  }

  return render()

})

export default RootLayout