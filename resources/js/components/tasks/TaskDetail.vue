<template>
  <div v-if="show && task" class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 border border-gray-200 dark:border-gray-700 transform transition-all duration-300">
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

      <!-- Task Details -->
      <div class="space-y-6">
        <div>
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</div>
          <p class="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            {{ task.description || "No description provided." }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status</div>
            <select 
              v-model="task.status" 
              @change="$emit('update-task-status', task)"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
            >
              <option value="to_do" class="dark:bg-gray-700">To Do</option>
              <option value="under_review" class="dark:bg-gray-700">Under Review</option>
              <option value="in_progress" class="dark:bg-gray-700">In Progress</option>
              <option value="completed" class="dark:bg-gray-700">Completed</option>
            </select>
          </div>
          
          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Due Date</div>
            <div class="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              {{ task.due_date ? formatDate(task.due_date) : "No due date" }}
            </div>
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

        <!-- Attachments -->
        <div>
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Attachments</div>
          <div v-if="task.attachments && task.attachments.length > 0" class="space-y-2">
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
              <button 
                @click.prevent="downloadAttachment(attachment.id, attachment.original_name)"
                class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200 ml-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
          <div v-else class="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
            No attachments available
          </div>
        </div>

        <!-- Comments -->
        <CommentSection
          :comments="comments"
          :new-comment="newComment"
          @add-comment="$emit('add-comment')"
          @update-comment="$emit('update-comment', $event)"
          @delete-comment="$emit('delete-comment', $event)"
          :current-user="user"
          class="mt-6"
        />
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
    user: Object
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
        this.$emit('error', 'Failed to download attachment');
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
</style>