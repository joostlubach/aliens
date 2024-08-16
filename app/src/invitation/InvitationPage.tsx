import { useStore } from 'mobx-store'
import * as React from 'react'
import { LayoutChangeEvent, LayoutRectangle, View } from 'react-native'
import { memo } from 'react-util'
import { useContinuousRef, usePrevious } from 'react-util/hooks'
import { Point } from 'ytil'

import { HBox } from '~/components'
import { DragDropMonitor } from '~/invitation/DragDropMonitor'
import { DraggableWord } from '~/invitation/DraggableWord'
import { GameStore } from '~/stores'
import { createUseStyles, layout } from '~/styling'
import { observer } from '~/util'
import { arrayEquals } from '../../../vendor/ytil/src/arrays'
import { DraggableWordProps } from './DraggableWord'
import { wordGap } from './layout'

export interface InvitationPageProps {
  dd: DragDropMonitor 
}

export const InvitationPage = observer('InvitationPage', (props: InvitationPageProps) => {

  const gameStore = useStore(GameStore)
  
  const {invitationWords} = gameStore
  const prevInvitationWords = usePrevious(invitationWords)

  const {dd} = props

  const [words, setWords] = React.useState<string[]>(invitationWords)
  const wordsRef = useContinuousRef(words)

  React.useEffect(() => {
    if (arrayEquals(invitationWords, prevInvitationWords)) { return }
    if (arrayEquals(words, invitationWords)) { return }
    setWords(invitationWords)
  }, [invitationWords, prevInvitationWords, words])

  // #region Layouts

  const wordLayoutRef = React.useRef<Map<string, LayoutRectangle>>(new Map())

  const layoutWord = React.useCallback((word: string, layout: LayoutRectangle | null) => {
    if (layout == null) {
      wordLayoutRef.current.delete(word)
    } else {
      wordLayoutRef.current.set(word, layout)
    }
  }, [])

  const indexedLayouts = React.useCallback((except: string): LayoutRectangle[] => {
    const indexed: LayoutRectangle[] = []

    const set = (index: number, layout: LayoutRectangle) => {
      while (indexed.length <= index) {
        indexed.push({x: 0, y: 0, width: 0, height: 0})
      }
      indexed[index] = layout
    }

    for (const [word, layout] of wordLayoutRef.current.entries()) {
      // if (word === except) { continue }
      const index = wordsRef.current.findIndex(it => it === word)
      set(index, layout)
    }

    return indexed    
  }, [wordsRef])

  const wordIndexForPoint = React.useCallback((word: string, point: Point) => {
    const layouts = indexedLayouts(word)

    for (const [index, layout] of layouts.entries()) {
      const nextX = layout.x + layout.width + wordGap
      const nextY = layout.y + layout.height + wordGap

      if (point.x < layout.x || point.x >= nextX) { continue }
      if (point.y < layout.y || point.y >= nextY) { continue }
      return index
    }

    return words.length
  }, [indexedLayouts, words.length])

  // #endregion

  // #region Dropzone

  const onHover = React.useCallback((word: string, point: Point) => {
    const words = wordsRef.current
    const currentIndex = words.findIndex(it => it === word)
    const nextIndex = wordIndexForPoint(word, point)
    if (currentIndex === nextIndex) { return }

    const newWords = [...words].filter(it => it !== word)
    newWords.splice(nextIndex, 0, word)
    setWords(newWords)
  }, [wordIndexForPoint, wordsRef])

  const onDrop = React.useCallback(() => {
    gameStore.setInvitationWords(wordsRef.current)
  }, [gameStore, wordsRef])

  const onDropOutside = React.useCallback((word: string) => {
    const nextWords = wordsRef.current.filter(it => it !== word)
    setWords(nextWords)
    gameStore.setInvitationWords(nextWords)
  }, [gameStore, wordsRef])

  const containerRef = React.useRef<View>(null)
  const setLayout = React.useCallback((event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout

    containerRef.current?.measure((_x, _y, _width, _height, pageX, pageY) => {
      const layout = {x: pageX, y: pageY, width, height}
      dd.registerDropZone('page', layout, {onHover, onDrop, onDropOutside})
    })
  }, [dd, onDrop, onDropOutside, onHover])

  React.useEffect(() => {
    return () => {
      dd.unregisterDropZone('page')
    }
  }, [dd])

  // #endregion

  // #region Rendering

  const $ = useStyles()

  function render() {
    return (
      <View style={$.InvitationPage}>
        <View style={$.container} onLayout={setLayout} ref={containerRef}>
          <HBox wrap gap={wordGap}>
            {words.map((word, index) => (
              <AddedWord
                key={index}
                index={index}
                word={word}
                dd={dd}
                onLayout={layoutWord}
              />
            ))}
          </HBox>
        </View>
      </View>
    )
  }

  // #endregion

  return render()

})

interface AddedWordProps extends DraggableWordProps {
  index:    number
  onLayout: (word: string, layout: LayoutRectangle | null) => void
}

const AddedWord = memo('AddedWord', (props: AddedWordProps) => {

  const {index, word, onLayout, ...rest} = props

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    onLayout(word, event.nativeEvent.layout)
  }, [onLayout, word])

  React.useEffect(() => {
    return () => {
      onLayout(word, null)
    }
  }, [index, onLayout, word])

  return (
    <View onLayout={handleLayout}>
      <DraggableWord
        word={word}
        {...rest}
      />
    </View>
  )

})

const useStyles = createUseStyles({
  InvitationPage: {
    flex:              1,
    padding:           layout.padding.lg,
    paddingHorizontal: layout.padding.xl,
  },

  container: {
    flex: 1,
  },
})