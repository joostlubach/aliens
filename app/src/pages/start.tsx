import { Audio } from 'expo-av'
import * as React from 'react'

import { VBox } from '~/components'
import { observer } from '~/util'
import { TypingScreen } from '../components/TypingScreen'

import 'react-native-reanimated'

const Start = observer('Start', () => {

  const [currentParagraphIndex, setCurrentParagraphIndex] = React.useState<number>(0)
  const currentParagraph = paragraphs[currentParagraphIndex]

  const nextParagraph = React.useCallback(() => {
    if (currentParagraphIndex === paragraphs.length - 1) { return }
    setCurrentParagraphIndex(currentParagraphIndex + 1)
  }, [currentParagraphIndex])

  const [sound, setSound] = React.useState<Audio.Sound | null>(null)

  React.useEffect(() => {
    Audio.Sound
      .createAsync(require('%audio/alien.mp3'))
      .then(({sound}) => { setSound(sound) })      
  }, [])


  function render() {
    return (
      <VBox flex justify='middle'>
        {sound != null && (
          <TypingScreen
            paragraphs={paragraphs}
            typingSound={sound}
            markup
          />
        )}
      </VBox>
    )
  }

  return render()

})

const paragraphs = [
  "HELLO EARTHLING. MY NAME IS |VAGINA|. I AM FROM THE PLANET |BUTTHOLE|, THE FIRST AND ONLY PLANET AROUND THE STAR |BUTT|, ON YOUR PLANET BETTER KNOWN AS “POLARIS”, BUT WE THINK THAT IS A STUPID NAME.",
  "WE WERE ON OUR WAY TO A RESTAURANT IN A NEARBY SOLAR SYSTEM TO GRAB SOME FOOD, WHEN WE CRASHED ON YOUR PLANET. WE APPARENTLY DISTURBED YOUR STRANGE ROMANTIC JOINING RITUAL.",
  // "WE HAVE DISCUSSED THIS INCIDENT AT HOME, AND WE HAVE CONCLUDED THAT IT WAS NOT OUR FAULT.",
  "OUR SUPREME OVERLORD |COCK URINESON| DID LIKE THE PLACE FOR HIS OWN JOINING RITUAL. ESPECIALLY THE MURKY WARM WATER IN THE TUB WITH THE LITTLE HEATER INSIDE PLEASED OUR OVERLORD. IT IS VERY SUITABLE TO MATURE HIS SEMEN. EXCELLENT.",
  "ALSO THE DARK LOUD BUNKER PLEASED OUR OVERLORD AS IT REMINDED HIM OF HIS MOTHER.",
  "IF YOU CAN MAKE SURE THAT EVERYTHING IS PREPARED FOR THE JOINING RITUAL, OUR OVERLORD WILL GRANT YOU AMITY AND NOT USE YOUR BODIES AS A BREEDING VESSEL.",
  "WE REQUIRE FOUR THINGS:\n1. OUR OVERLORD’S FAVORITE COCKTAIL\n2. TWO FUNCTIONING CEREMONIAL COLANDERS\n3. A CROP CIRCLE OFFERING PARKING SPACE FOR 1000 UFO’S\n4. AN OFFICIAL INVITATION (WITHOUT SPELLING ERRORS!)",
  "WHEN YOU HAVE TAKEN CARE OF THESE FOUR THINGS, SEND US THE SIGNAL.\n\nGOOD LUCK, AND DON’T FUCK IT UP.",
]

export default Start