import chroma, { Color } from 'chroma-js'
import { ViewStyle } from 'react-native'

export default class ShadowUtil {

  public depth(depth: number, overrides: Partial<Shadow> = {}): Shadow {
    const {
      offset  = {x: 0, y: depth},
      radius  = depth,
      color   = this.shadowColor,
      opacity = 0.2,
    } = overrides

    return new Shadow(depth, {offset, radius, color, opacity})
  }

  public shadowColor = chroma('black')

}

export class Shadow {

  constructor(public readonly depth: number, config: Partial<Shadow>) {
    Object.assign(this, config)
  }

  public readonly offset!:  {x: number, y: number}
  public readonly radius!:  number
  public readonly color!:   Color
  public readonly opacity!: number

  public flipVertical(): Shadow {
    return new Shadow(this.depth, {
      ...this,
      offset: {
        ...this.offset,
        y: -this.offset.y,
      },
    })
  }

  public flipHorizontal(): Shadow {
    return new Shadow(this.depth, {
      ...this,
      offset: {
        ...this.offset,
        x: -this.offset.x,
      },
    })
  }

  public toStyle(): ViewStyle {
    const style: ViewStyle = {
      shadowOffset:  {width: this.offset.x, height: this.offset.y},
      shadowRadius:  this.radius,
      shadowColor:   this.color.css(),
      shadowOpacity: this.opacity,
      elevation:     this.depth,
    }

    return style
  }

}