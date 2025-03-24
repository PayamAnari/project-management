<template>
  <div class="mt-6">
      <h4 class="text-lg font-semibold mb-3">Comments</h4>

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

      <div class="space-y-3 max-h-60 overflow-y-auto">
          <div v-for="comment in comments" :key="comment.id" class="bg-gray-50 p-3 rounded">
              <div class="flex justify-between items-center mb-1">
                  <div class="font-medium">{{ comment.user.name }}</div>
                  <div class="text-xs text-gray-500">{{ formatDateTime(comment.created_at) }}</div>
              </div>
              <p class="text-gray-700">{{ comment.content }}</p>
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
      newComment: String
  },
  methods: {
      formatDateTime(dateTimeString) {
          if (!dateTimeString) return '';
          const date = new Date(dateTimeString);
          return date.toLocaleString();
      }
  }
};
</script>