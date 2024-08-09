import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'
import { init } from 'mobx-store'

export class AudioStore {

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

}