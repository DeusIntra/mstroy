import type { Id } from "./Id"

export type TreeStoreItem = {
  id: Id,
  parent: Id | null,
  label: string,
}
