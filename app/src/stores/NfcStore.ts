import { deinit, init } from 'mobx-store'
import nfcManager, { NfcEvents, NfcTech, TagEvent } from 'react-native-nfc-manager'

export class NfcStore {

  @init()
  public async initNfc() {
    await nfcManager.start()

    nfcManager.setEventListener(NfcEvents.DiscoverTag, this.handleDiscoverTag)
    nfcManager.setEventListener(NfcEvents.SessionClosed, this.handleSessionClosed)
    nfcManager.setEventListener(NfcEvents.StateChanged, this.handleStateChanged)
  }

  @deinit()
  public async deinitNfc() {
    // await nfcManager.cancelTechnologyRequest()
  }

  private handleDiscoverTag = (event: TagEvent) => {
    console.log('tag', event)
  }

  private handleSessionClosed = () => {
    console.log('session closed')
  }

  private handleStateChanged = (event: {state: string}) => {
    console.log('state', event)
  }

  public async detect() {
    try {
      const supported = await nfcManager.isSupported()
      const enabled = await nfcManager.isEnabled()
      console.log({supported, enabled})

      await nfcManager.registerTagEvent()

      // const tech = await Promise.race([
      //   nfcManager.requestTechnology(NfcTech.Ndef),
      // ])
      // console.log(tech)
      // const tag = await nfcManager.getTag()
      // console.log(tag)
    } finally {
      // await nfcManager.cancelTechnologyRequest().catch(() => {/**/})
    }

  }


}