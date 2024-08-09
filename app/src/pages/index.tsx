import { Redirect } from 'expo-router'
import * as React from 'react'

import { AlienLabel, VBox } from '~/components'
import { observer } from '~/util'

import 'react-native-reanimated'

const Index = observer('Index', () => {

  return (
    <Redirect href='/start' />
  )

  function render() {
    return (
      <VBox flex justify='middle'>
        <AlienLabel align='center' size='lg'>
          DE BRUILOFT
        </AlienLabel>
      </VBox>
    )
  }

  return render()

})

export default Index