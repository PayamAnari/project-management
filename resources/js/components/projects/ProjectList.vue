<template>
  <div class="bg-gray-100 p-4 shadow-md rounded-lg">
    <h3 class="text-lg font-semibold mb-4">Projects</h3>
    <div class="space-y-2">
      <div v-for="project in projects" :key="project.id" 
           class="group relative p-3 bg-white rounded-md shadow-sm cursor-pointer hover:bg-blue-50"
           :class="{'border-l-4 border-blue-500': selectedProject && selectedProject.id === project.id}">
        <!-- Project Info (clickable area) -->
        <div @click="$emit('project-selected', project)" class="pr-6">
          <h4 class="font-medium">{{ project.name }}</h4>
          <div class="text-sm text-gray-500">
            <span :class="getStatusClass(project.status)">{{ formatStatus(project.status) }}</span>
            <span v-if="project.due_date"> · Due: {{ formatDate(project.due_date) }}</span>
          </div>
        </div>
        
        <!-- Delete Button (red X) -->
        <button @click.stop="confirmDelete(project)" 
                class="absolute top-3 right-3 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    <button @click="$emit('open-project-modal')" 
            class="px-4 py-2 text-white bg-blue-500 hover:bg-gray-800 hover:text-white text-xs font-semibold shadow-md rounded-md mt-3">
      Add Project
    </button>
  </div>
</template>

<script>
export default {
  props: {
    projects: Array,
    selectedProject: Object
  },
  methods: {
    getStatusClass(status) {
      return {
        'text-red-500': status === 'not_started',
        'text-yellow-500': status === 'in_progress',
        'text-green-500': status === 'completed'
      };
    },
    formatStatus(status) {
      const statusMap = {
        'not_started': 'Not Started',
        'in_progress': 'In Progress',
        'completed': 'Completed'
      };
      return statusMap[status] || status;
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    confirmDelete(project) {
      if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
        this.$emit('delete-project', project.id);
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