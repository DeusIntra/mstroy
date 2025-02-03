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
    return this._items.find(x => x.id === id || x.id.toString() === id.toString())
  }

  getChildren(id: Id) {
    return this._items.filter(x => x.parent && (x.parent === id || x.parent.toString() === id.toString()))
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
    if (!parent) throw new Error(`getAllParents: Не удалось найти элемент с id ${id}`)
    while (parent) {
      result.push(parent)
      if (parent.parent === null) break
      parent = this.getItem(parent.parent)
    }
    return result
  }

  addItem(item: TreeStoreItem) {
    if (item.parent && this.getItem(item.parent) === undefined)
      throw new Error(`addItem: Родительского элемента с id ${item.parent} не существует`)
    if (this._items.findIndex(x => x.id === item.id) !== -1)
      throw new Error(`addItem: Элемент с id ${item.id} уже существует`)
    this._items.push(item)
  }

  removeItem(id: Id) {
    const index = this._items.findIndex(x => x.id === id)
    if (index === -1) throw new Error(`removeItem: Не удалось найти элемент с id ${id}`)
    const children = this.getChildren(id)
    this._items.splice(index, 1)
    children.forEach(child => {
      const childIndex = this._items.findIndex(x => x.id === child.id)
      this._items.splice(childIndex, 1)
    })
  }

  updateItem(item: TreeStoreItem) {
    const index = this._items.findIndex(x => x.id === item.id)
    if (index === -1) throw new Error(`updateItem: Не удалось найти элемент с id ${item.id}`)
    if (item.parent && this.getItem(item.parent) === undefined)
      throw new Error(`updateItem: Не удалось найти родительский элемент с id ${item.parent}`)
    this._items[index] = item
  }
}
