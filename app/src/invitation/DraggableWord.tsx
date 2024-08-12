import { useStore } from 'mobx-store'
import React from 'react'
import { LayoutChangeEvent, LayoutRectangle, PanResponder, View } from 'react-native'

import { GameStore } from '~/stores'
import { colors, createUseStyles, layout } from '~/styling'
import { observer } from '~/util'
import { DragDropMonitor } from './DragDropMonitor'
import Word, { WordProps } from './Word'

export interface DraggableWordProps extends WordProps {
  dd: DragDropMonitor
}

export const DraggableWord = observer('DraggableWord', (props: DraggableWordProps) => {

  const {dd, ...rest} = props

  const gameStore = useStore(GameStore)

  const containerRef = React.useRef<View>(null)
  const layoutRef = React.useRef<LayoutRectangle>({x: 0, y: 0, width: 0, height: 0})
  const setLayout = React.useCallback((event: LayoutChangeEvent) => {
    containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      layoutRef.current = {x: pageX, y: pageY, width, height}
    })
  }, [])

  const panResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,

    onPanResponderGrant: (_, state) => {
      const layout = layoutRef.current
      if (layout == null) { return }

      const startPoint = {
        x: state.x0,
        y: state.y0,
      }
      dd.startDrag(props.word, layout, startPoint)
    },

    onPanResponderMove: (_, state) => {
      dd.drag({
        x: state.moveX,
        y: state.moveY,
      })
    },

    onPanResponderEnd: (_, state) => {
      dd.endDrag()

      if (Math.abs(state.dx) < 2 && Math.abs(state.dy) < 2) {
        gameStore.addWordToEnd(props.word)
      }
    },
  }), [dd, gameStore, props.word])

  const isDragged = dd.draggedWord === props.word

  // #region Rendering

  const $ = useStyles()

  function render() {
    return (
      <View style={$.DraggableWord} {...panResponder.panHandlers} onLayout={setLayout} ref={containerRef}>
        <View style={[$.word, isDragged && $.hiddenWord]}>
          <Word {...rest}/>
        </View>
        {isDragged && <View style={$.placeholder}/>}
      </View>
    )
  }

  
  // #endregion

  return render()

})

const useStyles = createUseStyles({
  DraggableWord: {},

  placeholder: {
    ...layout.overlay,
    borderWidth: 2,
    borderColor: colors.black.alpha(0.3),
    borderStyle: 'dashed',
  },

  word: {},

  hiddenWord: {
    opacity: 0,
  },
})