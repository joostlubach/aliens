import React from 'react'
import { Image } from 'react-native'
import { memo } from 'react-util'

import { Center, HBox, VBox } from '~/components'
import { createUseStyles, layout } from '~/styling'
import { focusedPromptSize } from '../prompts/layout'
import Word from './Word'

export interface TyperProps {
  focused: boolean
  
}

export const Typer = memo('Typer', (props: TyperProps) => {

  const {focused} = props

  // #region Rendering

  const $ = useStyles()

  function render() {
    return (
      <VBox style={$.Typer} justify='middle'>
        <VBox>
          <Center>
            <Image
              source={require('%images/typer.png')}
              style={$.backgroundImage}
            />
          </Center>
          {focused && renderWords()}
        </VBox>
      </VBox>
    )
  }

  function renderWords() {
    return (
      <HBox wrap style={$.wordsContainer} gap={layout.padding.sm} justify='center'>
        <Word text='DEAR'/>
        <Word text='GUEST'/>
        <Word text='PLEASE'/>
        <Word text='COME'/>
        <Word text='TO'/>
        <Word text='OUR'/>
        <Word text="OVERLORD'S"/>
        <Word text='JOINING'/>
      </HBox>
    )
  }

  // #endregion

  return render()

})

const useStyles = createUseStyles({
  Typer: {  
    ...focusedPromptSize,
  },

  backgroundImage: {
    ...focusedPromptSize,
  },

  wordsContainer: {
    padding: layout.padding.md,
  },
})