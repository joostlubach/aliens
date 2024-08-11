import { Redirect } from 'expo-router'
import * as React from 'react'

import { AlienLabel, VBox } from '~/components'
import { observer } from '~/util'

const Index = observer('Index', () => {

  return (
    <Redirect href='/game' />
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