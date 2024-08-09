import { useStore } from 'mobx-store'
import * as React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { memo } from 'react-util'

import { VBox } from '~/components'
import HBox from '../components/layout/HBox'
import { NFCStore } from '../stores'

import 'react-native-reanimated'

interface NfcDetectButtonProps {
  
}

export const NfcDetectButton = memo('NfcDetectButton', (props: NfcDetectButtonProps) => {

  const nfcStore = useStore(NFCStore)
  const detect = React.useCallback(() => {
    nfcStore.detect()
  }, [])

  function render() {
    return (
      <HBox justify='center'>
        <TouchableOpacity onPress={detect}>
          <VBox style={{padding: 5, borderRadius: 6, backgroundColor: 'red'}}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              Detect NFC
            </Text>
          </VBox>
        </TouchableOpacity>
      </HBox>
    )
  }

  return render()

})