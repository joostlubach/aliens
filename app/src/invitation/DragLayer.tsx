import React from 'react'
import { View } from 'react-native'

import { createUseStyles, layout } from '~/styling'
import { observer } from '~/util'
import { DragDropMonitor } from './DragDropMonitor'
import Word from './Word'

export interface DragLayerProps {
  dd: DragDropMonitor 
}

export const DragLayer = observer('DragLayer', (props: DragLayerProps) => {

  const {dd} = props

  const {draggedWord, currentLayout} = dd

  // #region Rendering

  const $ = useStyles()

  function render() {
    return (
      <View style={$.DragLayer} pointerEvents='none'>
        {draggedWord != null && (
          <View style={[$.draggedWord, currentLayout]}>
            <Word word={draggedWord}/>
          </View>
        )}
      </View>
    )
  }

  // #endregion

  return render()

})

const useStyles = createUseStyles({
  DragLayer: {
    ...layout.overlay,
  },

  draggedWord: {
    position: 'absolute',
  },
})