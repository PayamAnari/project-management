<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-md col-span-2" v-if="project">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Tasks for {{ project.name }}</h3>
      <button @click="$emit('open-task-modal')" class="px-4 py-2 text-white bg-blue-500 hover:bg-gray-800 hover:text-white text-xs font-semibold shadow-md rounded-md">
        Add Task
      </button>
    </div>
    
    <draggable 
      :list="tasks"
      group="tasks" 
      @end="$emit('task-reordered')"
      item-key="id"
      class="space-y-2">
      <template #item="{element}">
        <div class="group relative p-3 bg-white rounded-md shadow-sm cursor-pointer hover:bg-blue-50">
          <!-- Task Info (clickable area) -->
          <div @click="$emit('task-selected', element)" class="pr-6">
            <div class="flex justify-between">
              <h4 class="font-medium">{{ element.title }}</h4>
              <div>
                <span 
                  :class="getTaskStatusClass(element.status)"
                  class="px-2 py-1 text-xs rounded-full">
                  {{ formatTaskStatus(element.status) }}
                </span>
              </div>
            </div>
            <div class="text-sm text-gray-500 mt-1">
              <span v-if="element.due_date">Due: {{ formatDate(element.due_date) }}</span>
            </div>
          </div>
          
          <!-- Delete Button (red X) -->
          <button @click.stop="confirmDelete(element)" 
                  class="absolute top-3 right-3 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </template>
    </draggable>
    
    <div v-if="tasks.length === 0" class="p-4 text-center text-gray-500">
      No tasks for this project yet.
    </div>
  </div>
  
  <div class="bg-gray-100 p-4 rounded-lg col-span-2" v-else>
    <div class="text-center text-gray-500 p-8">
      Select a project to view tasks
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable
  },
  props: {
    project: Object,
    tasks: Array
  },
  methods: {
    getTaskStatusClass(status) {
      return {
        'bg-red-100 text-red-800': status === 'to_do',
        'bg-yellow-100 text-yellow-800': status === 'in_progress',
        'bg-purple-100 text-purple-800': status === 'under_review',
        'bg-green-100 text-green-800': status === 'completed'
      };
    },
    formatTaskStatus(status) {
      switch (status) {
        case 'to_do': return 'To Do';
        case 'in_progress': return 'In Progress';
        case 'under_review': return 'Under Review';
        case 'completed': return 'Completed';
        default: return status;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    confirmDelete(task) {
      if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
        this.$emit('delete-task', task.id);
      }
    }
  }
};
</script>

<style scoped>
/* Smooth transition for the delete button */
.group:hover .group-hover\:opacity-100 {
  transition: opacity 0.2s ease-in-out;
}
</style>