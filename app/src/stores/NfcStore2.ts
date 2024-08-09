import Logger from 'logger'
import { deinit, init } from 'mobx-store'
import nfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager'

export class NFCStore {

  private logger = new Logger('NFCStore')

  @init()
  public async initNfc() {
    try {
      await nfcManager.start()
    } catch (error) {
      conso
    }

    nfcManager.setEventListener(NfcEvents.SessionClosed, this.handleSessionClosed)
    nfcManager.setEventListener(NfcEvents.StateChanged, this.handleStateChanged)
  }

  @deinit()
  public async deinitNfc() {
    // await nfcManager.cancelTechnologyRequest()
  }

  private handleSessionClosed = () => {
    console.log('session closed')
  }

  private handleStateChanged = (event: {state: string}) => {
    console.log('state', event)
  }

  public async detect(): Promise<string | null> {
    try {
      const supported = await nfcManager.isSupported()
      const enabled = await nfcManager.isEnabled()
      console.log({supported, enabled})

      await nfcManager.requestTechnology(NfcTech.Ndef)

      const tag = await nfcManager.getTag()
      return tag?.id ?? null
    } finally {
      await nfcManager.cancelTechnologyRequest().catch(() => {/**/})
    }

  }


}