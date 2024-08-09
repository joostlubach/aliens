import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { VBox } from '~/components'
import { observer } from '~/util'
import { TypingScreen } from '../components/TypingScreen'

import 'react-native-reanimated'

const Start = observer('Start', () => {

  const [t] = useTranslation('start')
  const paragraphs = t('paragraphs') as unknown as string[]

  function render() {
    return (
      <VBox flex justify='middle'>
        <TypingScreen
          paragraphs={paragraphs}
          markup
        />
      </VBox>
    )
  }

  return render()

})

export default Start