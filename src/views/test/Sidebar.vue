<template>
  <div class="bg-gray-100 h-full p-4 overflow-auto">
    <h2 class="font-bold mb-4">实验列表</h2>
    <ul>
      <li
        v-for="doc in docs"
        :key="doc.id"
        :class="[
          'cursor-pointer p-2 rounded flex items-center',
          selectedId === doc.id ? 'bg-blue-200 font-bold' : 'hover:bg-gray-200'
        ]"
        @click="$emit('selectDoc', doc)"
      >
        <span class="truncate block w-full">{{ doc.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  docs: Array,
  selectedId: [Number, String]
});
</script>

<style scoped>
.sidebar-root {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-list {
  flex: 1;
  padding: 16px;
  overflow: auto;
}
</style>
