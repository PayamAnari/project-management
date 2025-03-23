<template>
  <div 
      class="bg-white p-3 mb-2 rounded shadow cursor-pointer hover:shadow-md transition-shadow"
      @click="$emit('click')"
  >
      <h3 class="font-medium text-gray-800">{{ task.title }}</h3>
      
      <div class="mt-2 flex justify-between items-center">
          <div class="text-sm text-gray-500">
              <span v-if="task.due_date">Due: {{ formatDate(task.due_date) }}</span>
              <span v-else>No due date</span>
          </div>
          
          <div>
              <span 
                  class="px-2 py-1 text-xs rounded font-medium"
                  :class="{
                      'bg-blue-100 text-blue-800': task.status === 'pending',
                      'bg-yellow-100 text-yellow-800': task.status === 'in_progress',
                      'bg-green-100 text-green-800': task.status === 'completed'
                  }"
              >
                  {{ formatStatus(task.status) }}
              </span>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  props: {
      task: {
          type: Object,
          required: true
      }
  },
  methods: {
      formatDate(dateString) {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toLocaleDateString();
      },
      formatStatus(status) {
          switch(status) {
              case 'pending': return 'Pending';
              case 'in_progress': return 'In Progress';
              case 'completed': return 'Completed';
              default: return status;
          }
      }
  }
};
</script>