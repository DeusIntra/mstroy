<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps({
  params: { type: Object }
})

const root = ref(null)

function onUpdate() {
  props.params?.value.updateFunc(props.params.value.id)
}

function onRemove() {
  props.params?.value.removeFunc(props.params.value.id)
}

</script>

<template>
  <span ref="root">
    <button @click="onUpdate">edit</button>
    <button @click="onRemove">delete</button>
  </span>
</template>
