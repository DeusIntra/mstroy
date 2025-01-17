import type { Id } from './Id'
import type { TreeStoreItem } from './TreeStoreItem'

export class TreeStore {

  private _items: TreeStoreItem[]

  constructor(items: TreeStoreItem[]) {
    this._items = items
  }

  getAll() {
    return [...this._items]
  }

  getItem(id: Id) {
    return this._items.find(x => x.id === id)
  }

  getChildren(id: Id) {
    return this._items.filter(x => x.parent === id)
  }

  getAllChildren(id: Id) {
    const children = this.getChildren(id)
    let result = children
    children.forEach(child => {
      result = result.concat(this.getAllChildren(child.id))
    })
    return result
  }

  getAllParents(id: Id) {
    const result: TreeStoreItem[] = []
    let parent = this.getItem(id)
    if (!parent) throw new Error(`Не удалось найти элемент с id ${id}`)
    while (parent) {
      result.push(parent)
      if (parent.parent === null) break
      parent = this.getItem(parent.parent)
    }
    return result
  }

  addItem(item: TreeStoreItem) {
    this._items.push(item)
  }

  removeItem(id: Id) {
    const index = this._items.findIndex(x => x.id === id)
    if (index === -1) throw new Error(`Не удалось найти элемент с id ${id}`)
    this._items.splice(index, 1)
  }

  updateItem(item: TreeStoreItem) {
    const index = this._items.findIndex(x => x.id === item.id)
    if (index === -1) throw new Error(`Не удалось найти элемент с id ${item.id}`)
    this._items[index] = item
  }
}
