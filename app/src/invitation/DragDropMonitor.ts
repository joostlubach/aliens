import { action, computed, makeObservable, observable } from 'mobx'
import { LayoutRectangle } from 'react-native'
import { Point, Size } from 'ytil'

export class DragDropMonitor {

  constructor() {
    makeObservable(this)
  }

  // #region Properties

  @observable
  public draggedWord: string | null = null

  @observable
  public draggableLayout: LayoutRectangle | null = null

  @observable
  public topLeftOffset: Size = {width: 0,height: 0}

  @observable
  public dragPoint: Point | null = null

  @observable
  private currentDropZone: DropZone | null = null

  @computed
  public get currentCenter() {
    if (this.dragPoint == null) { return null }
    return {
      x: this.dragPoint.x - this.topLeftOffset.width,
      y: this.dragPoint.y - this.topLeftOffset.height,
    }
  }

  @computed
  public get currentLayout() {
    if (this.dragPoint == null) { return null }
    if (this.draggableLayout == null) { return null }

    return {
      left:   this.dragPoint.x - this.topLeftOffset.width,
      top:    this.dragPoint.y - this.topLeftOffset.height,
      width:  this.draggableLayout.width,
      height: this.draggableLayout.height,
    }
  }

  @computed
  public get isDragging() {
    return this.draggedWord != null
  }

  // #endregion

  // #region DropZones

  private dropZones = new Map<string, DropZone>()

  public registerDropZone(name: string, layout: LayoutRectangle, handlers: Omit<DropZone, 'name' | 'layout'>) {
    this.dropZones.set(name, {
      name,
      layout,
      ...handlers,
    })
  }

  public unregisterDropZone(name: string) {
    this.dropZones.delete(name)
  }

  private updateDropZone() {
    if (this.draggedWord == null) { return }

    const dropZone = this.queryDropZone()
    if (dropZone === this.currentDropZone) { return }

    this.currentDropZone?.onLeave?.(this.draggedWord)
    this.currentDropZone = dropZone
    this.currentDropZone?.onEnter?.(this.draggedWord)
  }

  private queryDropZone() {
    if (this.currentCenter == null) { return null }

    for (const dropZone of this.dropZones.values()) {
      if (this.currentCenter.x < dropZone.layout.x) { continue }
      if (this.currentCenter.y < dropZone.layout.y) { continue }
      if (this.currentCenter.x > dropZone.layout.x + dropZone.layout.width) { continue }
      if (this.currentCenter.y > dropZone.layout.y + dropZone.layout.height) { continue }
      return dropZone
    }

    return null
  }

  // #endregion

  // #region Drag interface

  @action
  public startDrag(word: string, draggableLayout: LayoutRectangle, startPoint: Point) {
    this.draggedWord = word
    this.topLeftOffset = {
      width:  startPoint.x - draggableLayout.x,
      height: startPoint.y - draggableLayout.y,
    }
    this.dragPoint = startPoint
    this.draggableLayout = draggableLayout
  }

  @action
  public drag(point: Point) {
    if (!this.isDragging) { return }
    this.dragPoint = point
  
    this.updateDropZone()
    this.currentDropZone?.onHover?.(this.draggedWord!, {
      x: point.x - this.currentDropZone.layout.x,
      y: point.y - this.currentDropZone.layout.y,
    })
  }

  @action
  public endDrag() {
    if (this.dragPoint == null) { return }
    if (this.draggedWord == null) { return }

    const current = this.queryDropZone()
    for (const dropZone of this.dropZones.values()) {
      if (dropZone === current) {
        dropZone.onDrop?.(this.draggedWord, {
          x: this.dragPoint.x - current.layout.x,
          y: this.dragPoint.y - current.layout.y,
        })
      } else {
        dropZone.onDropOutside?.(this.draggedWord)
      }
    }

    this.draggedWord = null
    this.topLeftOffset = {width: 0, height: 0}
    this.dragPoint = null
  }

  // #endregion

}

interface DropZone {
  name:           string
  layout:         LayoutRectangle
  onEnter?:       (word: string) => void
  onLeave?:       (word: string) => void
  onHover?:       (word: string, point: Point) => void
  onDrop?:        (word: string, point: Point) => void
  onDropOutside?: (word: string) => void
}