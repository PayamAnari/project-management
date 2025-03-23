<template>
    <div class="p-4 bg-gray-600">
      <h3 class="text-blue-600 font-bold">Task List</h3>
      <ul>
        <li v-for="task in tasks" :key="task.id">
          {{ task.name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tasks: [
          { id: 1, name: "Task 1" },
          { id: 2, name: "Task 2" },
          { id: 3, name: "Task 3" }
        ]
      };
    }
  };
  </script>
  