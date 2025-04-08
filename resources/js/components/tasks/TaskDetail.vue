<template>
    <div v-if="show && task" class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-4xl mx-4 border border-gray-200 dark:border-gray-700 transform transition-all duration-300">
        <div class="flex justify-between items-center mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white">{{ task.title }}</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Two-Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left Side: Task Details -->
          <div class="space-y-6">
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Title</div>
              <input
                v-model="task.title"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</div>
              <textarea
                v-model="task.description"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                rows="4"
                placeholder="Enter task description"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status</div>
                <select
                  v-model="task.status"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
                >
                  <option value="to_do" class="dark:bg-gray-700">To Do</option>
                  <option value="in_progress" class="dark:bg-gray-700">In Progress</option>
                  <option value="under_review" class="dark:bg-gray-700">Under Review</option>
                  <option value="completed" class="dark:bg-gray-700">Completed</option>
                </select>
              </div>

              <div>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Due Date</div>
                <input
                  v-model="task.due_date"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                />
              </div>

              <div>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Priority</div>
                <input
                  v-model.number="task.priority"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="Enter priority (e.g., 0-10)"
                />
              </div>

              <div>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Assigned To</div>
                <div class="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  {{ task.user ? task.user.name : "Unassigned" }}
                </div>
              </div>

              <div>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Project</div>
                <div class="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  {{ task.project ? task.project.name : "No project" }}
                </div>
              </div>
            </div>

            <!-- Attachments Section -->
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Attachments</div>

              <!-- Existing Attachments -->
              <div v-if="task.attachments && task.attachments.length > 0" class="space-y-2 mb-4">
                <div
                  v-for="attachment in task.attachments"
                  :key="attachment.id"
                  class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div class="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300 truncate max-w-xs">{{ attachment.original_name }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 ml-auto">{{ formatFileSize(attachment.size) }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(attachment.created_at) }}</span>
                    <button
                      @click.prevent="downloadAttachment(attachment.id, attachment.original_name)"
                      class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200 ml-4"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      @click.prevent="removeAttachment(attachment.id)"
                      class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center mb-4">
                No attachments available
              </div>

              <!-- Add New Attachments -->
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg cursor-pointer transition-all duration-200">
                  <div class="flex flex-col items-center justify-center pt-7">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                      Click to upload or drag and drop
                    </p>
                  </div>
                  <input
                    type="file"
                    @change="handleFileUpload"
                    multiple
                    class="opacity-0 absolute"
                  >
                </label>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Max file size: 10MB</p>

              <!-- Display New Selected Files -->
              <div v-if="newAttachments.length > 0" class="mt-4">
                <h4 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">New Attachments:</h4>
                <ul class="space-y-2">
                  <li
                    v-for="(file, index) in newAttachments"
                    :key="index"
                    class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    <span class="text-sm text-gray-700 dark:text-gray-200 truncate max-w-[80%]">
                      {{ file.name }} ({{ formatFileSize(file.size) }})
                    </span>
                    <button
                      @click="removeNewAttachment(index)"
                      class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Save Button -->
            <div class="flex justify-end">
              <button
                @click="updateTaskDetails"
                class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>

          <!-- Right Side: Comments -->
          <div class="space-y-6 max-h-[70vh] overflow-y-auto">
            <CommentSection
              :comments="comments"
              :new-comment="newComment"
              @add-comment="$emit('add-comment')"
              @update-comment="$emit('update-comment', $event)"
              @delete-comment="$emit('delete-comment', $event)"
              :current-user="user"
            />
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import CommentSection from '../comments/CommentSection.vue';
  import axios from 'axios';

  export default {
    components: { CommentSection },
    props: {
      show: Boolean,
      task: Object,
      comments: Array,
      newComment: String,
      user: Object,
      showNotification: Function
    },
    data() {
      return {
        newAttachments: []
      };
    },
    methods: {
      formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
      formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      },
      async downloadAttachment(attachmentId, originalName) {
        try {
          const response = await axios.get(`/api/attachments/${attachmentId}/download`, {
            responseType: 'blob',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
          });

          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', originalName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error downloading attachment:', error);
          this.showNotification('Error', 'Failed to download attachment', 'error');
        }
      },
      async removeAttachment(attachmentId) {
        try {
          await axios.delete(`/api/tasks/${this.task.id}/attachments/${attachmentId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
          });

          this.task.attachments = this.task.attachments.filter(a => a.id !== attachmentId);
          this.showNotification('Success', 'Attachment deleted', 'success');
        } catch (error) {
          this.showNotification('Error', 'Failed to delete attachment', 'error');
          console.error('Error deleting attachment:', error);
        }
      },
      handleFileUpload(event) {
        const files = Array.from(event.target.files);
        this.newAttachments = [...this.newAttachments, ...files];
        event.target.value = '';
      },
      removeNewAttachment(index) {
        this.newAttachments.splice(index, 1);
      },
      async updateTaskDetails() {
        try {
          const taskData = {
            title: this.task.title || '',
            description: this.task.description || '',
            project_id: this.task.project_id,
            status: this.task.status,
            priority: this.task.priority || 0,
            due_date: this.task.due_date || null
          };

          const taskResponse = await axios.put(`/api/tasks/${this.task.id}`, taskData, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
          });

          if (this.newAttachments.length > 0) {
            const formData = new FormData();
            this.newAttachments.forEach((file, index) => {
              formData.append(`attachments[${index}]`, file);
            });

            const attachmentResponse = await axios.post(`/api/tasks/${this.task.id}/attachments`, formData, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'multipart/form-data'
              }
            });

            this.task.attachments = [...this.task.attachments, ...attachmentResponse.data];
            this.newAttachments = [];
          }

          Object.assign(this.task, taskResponse.data);

          this.showNotification('Success', 'Task updated successfully', 'success');
          this.$emit('task-updated', this.task);
          this.$emit('close');
        } catch (error) {
          this.showNotification('Error', 'Failed to update task', 'error');
          console.error('Error updating task:', error.response?.data || error);
        }
      }
    }
  };
  </script>

  <style scoped>
  /* Custom scrollbar for comments */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  .dark ::-webkit-scrollbar-track {
    background: #374151;
  }
  .dark ::-webkit-scrollbar-thumb {
    background: #4b5563;
  }

  input[type="file"] {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  </style>
