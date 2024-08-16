import { useRouter } from 'expo-router'
import { useStore } from 'mobx-store'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, TouchableWithoutFeedback, View } from 'react-native'
import Animated, {
  AnimatableValue,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { memo } from 'react-util'
import { usePrevious } from 'react-util/hooks'

import { HBox, Label, TouchableScale, VBox } from '~/components'
import { GameName, GameStore, Prompt } from '~/stores'
import { colors, createUseStyles, fonts, layout } from '~/styling'
import { observer } from '~/util'
import { QRScanner } from '../qr/QRScanner'
import { PromptScreen } from './PromptScreen'
import { focusedPromptLayout, focusedPromptSize, unfocusedPromptLayout } from './layout'

export const PromptCarousel = observer('PromptCarousel', () => {

  const gameStore = useStore(GameStore)
  const safeArea = useSafeAreaInsets()

  const handleEvent = React.useCallback((event: string) => {
    if (event === 'camera') {
      gameStore.showCamera()
    } else if (event === 'typer') {
      gameStore.showTyper()
    } else {
      gameStore.makeGameAvailable(event as GameName)
    }
  }, [gameStore])

  const dismiss = React.useCallback(() => {
    if (gameStore.focusedPromptKey === 'start') { return }
    gameStore.focusOnPrompt(null)
  }, [gameStore])

  // #region Rendering

  const $ = useStyles()

  function render() {
    return (
      <VBox style={$.PromptCarousel} flex pointerEvents='box-none'>
        {gameStore.visiblePrompts.map((prompt, index) => (
          <PromptCarouselItem
            key={index}
            prompt={prompt}
            index={index}
            focused={gameStore.isPromptFocused(prompt)}
            onEvent={handleEvent}
          />
        ))}

        {gameStore.focusedPromptKey != null && (
          <TouchableWithoutFeedback onPress={dismiss}>
            <Animated.View entering={FadeIn} style={$.shim}/>
          </TouchableWithoutFeedback>
        )}
      </VBox>
    )
  }

  // #endregion

  return render()

})

interface PromptCarouselItemProps {
  prompt:  Prompt | '$scanner' | '$typer'
  index:   number
  focused: boolean

  onEvent?: (event: string) => any
}

const PromptCarouselItem = memo('PromptCarouselItem', (props: PromptCarouselItemProps) => {

  const {
    prompt,
    index,
    focused,
    onEvent,
  } = props

  const gameStore = useStore(GameStore)
  const [t] = useTranslation()

  const router = useRouter()
  const goToInvitation = React.useCallback(() => {
    router.push('/invitation')
  }, [router])


  // #region Delayed focus
  
  // If the prompt was mounted with focused=true, we want to show it unfocused and then set it to
  // focused, to trigger the animation.

  const prevFocused = usePrevious(focused)

  const [showFocused, setShowFocused] = React.useState(() => {
    if (prevFocused === undefined) {
      return false
    } else {
      return focused
    }
  })

  React.useEffect(() => {
    setShowFocused(focused)
  }, [focused, prevFocused])

  // #endregion

  // #region Animated layout

  const safeArea = useSafeAreaInsets()

  const itemLayout = React.useMemo(
    () => showFocused ? focusedPromptLayout : unfocusedPromptLayout(index, safeArea),
    [index, safeArea, showFocused]
  )

  const left = useSharedValue(itemLayout.left)
  const top = useSharedValue(itemLayout.top)
  const scale = useSharedValue(itemLayout.scale)  
  const captionOpacity = useSharedValue(focused ? 0 : 1)

  React.useEffect(() => {
    left.value = withCarouselSpring(itemLayout.left)
    top.value = withCarouselSpring(itemLayout.top)
    scale.value = withCarouselSpring(itemLayout.scale)
    captionOpacity.value = withCarouselSpring(focused ? 0 : 1)
  }, [captionOpacity, focused, itemLayout.left, itemLayout.scale, itemLayout.top, left, scale, top])

  const animatedStyles = useAnimatedStyle(() => ({
    left:      left.value,
    top:       top.value,
    transform: [{
      translateX: -focusedPromptSize.width / 2,
    }, {
      translateY: -focusedPromptSize.height / 2,
    }, {
      scale: scale.value,
    }, {
      translateX: focusedPromptSize.width / 2,
    }, {
      translateY: focusedPromptSize.height / 2,
    }],
  }))

  // #endregion

  // #region Callbacks

  const focus = React.useCallback(() => {
    if (prompt === '$scanner') {
      gameStore.focusOnPrompt('$scanner')
    } else if (prompt === '$typer') {
      gameStore.focusOnPrompt('$typer')
    } else {
      gameStore.focusOnPrompt(prompt.key)
    }
  }, [gameStore, prompt])

  const dismiss = React.useCallback(() => {
    gameStore.focusOnPrompt(null)
  }, [gameStore])

  // #endregion

  // #region Rendering

  const $ = useStyles()

  function render() {
    return (
      <Animated.View style={[$.PromptCarouselItem, showFocused ? $.focusedItem : $.unfocusedItem, animatedStyles]} pointerEvents='box-none'>
        <TouchableScale onPress={focus} disabled={focused}>
          {renderContent()}
        </TouchableScale>
        {!focused && renderCaption()}
      </Animated.View>
    )
  }

  function renderContent() {
    if (prompt === '$scanner') {
      return (
        <QRScanner
          requestDismiss={dismiss}
          focused={focused}
        />
      )
    } else if (prompt === '$typer') {
      return (
        <TouchableScale onPress={goToInvitation}>
          <Image
            source={require('%images/typer.png')}
            style={{...focusedPromptSize}}
          />
        </TouchableScale>
      )
    } else {
      return (
        <PromptScreen
          key={prompt.key}
          paragraphs={prompt.paragraphs}
          markup
        
          interactive={focused}
          paused={!focused}
          onEvent={onEvent}
          requestDismiss={dismiss}
        />

      )
    }
  }

  function renderCaption() {
    const captionStyle = {
      paddingHorizontal: layout.padding.inline.sm / itemLayout.scale,
      paddingVertical:   1 / itemLayout.scale,
    }

    return (
      <Animated.View style={[$.itemCaptionContainer, {opacity: captionOpacity}]}>
        <View style={[$.itemCaption, captionStyle]}>
          {renderCaptionContent()}
        </View>
      </Animated.View>
    )
  }

  function renderCaptionContent() {
    const labelStyle = {
      fontSize:   fonts['title-sm'].size / itemLayout.scale,
      lineHeight: fonts['title-sm'].size / itemLayout.scale * fonts['title-sm'].lineHeight,
    }

    if (prompt === '$scanner' || prompt === '$typer' || !prompt.key.match(/^.*:.*$/)) {
      return (
        <Label style={labelStyle} font='body-sm' align='center'>
          {prompt === '$scanner' ? t('qr:title') : prompt === '$typer' ? t('typer:title') : t(`${prompt.key}:title`)}
        </Label>
      )
    } else {
      const match = prompt.key.match(/^(.*):(.*)$/)
      if (match == null) { return null }

      return (
        <HBox gap={layout.padding.inline.sm}>
          <Image
            source={gameIcons[match[1] as GameName]}
            resizeMode='contain'
            style={{width: 20 / itemLayout.scale, height: 20 / itemLayout.scale}}
          />
          <Label style={labelStyle} font='body-sm'>
            {t(`game:${match[2]}`)}
          </Label>
        </HBox>
      )
    }
  }

  // #endregion

  return render()

})

const gameIcons = {
  cocktail:   require('%images/cocktail.png'),
  colander:   require('%images/colander.png'),
  crop:       require('%images/crop.png'),
  invitation: require('%images/invitation.png'),
}

function withCarouselSpring<T extends AnimatableValue>(value: T): T {
  return withSpring(value, {
    damping:   25,
    stiffness: 350,
  })
}

const useStyles = createUseStyles({
  PromptCarousel: {
    flex: 1,
  },

  PromptCarouselItem: {
    position: 'absolute',
    ...focusedPromptSize,
  },

  unfocusedItem: {
    zIndex: 0,
  },

  shim: {
    ...layout.overlay,
    zIndex:          1,
    backgroundColor: colors.black.alpha(0.4),
  },

  focusedItem: {
    zIndex: 2,
  },

  itemCaptionContainer: {
    position:   'absolute',
    left:       0,
    right:      0,
    top:        '100%',
    alignItems: 'center',
  },

  itemCaption: {
    backgroundColor: colors.black.alpha(0.4),
    borderRadius:    1000,
  },
})