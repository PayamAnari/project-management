<template>
    <div v-if="show && task" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">{{ task.title }}</h3>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <!-- Task Details -->
        <div class="mb-4">
          <div class="text-sm font-semibold text-gray-500 mb-1">Description</div>
          <p class="text-gray-700">{{ task.description || "No description provided." }}</p>
        </div>
  
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div class="text-sm font-semibold text-gray-500 mb-1">Status</div>
            <select v-model="task.status" class="w-full border rounded p-2" @change="$emit('update-task-status', task)">
              <option value="to_do">To Do</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <div class="text-sm font-semibold text-gray-500 mb-1">Due Date</div>
            <div class="text-gray-700">{{ task.due_date ? formatDate(task.due_date) : "No due date" }}</div>
          </div>
          
          <div>
            <div class="text-sm font-semibold text-gray-500 mb-1">Assigned To</div>
            <div class="text-gray-700">{{ task.user ? task.user.name : "Unassigned" }}</div>
          </div>
          <div>
            <div class="text-sm font-semibold text-gray-500 mb-1">Project</div>
            <div class="text-gray-700">{{ task.project ? task.project.name : "No project" }}</div>
          </div>
          
        </div>
  
        <!-- Attachments -->
        <div class="mb-4">
          <div class="text-sm font-semibold text-gray-500 mb-1">Attachments</div>
          <ul v-if="task.attachments && task.attachments.length > 0" class="list-disc pl-5">
            <li v-for="attachment in task.attachments" :key="attachment.id" class="text-gray-700">
              <a
                href="#"
                @click.prevent="downloadAttachment(attachment.id, attachment.original_name)"
                class="text-blue-500 hover:underline cursor-pointer"
              >
                {{ attachment.original_name }}
              </a> ({{ formatFileSize(attachment.size) }})
            </li>
          </ul>
          <p v-else class="text-gray-700">No attachments available.</p>
        </div>
  
        <!-- Comments -->
        <comment-section
          :comments="comments"
          :new-comment="newComment"
          @add-comment="$emit('add-comment')"
          @update-comment="$emit('update-comment', $event)"
          @delete-comment="$emit('delete-comment', $event)"
          :current-user="user"
        />
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
        const date = new Date(dateString);
        return date.toLocaleDateString();
      },
      formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString();
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