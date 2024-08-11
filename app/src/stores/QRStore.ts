import { Camera, PermissionResponse } from 'expo-camera'
import { computed, makeObservable, observable, runInAction } from 'mobx'
import { init } from 'mobx-store'
import { bindMethods } from 'ytil'

export class QRStore {

  constructor() {
    bindMethods(this)
    makeObservable(this)
  }

  // #region Permission

  @observable
  private permissionResponse: PermissionResponse | null = null

  @computed
  public get hasPermission() {
    return this.permissionResponse?.granted ?? null
  }

  @init()
  public async fetchPermission() {
    const response = await Camera.getCameraPermissionsAsync()
    if (response.status === 'undetermined') { return }

    runInAction(() => {
      this.permissionResponse = response
    })
  }
  
  public async ensurePermission() {
    let response = this.permissionResponse ?? await Camera.getCameraPermissionsAsync()
    if (!response.granted) {
      response = await Camera.requestCameraPermissionsAsync()
    }
    
    runInAction(() => {
      this.permissionResponse = response
    })
  }

  // #endregion


}