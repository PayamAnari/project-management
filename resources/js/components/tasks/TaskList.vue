<template>
  <div class="bg-gray-100 p-6 rounded-lg shadow-md col-span-2 " v-if="project">
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
        <div 
          class="p-3 bg-white rounded-md shadow-sm cursor-pointer hover:bg-blue-50"
          @click="$emit('task-selected', element)">
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
    }
  }
};
</script>