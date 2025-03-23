<template>
  <div class="task-board">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gray-100 p-4 rounded-lg shadow">
              <h2 class="text-lg font-bold mb-4">Pending</h2>
              <draggable
                  v-model="pendingTasks"
                  class="min-h-[200px]"
                  group="tasks"
                  @change="handleDragChange"
              >
                  <task-card
                      v-for="task in pendingTasks"
                      :key="task.id"
                      :task="task"
                      @status-change="updateTaskStatus"
                      @click="openTaskDetails(task)"
                  ></task-card>
              </draggable>
          </div>

          <div class="bg-gray-100 p-4 rounded-lg shadow">
              <h2 class="text-lg font-bold mb-4">In Progress</h2>
              <draggable
                  v-model="inProgressTasks"
                  class="min-h-[200px]"
                  group="tasks"
                  @change="handleDragChange"
              >
                  <task-card
                      v-for="task in inProgressTasks"
                      :key="task.id"
                      :task="task"
                      @status-change="updateTaskStatus"
                      @click="openTaskDetails(task)"
                  ></task-card>
              </draggable>
          </div>

          <div class="bg-gray-100 p-4 rounded-lg shadow">
              <h2 class="text-lg font-bold mb-4">Completed</h2>
              <draggable
                  v-model="completedTasks"
                  class="min-h-[200px]"
                  group="tasks"
                  @change="handleDragChange"
              >
                  <task-card
                      v-for="task in completedTasks"
                      :key="task.id"
                      :task="task"
                      @status-change="updateTaskStatus"
                      @click="openTaskDetails(task)"
                  ></task-card>
              </draggable>
          </div>
      </div>

      <!-- Task Details Modal -->
      <div v-if="selectedTask" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
              <div class="flex justify-between mb-4">
                  <h2 class="text-xl font-bold">{{ selectedTask.title }}</h2>
                  <button @click="selectedTask = null" class="text-gray-500 hover:text-gray-700">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                  </button>
              </div>
              
              <div class="mb-4">
                  <p class="text-gray-700">{{ selectedTask.description }}</p>
                  
                  <div class="mt-4 flex items-center">
                      <span class="mr-2 font-semibold">Status:</span>
                      <select v-model="selectedTask.status" @change="updateTaskStatus(selectedTask)" class="border rounded p-1">
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                      </select>
                  </div>
                  
                  <div class="mt-2">
                      <span class="font-semibold">Due Date:</span>
                      <span>{{ formatDate(selectedTask.due_date) }}</span>
                  </div>
              </div>
              
              <h3 class="font-semibold mb-2">Comments</h3>
              <div class="mb-4 max-h-60 overflow-y-auto">
                  <div v-for="comment in comments" :key="comment.id" class="bg-gray-100 p-3 rounded mb-2">
                      <div class="flex justify-between">
                          <span class="font-medium">{{ comment.user.name }}</span>
                          <span class="text-sm text-gray-500">{{ formatDate(comment.created_at) }}</span>
                      </div>
                      <p class="mt-1">{{ comment.content }}</p>
                  </div>
                  
                  <p v-if="comments.length === 0" class="text-gray-500">No comments yet</p>
              </div>
              
              <div class="border-t pt-4">
                  <textarea
                      v-model="newComment"
                      class="w-full border rounded p-2 mb-2"
                      placeholder="Add a comment..."
                      rows="2"
                  ></textarea>
                  <button
                      @click="addComment"
                      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      :disabled="!newComment.trim()"
                  >
                      Add Comment
                  </button>
              </div>
          </div>
      </div>

      <!-- Notification -->
      <div
          v-if="notification"
          class="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded shadow-lg transition-opacity duration-300"
          :class="{ 'opacity-0': notificationFading }"
      >
          {{ notification }}
      </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';
import axios from 'axios';

