<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3"
import { AllCommunityModule, type ColDef, type GetDataPath, type GridApi, type GridReadyEvent, ModuleRegistry, type ValueFormatterParams, type ValueGetterParams } from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';
import { ref, shallowRef } from "vue";
import { TreeStore } from "./models/TreeStore";
import type { TreeStoreItem } from "./models/TreeStoreItem";
import type { Id } from "./models/Id";
import GroupCellRenderer from "@/components/GoupCellRenderer.vue"


ModuleRegistry.registerModules([AllCommunityModule]);
ModuleRegistry.registerModules([TreeDataModule]);

const items = [
  { id: 'item 1', parent: null, label: 'hi 1' },
  { id: 'item 2', parent: 'item 1', label: 'hi 2' },
  { id: 'item 3', parent: 'item 1', label: 'hi 3' },
  { id: 'item 4', parent: 'item 2', label: 'hi 4' },
  { id: 'item 5', parent: 'item 2', label: 'hi 5' },
  { id: 'item 6', parent: 'item 3', label: 'hi 6' },
  { id: 'item 7', parent: 'item 3', label: 'hi 7' },
  { id: 'item 8', parent: 'item 4', label: 'hi 8' },
  { id: 'item 9', parent: 'item 8', label: 'hi 9' },
  { id: 'item 10', parent: 'item 9', label: 'hi 10' },
  { id: 'item 11', parent: 'item 9', label: 'hi 11' },
]

const tree = new TreeStore(items)
const newItem = ref<TreeStoreItem | undefined>(undefined)

const gridApi = shallowRef<GridApi | null>(null);
const colDefs = ref<ColDef[]>([
  {
    headerName: "№ п\\п",
    pinned: "left",
    valueFormatter: (params: ValueFormatterParams) => {
      return `${params.node!.rowIndex! + 1}`;
    },
  },
  {
    cellRenderer: GroupCellRenderer,
    valueGetter: (params: ValueGetterParams) => {
      return params.data.id
    },
  },
  { field: "label", headerName: "Наименование" }
])
const defaultColDef = ref<ColDef>({ flex: 1 })
const groupDefaultExpanded = ref(-1);
const getDataPath = ref<GetDataPath>((data: TreeStoreItem) => getPath(data.id))
const groupRowRendererParams = ref({ suppressCount: true, valueFormatter: () => "Группа" })
const autoGroupColumnDef = ref<ColDef>({
  headerName: "Категория",
  field: "id",
  cellRendererParams: {
    suppressCount: true,
  },
  valueGetter: (params) => {
    if (params.data && tree.getChildren(params.data.id).length) return "Группа"
    return "Элемент"
  }
})


function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
}

function getPath(id: Id) {
  return tree.getAllParents(id).map(x => x.id).reverse()
}

// function removeItem(id: Id) {
//   tree.removeItem(id)
// }
//
// function updateItem(item: TreeStoreItem) {
//   tree.updateItem(item)
// }

function addItem(item: TreeStoreItem | undefined) {
  if (!item) return
  tree.addItem(item)
}

</script>

<template>
  <div>
    <ag-grid-vue @grid-ready="onGridReady" :column-defs="colDefs" :default-col-def="defaultColDef"
              :row-data="tree.getAll()" :tree-data="true" :group-default-expanded="groupDefaultExpanded"
              group-display-type="singleColumn" :get-data-path="getDataPath" :groupRowRendererParams="groupRowRendererParams"
              :auto-group-column-def="autoGroupColumnDef" style="height: 500px;min-width: 600px">
    </ag-grid-vue>
    <button @click="addItem(newItem)">Add</button>
  </div>
</template>
