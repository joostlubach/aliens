import { observer as mobx_observer } from 'mobx-react'
import React from 'react'

export function observer<T extends React.ComponentType<any>>(name: string, Component: T): T {
  Object.assign(Component, {displayName: name})
  return mobx_observer(Component)
}
