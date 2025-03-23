<template>
  <div class="p-4 bg-yellow-600">
    <h2 class="text-red-700 text-4xl bg-gray-300">Task Board</h2>
    <task-list></task-list> 
  </div>
</template>

<script>
import TaskList from './TaskList.vue';

export default {
  components: { TaskList }
};
</script>

