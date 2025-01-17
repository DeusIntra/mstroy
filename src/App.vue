<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3"
import { AllCommunityModule, type ColDef, type GetDataPath, type GridApi, type GridReadyEvent, ModuleRegistry, type ValueFormatterParams } from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';
import { ref, shallowRef } from "vue";
import { TreeStore } from "./models/TreeStore";
import type { TreeStoreItem } from "./models/TreeStoreItem";
import type { Id } from "./models/Id";

ModuleRegistry.registerModules([AllCommunityModule]);
ModuleRegistry.registerModules([TreeDataModule]);

const items = [
  { id: '1', parent: null, label: 'hi' },
  { id: '2', parent: '1', label: 'hi' },
  { id: '3', parent: '1', label: 'hi' },
  { id: '4', parent: '2', label: 'hi' },
  { id: '5', parent: '2', label: 'hi' },
  { id: '6', parent: '3', label: 'hi' },
  { id: '7', parent: '3', label: 'hi' },
  { id: '8', parent: '4', label: 'hi' },
  { id: '9', parent: '8', label: 'hi' },
  { id: '10', parent: '9', label: 'hi' },
  { id: '11', parent: '9', label: 'hi' },
]

const tree = new TreeStore(items)

const gridApi = shallowRef<GridApi | null>(null);
const colDefs = ref<ColDef[]>([
  {
    headerName: "№ п\\п",
    width: 50,
    valueFormatter: (params: ValueFormatterParams) => {
    console.log(params)
      return `${params.node!.rowIndex! + 1}`;
    },
  },
  {
    headerName: "Категория",
    valueGetter: (params) => {
      if (params.data && tree.getChildren(params.data.id).length) return "Группа"
      return "Элемент"
    }
  },
  { field: "label", headerName: "Наименование"  }
])
const defaultColDef = ref<ColDef>({ flex: 1 })
const groupDefaultExpanded = ref(-1);
const getDataPath = ref<GetDataPath>((data: TreeStoreItem) => getPath(data.id))


function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
}

function getPath(id: Id) {
  return tree.getAllParents(id).map(x => x.id).reverse()
}

</script>

<template>
  <ag-grid-vue @grid-ready="onGridReady" :column-defs="colDefs" :default-col-def="defaultColDef"
    :row-data="tree.getAll()" :tree-data="true" :group-default-expanded="groupDefaultExpanded" group-display-type="groupRows"
    :get-data-path="getDataPath" style="height: 500px;min-width: 600px">
  </ag-grid-vue>
</template>
