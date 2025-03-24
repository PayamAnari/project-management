<template>
    <div class="mt-6">
      <h4 class="text-lg font-semibold mb-3">Comments</h4>
  
      <!-- Comment input area (unchanged) -->
      <div class="mb-4">
        <textarea
          :value="newComment"
          @input="$emit('update-comment', $event.target.value)"
          placeholder="Add a comment..."
          class="w-full border rounded p-2"
          rows="3"></textarea>
        <button
          @click="$emit('add-comment')"
          class="px-4 py-2 text-white bg-blue-500 hover:bg-gray-800 hover:text-white text-xs font-semibold shadow-md rounded-md mt-2">
          Add Comment
        </button>
      </div>
  
      <!-- Comments list -->
      <div class="space-y-3 max-h-60 overflow-y-auto">
        <div 
          v-for="comment in comments" 
          :key="comment.id" 
          class="relative p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group">
          
          <!-- Comment content -->
          <div class="flex justify-between items-center mb-1">
            <div class="font-medium">{{ comment.user.name }}</div>
            <div class="text-xs text-gray-500">{{ formatDateTime(comment.created_at) }}</div>
          </div>
          <p class="text-gray-700 pr-6">{{ comment.content }}</p>
          
          <!-- Delete button - only visible on hover and if user has permission -->
          <button 
            v-if="canDeleteComment(comment)"
            @click="confirmDelete(comment)"
            class="absolute top-9 right-2 p-1 rounded-full 
                    text-red-500 hover:text-red-700 hover:bg-red-50
                    opacity-0 group-hover:opacity-100 
                    transition-all duration-200 ease-in-out">
            <svg xmlns="http://www.w200/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        </div>
  
        <div v-if="comments.length === 0" class="text-center text-gray-500 py-2">
          No comments yet.
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
        const date = new Date(dateTimeString);
        return date.toLocaleString();
      },
      canDeleteComment(comment) {
        return this.currentUser && 
               (this.currentUser.id === comment.user.id || this.currentUser.is_admin);
      },
      confirmDelete(comment) {
        if (confirm('Are you sure you want to delete this comment?')) {
          this.$emit('delete-comment', comment.id);
        }
      }
    }
  };
  </script>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1 !important;
}
</style>