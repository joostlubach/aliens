import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { TypingScreen, VBox } from '~/components'
import { observer } from '~/util'

import 'react-native-reanimated'

const crop = observer('crop', () => {

  const [t] = useTranslation('crop')
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

export default crop