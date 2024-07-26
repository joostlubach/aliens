import { faBell } from '@fortawesome/free-regular-svg-icons'
import { Link } from 'expo-router'
import * as React from 'react'
import 'react-native-reanimated'
import { Center, Icon, Label } from '~/components'
import { layout } from '~/styling'
import { observer } from '~/util'
import HBox from '../components/layout/HBox'

const Overview = observer('Overview', () => {

  function render() {
    return (
      <Center flex>
        <Link href='/'>
          <HBox gap={layout.padding.inline.md}>
            <Icon icon={faBell}/> 
            <Label>
              Home
            </Label>
          </HBox>
        </Link>
      </Center>
    )
  }

  return render()

})

export default Overview