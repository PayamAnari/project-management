<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6" v-if="project">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Tasks for {{ project.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ tasks.length }} tasks</p>
        </div>
        <button
          @click="$emit('open-task-modal')"
          class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      <draggable
        v-model="localTasks"
        group="tasks"
        item-key="id"
        @end="onDragEnd"
        handle=".drag-handle"
        class="space-y-3"
      >
        <template #item="{element}">
          <div class="group relative p-4 bg-white dark:bg-gray-700 rounded-lg shadow-xs border border-gray-100 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-400 transition-all duration-200">
            <!-- Drag handle -->
            <div class="drag-handle absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
              </svg>
            </div>

            <!-- Task Info -->
            <div class="pl-8 pr-8">
              <div class="flex justify-between items-start">
                <h4
                  @click.stop="$emit('task-selected', element)"
                  class="font-medium text-gray-800 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {{ element.title }}
                </h4>
                <div class="relative" @click.stop>
                  <button
                    @click="toggleStatusDropdown(element.id)"
                    :class="getTaskStatusClass(element.status)"
                    class="px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center cursor-pointer"
                  >
                    <span :class="getStatusDotClass(element.status)" class="w-2 h-2 rounded-full mr-1.5"></span>
                    {{ formatTaskStatus(element.status) }}
                  </button>

                  <!-- Status Dropdown -->
                  <div
                    v-if="activeStatusDropdown === element.id"
                    class="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600"
                    v-click-outside="closeStatusDropdown"
                  >
                    <div class="py-1">
                      <button
                        @click="updateTaskStatus(element, 'to_do')"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <span class="w-2 h-2 rounded-full bg-red-500 inline-block mr-2"></span>
                        To Do
                      </button>
                      <button
                        @click="updateTaskStatus(element, 'in_progress')"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <span class="w-2 h-2 rounded-full bg-yellow-500 inline-block mr-2"></span>
                        In Progress
                      </button>
                      <button
                        @click="updateTaskStatus(element, 'under_review')"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <span class="w-2 h-2 rounded-full bg-purple-500 inline-block mr-2"></span>
                        Under Review
                      </button>
                      <button
                        @click="updateTaskStatus(element, 'completed')"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <span class="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>
                        Completed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                @click.stop="$emit('task-selected', element)"
                class="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
              >
                <svg v-if="element.due_date" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span v-if="element.due_date">{{ formatDate(element.due_date) }}</span>
              </div>
            </div>

            <!-- Delete Button -->
            <button
              @click.stop="confirmDelete(element)"
              class="absolute top-3 right-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1"
              title="Delete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </template>
      </draggable>

      <div v-if="tasks.length === 0" class="p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h4 class="mt-3 text-lg font-medium text-gray-500 dark:text-gray-400">No tasks yet</h4>
        <p class="mt-1 text-gray-400 dark:text-gray-500">Get started by creating your first task</p>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6" v-else>
      <div class="text-center p-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h4 class="mt-4 text-lg font-medium text-gray-500 dark:text-gray-400">Select a project</h4>
        <p class="mt-1 text-gray-400 dark:text-gray-500">Choose a project to view its tasks</p>
      </div>
    </div>
  </template>

  <script>
  import draggable from 'vuedraggable';
  import vClickOutside from 'v-click-outside';
  import axios from 'axios';

  export default {
    components: { draggable },
    directives: {
      clickOutside: vClickOutside.directive
    },
    props: {
      project: Object,
      tasks: Array,
      showNotification: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        localTasks: this.tasks,
        activeStatusDropdown: null,
      };
    },
    watch: {
      tasks(newVal) {
        this.localTasks = newVal;
      }
    },
    methods: {
      onDragEnd() {
        this.$emit('task-reordered', this.localTasks);
      },
      getTaskStatusClass(status) {
        return {
          'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300': status === 'to_do',
          'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300': status === 'in_progress',
          'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300': status === 'under_review',
          'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300': status === 'completed'
        };
      },
      getStatusDotClass(status) {
        return {
          'bg-red-500': status === 'to_do',
          'bg-yellow-500': status === 'in_progress',
          'bg-purple-500': status === 'under_review',
          'bg-green-500': status === 'completed'
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
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
      confirmDelete(task) {
        if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
          this.$emit('delete-task', task.id);
        }
      },
      toggleStatusDropdown(taskId) {
        this.activeStatusDropdown = this.activeStatusDropdown === taskId ? null : taskId;
      },
      closeStatusDropdown() {
        this.activeStatusDropdown = null;
      },
      async updateTaskStatus(task, newStatus) {
        try {
          const originalStatus = task.status;
          task.status = newStatus;

          const taskData = {
            title: task.title || '',
            description: task.description || '',
            project_id: this.project.id,
            status: task.status,
            priority: task.priority || 0,
            due_date: task.due_date || null
          };

          await axios.put(`/api/tasks/${task.id}`, taskData, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
          });

          const index = this.localTasks.findIndex(t => t.id === task.id);
          if (index !== -1) {
            this.localTasks[index].status = newStatus;
          }
          this.$emit('update:tasks', this.localTasks);
          this.closeStatusDropdown();

          this.showNotification('Success', 'Task status updated', 'success');
        } catch (error) {
          console.error('Error updating task status:', error);
          task.status = originalStatus;
          this.showNotification('Error', 'Failed to update task status', 'error');
        }
      }
    }
  };
  </script>

  <style scoped>
  .drag-handle {
    cursor: grab;
  }
  .drag-handle:active {
    cursor: grabbing;
  }
  </style>
