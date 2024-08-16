import { BarcodeScanningResult, CameraView } from 'expo-camera'
import { useStore } from 'mobx-store'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, ScrollView, TouchableWithoutFeedback, View } from 'react-native'
import Animated, { ZoomIn } from 'react-native-reanimated'
import { useTimer } from 'react-timer'
import { useBoolean } from 'react-util/hooks'

import { Button, Center, HBox, Label, VBox } from '~/components'
import { focusedPromptSize } from '~/prompts/layout'
import { GameStore, QRStore, Trigger } from '~/stores'
import { colors, createUseStyles, layout } from '~/styling'
import { observer } from '~/util'
import { ProcessQRResult } from '../stores/GameStore'

export interface QRScannerProps {
  focused?:        boolean
  requestDismiss?: () => any
}

export const QRScanner = observer('QRScanner', (props: QRScannerProps) => {

  const {
    focused,
    requestDismiss,
  } = props

  const qrStore = useStore(QRStore)
  const gameStore = useStore(GameStore)
  const {hasPermission, ensurePermission} = qrStore

  const [triggerListOpen, openTriggerList, closeTriggerList] = useBoolean()

  const [t] = useTranslation('qr')

  const openSettingsBundle = React.useCallback(() => {
    Linking.openSettings()    
  }, [])

  const [showCross, setShowCross] = React.useState<boolean>(false)
  const crossTimer = useTimer()

  const flashCross = React.useCallback(() => {
    crossTimer.clearAll()
    crossTimer.setTimeout(() => setShowCross(true), 0)
    crossTimer.setTimeout(() => setShowCross(false), 300)
    crossTimer.setTimeout(() => setShowCross(true), 800)
    crossTimer.setTimeout(() => setShowCross(false), 1100)
    
    return () => {
      crossTimer.clearAll()
    }
  }, [crossTimer])

  // #region Scanning

  const lastScanAtRef = React.useRef<Date>(new Date(0))

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (result.type !== 'qr') { return }

    const timeSinceLastScan = Date.now() - lastScanAtRef.current.getTime()
    if (timeSinceLastScan < 1000) { return }
    lastScanAtRef.current.setTime(Date.now())

    const processResult = gameStore.processQR(result.data)
    if (processResult === ProcessQRResult.Invalid) {
      flashCross()
    }
  }

  const handleTriggerPress = React.useCallback((trigger: Trigger) => {
    gameStore.executeTrigger(trigger)
    closeTriggerList()
  }, [closeTriggerList, gameStore])

  // #region Rendering

  const $ = useStyles()

  function render() {
    if (hasPermission === null) {
    }

    return (
      <View style={$.QRScanner}>
        <View style={$.cameraWrapper}>
          {focused && renderContent()}
        </View>

        <View pointerEvents='none'>
          <Image
            style={$.frame}
            source={require('%images/camera.png')}
          />
        </View>

        <TouchableWithoutFeedback onLongPress={openTriggerList}>
          <View style={$.triggerButton}/>
        </TouchableWithoutFeedback>
        {focused && (
          <VBox style={$.dismiss}>
            <Button
              caption={t('buttons:dismiss')}
              onPress={requestDismiss}
              small
            />
          </VBox>
        )}
        {showCross && (
          <Center style={$.cross}>
            <Image
              source={require('%images/cross.png')}
              style={{width: 333, height: 276}}
            />
          </Center>
        )}
        {triggerListOpen && renderTriggerList()}
      </View>
    )
  }

  function renderContent() {
    if (hasPermission == null) {
      return renderRequestPermission()
    } else if (!hasPermission) {
      return renderNoPermission()
    } else {
      return renderScanner()
    }
  }

  function renderRequestPermission() {
    return (
      <Center flex padding={layout.padding.md} gap={layout.padding.md} pointerEvents='box-none'>
        <Label font='title-sm' align='center'>
          {t('permission.request.prompt')}
        </Label>
        <Button
          caption={t('permission.request.button')}
          onPress={ensurePermission}
        />
      </Center>
    )
  }

  function renderNoPermission() {
    return (
      <Center flex padding={layout.padding.md} gap={layout.padding.md} pointerEvents='box-none'>
        <Label font='title-sm' align='center'>
          {t('permission.denied')}
        </Label>
        <Button
          caption={t('permission.settings')}
          onPress={openSettingsBundle}
        />
      </Center>
    )
  }

  function renderScanner() {
    return (
      <CameraView
        style={$.camera}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={focused ? handleBarCodeScanned : undefined}
      />
    )
  }

  function renderTriggerList() {
    return (
      <Animated.View style={$.triggerList} entering={ZoomIn}>
        <ScrollView>
          <HBox wrap>
            {gameStore.triggers.map(renderTriggerButton)}
          </HBox>
        </ScrollView>
      </Animated.View>
    )
  }

  function renderTriggerButton(trigger: Trigger) {
    return (
      <Button
        key={trigger.key}
        style={{width: trigger.type === 'letter' ? layout.window.width / 3 : layout.window.width}}
        caption={trigger.type + ' ' + (trigger.type === 'letter' ? trigger.letter : trigger.game)}
        onPress={handleTriggerPress.bind(null, trigger)}
      />
    )
  }

  // #endregion

  return render()
})

const useStyles = createUseStyles({
  QRScanner: {
    ...focusedPromptSize,
  },

  cameraView: {
    flex: 1,
  },

  cameraWrapper: {
    position:        'absolute',
    overflow:        'hidden',
    backgroundColor: colors.bg.dark,

    left:         32,
    top:          86,
    right:        108,
    bottom:       76,
    borderRadius: 32,
  },

  camera: {
    ...layout.overlay,
  },

  frame: {
    ...layout.overlay,
  },

  triggerButton: {
    position: 'absolute',
    right:    34,
    width:    64,
    top:      96,
    height:   96,
  },

  dismiss: {
    position: 'absolute',
    left:     64,
    right:    156,
    bottom:   42,
  },

  triggerList: {
    ...layout.overlay,
  },

  cross: {
    ...layout.overlay,
  },
})