export default {
  components: {
      draggable,
      TaskCard
  },
  props: {
      projectId: {
          type: Number,
          required: true
      }
  },
  setup(props) {
      const tasks = ref([]);
      const selectedTask = ref(null);
      const comments = ref([]);
      const newComment = ref('');
      const notification = ref('');
      const notificationFading = ref(false);
      
      // Echo channel for real-time updates
      let channel = null;
      
      const pendingTasks = computed(() => {
          return tasks.value.filter(task => task.status === 'pending')
              .sort((a, b) => a.priority - b.priority);
      });
      
      const inProgressTasks = computed(() => {
          return tasks.value.filter(task => task.status === 'in_progress')
              .sort((a, b) => a.priority - b.priority);
      });
      
      const completedTasks = computed(() => {
          return tasks.value.filter(task => task.status === 'completed')
              .sort((a, b) => a.priority - b.priority);
      });
      
      const fetchTasks = async () => {
          try {
              const response = await axios.get(`/api/tasks?project_id=${props.projectId}`);
              tasks.value = response.data;
          } catch (error) {
              console.error('Error fetching tasks:', error);
          }
      };
      
      const handleDragChange = (event) => {
          // If a task was moved between columns, update its status
          if (event.added) {
              const task = event.added.element;
              let newStatus = '';
              
              // Determine the new status based on which list it was added to
              if (pendingTasks.value.includes(task)) {
                  newStatus = 'pending';
              } else if (inProgressTasks.value.includes(task)) {
                  newStatus = 'in_progress';
              } else if (completedTasks.value.includes(task)) {
                  newStatus = 'completed';
              }
              
              if (newStatus && task.status !== newStatus) {
                  task.status = newStatus;
                  updateTask(task);
              }
          }
          
          // Update priorities for all tasks in the affected list
          updatePriorities();
      };
      
      const updatePriorities = async () => {
          try {
              // Create an array of all tasks with their new priorities
              const updatedTasks = [
                  ...pendingTasks.value.map((task, index) => ({ id: task.id, priority: index })),
                  ...inProgressTasks.value.map((task, index) => ({ id: task.id, priority: index })),
                  ...completedTasks.value.map((task, index) => ({ id: task.id, priority: index }))
              ];
              
              await axios.post('/api/tasks/update-priorities', { tasks: updatedTasks });
          } catch (error) {
              console.error('Error updating priorities:', error);
          }
      };
      
      const updateTaskStatus = async (task) => {
          try {
              await updateTask(task);
              fetchTasks(); // Refresh task list
          } catch (error) {
              console.error('Error updating task status:', error);
          }
      };
      
      const updateTask = async (task) => {
          try {
              await axios.put(`/api/tasks/${task.id}`, task);
          } catch (error) {
              console.error('Error updating task:', error);
          }
      };
      
      const openTaskDetails = async (task) => {
          selectedTask.value = { ...task };
          await fetchComments(task.id);
      };
      
      const fetchComments = async (taskId) => {
          try {
              const response = await axios.get(`/api/comments?task_id=${taskId}`);
              comments.value = response.data;
          } catch (error) {
              console.error('Error fetching comments:', error);
          }
      };
      
      const addComment = async () => {
          try {
              if (!newComment.value.trim()) return;
              
              const response = await axios.post('/api/comments', {
                  content: newComment.value,
                  task_id: selectedTask.value.id
              });
              
              comments.value.unshift(response.data);
              newComment.value = '';
          } catch (error) {
              console.error('Error adding comment:', error);
          }
      };
      
      const formatDate = (dateString) => {
          if (!dateString) return 'N/A';
          const date = new Date(dateString);
          return date.toLocaleDateString();
      };
      
      const showNotification = (message) => {
          notification.value = message;
          notificationFading.value = false;
          
          setTimeout(() => {
              notificationFading.value = true;
              
              setTimeout(() => {
                  notification.value = '';
                  notificationFading.value = false;
              }, 500);
          }, 3000);
      };
      
      onMounted(() => {
          fetchTasks();
          
          // Set up real-time updates
          channel = window.Echo.private(`project.${props.projectId}`)
              .listen('TaskUpdated', (event) => {
                  // Update the task in our local state
                  const index = tasks.value.findIndex(t => t.id === event.task.id);
                  
                  if (index !== -1) {
                      tasks.value[index] = event.task;
                      showNotification(`Task "${event.task.title}" has been updated`);
                      
                      // If this task is currently selected, update the selected task too
                      if (selectedTask.value && selectedTask.value.id === event.task.id) {
                          selectedTask.value = event.task;
                          fetchComments(event.task.id);
                      }
                  } else {
                      // Task might be new, refresh the whole list
                      fetchTasks();
                  }
              });
      });
      
      onUnmounted(() => {
          if (channel) {
              channel.stopListening('TaskUpdated');
          }
      });
      
      return {
          tasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
          selectedTask,
          comments,
          newComment,
          notification,
          notificationFading,
          handleDragChange,
          updateTaskStatus,
          openTaskDetails,
          addComment,
          formatDate
      };
  }
};
</script>