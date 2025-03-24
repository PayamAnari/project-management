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
          </div>

          <comment-section
              :comments="comments"
              @add-comment="$emit('add-comment', 'newComment')"
              :new-comment="newComment"
              @update-comment="$emit('update-comment', $event)" />
      </div>
  </div>
</template>

<script>
import CommentSection from '../comments/CommentSection.vue';

export default {
  components: {
      CommentSection
  },
  props: {
      show: Boolean,
      task: Object,
      comments: Array,
      newComment: String
  },
  methods: {
      formatDate(dateString) {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toLocaleDateString();
      }
  }
};
</script>