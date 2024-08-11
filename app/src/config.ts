export interface Config {
  environment: 'development' | 'production'
}

export const config: Config = {
  environment: __DEV__ ? 'development' : 'production',
}