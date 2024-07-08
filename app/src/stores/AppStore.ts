import { loadAsync } from 'expo-font'
import { init } from 'mobx-store'
import { objectValues } from 'ytil'
import { text } from '~/styling'

export class AppStore {

  @init()
  public async loadFonts() {
    const promises = objectValues(text.fontFaces)
      .map(({family, source}) => loadAsync(family, source))
    await Promise.all(promises)
  }
  
}