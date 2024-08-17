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

  const wordLayoutsRef = React.useRef<Map<string, LayoutRectangle>>(new Map())
  const insertionPointsRef = React.useRef<Point[] | null>(null)

  const handleWordLayout = React.useCallback((word: string, layout: LayoutRectangle | null) => {
    if (layout == null) {
      wordLayoutsRef.current.delete(word)
    } else {
      wordLayoutsRef.current.set(word, layout)
    }
  }, [])

  const calculateInsertionPoints = React.useCallback(() => {
    const insertionPoints: Point[] = []

    const set = (index: number, layout: LayoutRectangle) => {
      while (insertionPoints.length <= index) {
        insertionPoints.push({x: 0, y: 0})
      }
      insertionPoints[index] = {
        x: layout.x - wordGap / 2 + paddingHorizontal,
        y: layout.y - wordGap / 2 + paddingVertical + layout.height / 2,
      }
    }

    for (const [word, layout] of wordLayoutsRef.current.entries()) {
      const index = wordsRef.current.findIndex(it => it === word)
      set(index, layout)

      if (index === wordsRef.current.length - 1) {
        set(index + 1, {
          x:      layout.x + layout.width + wordGap,
          y:      layout.y,
          width:  0,
          height: layout.height,
        })
      }
    }

    insertionPointsRef.current = insertionPoints    
  }, [wordsRef])

  const wordIndexForPoint = React.useCallback((point: Point) => {
    const insertionPoints = insertionPointsRef.current
    if (insertionPoints == null) { return -1 }

    // console.log('----')
    // console.log(point.x, point.y)
    // console.log(insertionPoints.map(it => `(${it.x}, ${it.y})`).join(', '))

    let minDistance = Infinity
    let closestPointIndex: number = insertionPoints.length

    for (const [index, insertionPoint] of insertionPoints.entries()) {
      const distance = Math.hypot(point.x - insertionPoint.x, point.y - insertionPoint.y)
      if (distance >= minDistance) { continue }

      minDistance = distance
      closestPointIndex = index
    }

    return closestPointIndex
  }, [])

  // #endregion

  // #region Dropzone

  const onHover = React.useCallback((word: string, point: Point) => {
    if (insertionPointsRef.current == null) {
      calculateInsertionPoints()
    }

    const words = wordsRef.current
    const currentIndex = words.findIndex(it => it === word)
    const nextIndex = wordIndexForPoint(point)
    if (nextIndex === -1) { return }
    if (currentIndex === nextIndex) { return }

    const newWords = [...words].filter(it => it !== word)
    newWords.splice(nextIndex, 0, word)
    setWords(newWords)
  }, [calculateInsertionPoints, wordIndexForPoint, wordsRef])

  const onLeave = React.useCallback(() => {
    insertionPointsRef.current = null
  }, [])

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
      dd.registerDropZone('page', layout, {onHover, onLeave, onDrop, onDropOutside})
    })
  }, [dd, onDrop, onDropOutside, onHover, onLeave])

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
                onLayout={handleWordLayout}
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

const paddingVertical = layout.padding.lg
const paddingHorizontal = layout.padding.xl

const useStyles = createUseStyles({
  InvitationPage: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingVertical,
    paddingHorizontal,
  },
})