<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-gray-800 dark:text-white">Projects</h3>
      <button
        @click="$emit('open-project-modal')"
        class="px-4 py-2 text-white bg-blue-600 shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-200 flex items-center"
        >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        Add Project
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-for="project in projects"
        :key="project.id"
        class="group relative p-4 bg-white dark:bg-gray-700 rounded-lg shadow-xs border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 cursor-pointer"
        :class="{'border-l-4 border-blue-500 dark:border-blue-400': selectedProject && selectedProject.id === project.id}"
      >
        <!-- Project Info (clickable area) -->
        <div @click="$emit('project-selected', project)" class="pr-8">
          <h4 class="font-medium text-gray-800 dark:text-gray-100">{{ project.name }}</h4>
          <div class="flex items-center mt-1 text-sm">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusClass(project.status)"
            >
              {{ formatStatus(project.status) }}
            </span>
            <span
              v-if="project.due_date"
              class="ml-2 text-gray-500 dark:text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(project.due_date) }}
            </span>
          </div>
        </div>

        <!-- Delete Button -->
        <button
          @click.stop="confirmDelete(project)"
          class="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div
        v-if="projects.length === 0"
        class="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="mt-2">No projects yet</p>
        <button
          @click="$emit('open-project-modal')"
          class="mt-3 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
        >
          Create your first project
        </button>
      </div>
    </div>
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
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': status === 'not_started',
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': status === 'in_progress',
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': status === 'completed'
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
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    confirmDelete(project) {
      if (confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
        this.$emit('delete-project', project.id);
      }
    }
  }
};
</script>

<style scoped>
/* Smooth transitions */
.group:hover .group-hover\:opacity-100 {
  transition: opacity 0.15s ease-in-out;
}

/* Custom scrollbar for project list */
.project-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
.project-list::-webkit-scrollbar {
  width: 6px;
}
.project-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.project-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}
.dark .project-list::-webkit-scrollbar-track {
  background: #374151;
}
.dark .project-list::-webkit-scrollbar-thumb {
  background: #4b5563;
}
</style>
