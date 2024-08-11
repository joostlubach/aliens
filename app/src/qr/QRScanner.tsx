import { BarcodeScanningResult, CameraView } from 'expo-camera'
import { useStore } from 'mobx-store'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, View } from 'react-native'

import { Button, Center, Label, VBox } from '~/components'
import { GameStore, QRStore } from '~/stores'
import { colors, createUseStyles, layout } from '~/styling'
import { observer } from '~/util'
import { focusedPromptSize } from '../prompts/layout'

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

  const [t] = useTranslation('qr')

  const openSettingsBundle = React.useCallback(() => {
    Linking.openSettings()    
  }, [])

  // #region Scanning

  const lastScanAtRef = React.useRef<Date>(new Date(0))

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (result.type !== 'qr') { return }

    const timeSinceLastScan = Date.now() - lastScanAtRef.current.getTime()
    if (timeSinceLastScan < 1000) { return }
    lastScanAtRef.current.setTime(Date.now())

    gameStore.processQR(result.data)
  }

  // #region Rendering

  const $ = useStyles()

  function render() {
    if (hasPermission === null) {
    }

    return (
      <View style={$.QRScanner}>
        {hasPermission == null ? (
          renderRequestPermission()
        ) : !hasPermission ? (
          renderNoPermission()
        ) : (
          renderCameraView()
        )}
      </View>
    )
  }

  function renderRequestPermission() {
    return (
      <Center flex gap={layout.padding.md} pointerEvents='box-none'>
        <Label align='center'>
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
      <Center flex gap={layout.padding.md} pointerEvents='box-none'>
        <Label>
          {t('permission.denied')}
        </Label>
        <Button
          caption={t('permission.settings')}
          onPress={openSettingsBundle}
        />
      </Center>
    )
  }

  function renderCameraView() {
    return (
      <>
        <View style={$.cameraWrapper}>
          {focused && (
            <CameraView
              style={$.camera}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              onBarcodeScanned={focused ? handleBarCodeScanned : undefined}
            />
          )}
        </View>
        <Image
          style={$.frame}
          source={require('%images/camera.png')}
        />
        {focused && (
          <VBox style={$.dismiss}>
            <Button
              caption={t('buttons:dismiss')}
              onPress={requestDismiss}
              small
            />
          </VBox>
        )}
      </>
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

  dismiss: {
    position: 'absolute',
    left:     64,
    right:    156,
    bottom:   46,
  },

})