import appJSON from '~/../app.json'
import { triggers } from './data'
import { Trigger } from './types'

export class QRParser {

  public get triggers() {
    return triggers
  }

  public parse(data: string): Trigger | null {
    const url = new URL(data)
    if (!this.isAppURL(url)) { return null }
    if (url.hostname !== 'trigger') { return null }

    const key = url.pathname.slice(1)
    return triggers.find(it => it.key === key) ?? null
  }

  private isAppURL(url: URL) {
    return url.protocol === `${appJSON.expo.scheme}:`
  }

}