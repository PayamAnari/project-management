<template>
  <div class="mt-8">
    <h4 class="text-xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Comments</h4>

    <!-- Comment input area -->
    <div class="mb-6">
      <textarea
        :value="newComment"
        @input="$emit('update-comment', $event.target.value)"
        placeholder="Write your comment here..."
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
        rows="4"
      ></textarea>
      <div class="flex justify-end mt-3">
        <button
          @click="$emit('add-comment')"
          class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg transition-colors duration-200 focus:outline-none"
          :disabled="!newComment"
          :class="{'opacity-50 cursor-not-allowed': !newComment}"
        >
          Post Comment
        </button>
      </div>
    </div>

    <!-- Comments list -->
    <div class="space-y-4 max-h-96 overflow-y-auto pr-2">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="relative p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
      >
        <!-- Comment header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                {{ comment.user.name.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div>
              <div class="font-medium text-gray-800 dark:text-gray-100">{{ comment.user.name }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatDateTime(comment.created_at) }}</div>
            </div>
          </div>

          <!-- Delete button - only visible on hover and if user has permission -->
          <button
            v-if="canDeleteComment(comment)"
            @click="confirmDelete(comment)"
            class="absolute top-4 right-4 p-1 rounded-full
                    text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600
                    opacity-0 group-hover:opacity-100
                    transition-all duration-200 ease-in-out"
            title="Delete comment"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <!-- Comment content -->
        <div class="pl-11">
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ comment.content }}</p>
        </div>
      </div>

      <div v-if="comments.length === 0" class="text-center py-1 text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="mt-2">No comments yet</p>
        <p class="text-sm mt-1">Be the first to share your thoughts!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comments: Array,
    newComment: String,
    currentUser: Object
  },
  methods: {
    formatDateTime(dateTimeString) {
      if (!dateTimeString) return '';
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateTimeString).toLocaleString(undefined, options);
    },
    canDeleteComment(comment) {
      return this.currentUser &&
             (this.currentUser.id === comment.user.id || this.currentUser.is_admin);
    },
    confirmDelete(comment) {
      if (confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
        this.$emit('delete-comment', comment.id);
      }
    }
  }
};
</script>

<style scoped>
/* Custom scrollbar */
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

/* Smooth transitions */
.group:hover .group-hover\:opacity-100 {
  transition: opacity 0.15s ease-in-out;
}
</style>
