import { loadAsync } from 'expo-font'
import { init } from 'mobx-store'
import { objectValues } from 'ytil'

import { text } from '~/styling'

export class AppStore {

  @init()
  public async loadFonts() {
    const map: Record<string, any> = {}
    for (const face of objectValues(text.fontFaces)) {
      if (typeof face === 'string') { continue }

      map[face.family] = face.source
    }
    await loadAsync(map).catch(error => {
      console.warn("Error loadinf fonts: ", error)
    })
  }
  
}