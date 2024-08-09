import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'
import { makeObservable, observable, runInAction } from 'mobx'
import { init } from 'mobx-store'
import { objectEntries } from 'ytil'

export class AudioStore {

  constructor() {
    makeObservable(this)
  }

  @init()
  public async prepareAudio() {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: false,

      allowsRecordingIOS:   false,
      interruptionModeIOS:  InterruptionModeIOS.DuckOthers,
      playsInSilentModeIOS: true,

      shouldDuckAndroid:          true,
      interruptionModeAndroid:    InterruptionModeAndroid.DuckOthers,
      playThroughEarpieceAndroid: true,
    })
  }

  @init()
  public async loadSounds() {
    const sounds = {} as SoundMap

    const promises: Promise<void>[] = []
    for (const [name, source] of objectEntries(soundSourceMap)) {
      promises.push(
        Audio.Sound.createAsync(source).then(({sound}) => { sounds[name] = sound })      
      )
    }

    await Promise.all(promises)
    runInAction(() => {
      this.sounds = sounds
    })
  }

  @observable
  public sounds: SoundMap | null = null

  public sound(name: keyof SoundMap) {
    return this.sounds?.[name] ?? null
  }

}

const soundSourceMap = {
  alien: require('%audio/alien.mp3'),
}

export type SoundMap = {
  [Name in keyof typeof soundSourceMap]: Audio.Sound
}