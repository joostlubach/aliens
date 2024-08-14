import * as React from 'react'
import {
  Image,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native'
import { memo } from 'react-util'
import { useBoolean } from 'react-util/hooks'
import { Size } from 'ytil'

import { colors, createUseStyles, layout } from '~/styling'
import { Label } from './Label'
import { Center } from './layout'

export interface ButtonProps extends TouchableWithoutFeedbackProps {
  caption?: string
  small?:   boolean

  children?: React.ReactNode
}


export const Button = memo('Button', (props: ButtonProps) => {

  const {
    caption,
    small = false,
    children,
    ...rest
  } = props

  const [pressed, pressIn, pressOut] = useBoolean()

  const [backgroundSlicesSize, setBackgroundSlicesSize] = React.useState<Size>({width: 0, height: 0})

  const layoutBackgroundSlices = React.useCallback((event: LayoutChangeEvent) => {
    setBackgroundSlicesSize({
      width:  event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    })
  }, [])

  const backgroundSliceLayout = React.useCallback((which: keyof typeof images['normal']) => {
    let left: number | undefined
    let top: number | undefined
    let right: number | undefined
    let bottom: number | undefined

    let width: number | undefined
    let height: number | undefined

    if (which === 'nw' || which === 'w' || which === 'sw') {
      left = 0
      width = sliceWidth
    }
    if (which === 'ne' || which === 'e' || which === 'se') {
      right = 0
      width = sliceWidth
    }
    if (which === 'nw' || which === 'n' || which === 'ne') {
      top = 0
      height = sliceWidth
    }
    if (which === 'sw' || which === 's' || which === 'se') {
      bottom = 0
      height = sliceWidth
    }


    if (which === 'n' || which === 's') {
      left = sliceWidth
      right = sliceWidth
      width = Math.max(0, backgroundSlicesSize.width - 2 * sliceWidth)
    }
    if (which === 'e' || which === 'w') {
      top = sliceWidth
      bottom = sliceWidth
      height = Math.max(0, backgroundSlicesSize.height - 2 * sliceWidth)
    }

    return {left, top, right, bottom, width, height}
  }, [backgroundSlicesSize.height, backgroundSlicesSize.width])

  // #region Rendering

  const $ = useStyles()

  function render() {
    return (
      <TouchableWithoutFeedback
        onPressIn={pressIn}
        onPressOut={pressOut}
        {...rest}
      >
        <View style={[$.Button, props.disabled && $.disabled]}>
          {renderBackgroundSlices()}
          {renderContent()}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  function renderBackgroundSlices() {
    const set = pressed ? images.pressed : images.normal

    return (
      <View style={[$.backgroundSlices]} onLayout={layoutBackgroundSlices}>
        <Image style={[$.slice, backgroundSliceLayout('nw')]} resizeMode='stretch' source={set.nw}/>
        <Image style={[$.slice, backgroundSliceLayout('w')]} resizeMode='stretch' source={set.w}/>
        <Image style={[$.slice, backgroundSliceLayout('sw')]} resizeMode='stretch' source={set.sw}/>
        <Image style={[$.slice, backgroundSliceLayout('ne')]} resizeMode='stretch' source={set.ne}/>
        <Image style={[$.slice, backgroundSliceLayout('e')]} resizeMode='stretch' source={set.e}/>
        <Image style={[$.slice, backgroundSliceLayout('se')]} resizeMode='stretch' source={set.se}/>
        <Image style={[$.slice, backgroundSliceLayout('n')]} resizeMode='stretch' source={set.n}/>
        <Image style={[$.slice, backgroundSliceLayout('s')]} resizeMode='stretch' source={set.s}/>
      </View>
    )
  }

  function renderContent() {
    return (
      <Center style={[$.content, small && $.contentSmall]}>
        {caption != null && (
          <Label font={small ? 'title-sm' : 'title-md'} shadow={false} color={colors.button.fg}>
            {caption}
          </Label>
        )}
        {children}
      </Center>
    )
  }

  // #endregion

  return render()

})

const images = {
  normal: {
    nw: require('%images/button-nw.png'),
    w:  require('%images/button-w.png'),
    sw: require('%images/button-sw.png'),
    ne: require('%images/button-ne.png'),
    e:  require('%images/button-e.png'),
    se: require('%images/button-se.png'),
    n:  require('%images/button-n.png'),
    s:  require('%images/button-s.png'),
  },
  pressed: {
    nw: require('%images/button-pressed-nw.png'),
    w:  require('%images/button-pressed-w.png'),
    sw: require('%images/button-pressed-sw.png'),
    ne: require('%images/button-pressed-ne.png'),
    e:  require('%images/button-pressed-e.png'),
    se: require('%images/button-pressed-se.png'),
    n:  require('%images/button-pressed-n.png'),
    s:  require('%images/button-pressed-s.png'),
  },
}

const sliceWidth = 4

const useStyles = createUseStyles({
  Button: {
    backgroundColor: colors.button.bg,
  },

  disabled: {
    opacity: 0.6,
  },

  backgroundSlices: {
    position: 'absolute',
    top:      0,
    left:     0,
    right:    0,
    bottom:   0,
    overflow: 'hidden',
  },

  slice: {
    position: 'absolute',
  },

  content: {
    minHeight: 24,
    minWidth:  92,

    paddingVertical: layout.padding.inline.md,
    paddingLeft:     layout.padding.inline.lg - 2,
    paddingRight:    layout.padding.inline.lg + 2,
  },

  contentSmall: {
    paddingVertical: layout.padding.inline.sm,
    paddingLeft:     layout.padding.inline.md - 2,
    paddingRight:    layout.padding.inline.md + 2,
  },
})