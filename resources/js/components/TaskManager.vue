<template>
    <div class="task-manager">
      <div class="bg-white  p-6">
        <div class="flex justify-between items-center mb-6">
            <div>
          <h2 class="text-2xl font-bold text-gray-800">Project Management</h2>
          <p class="text-gray-600">Manage your projects and tasks</p>
        </div>

        <div>
                   <!-- Show Login and Signup buttons if user is not logged in -->
          <template v-if="!isAuthenticated">
            <button @click="showLoginModal = true"  class="px-4 py-2 text-white bg-blue-500 hover:bg-gray-800 hover:text-white text-xs font-semibold mr-2  shadow-md rounded-md">
              Login
            </button>
            <button @click="showSignupModal = true" class="px-4 py-2 text-white bg-green-500 hover:bg-gray-800 hover:text-white text-xs font-semibold  shadow-md rounded-md">
              Sign Up
            </button>
          </template>
          <!-- Show Logout button if user is logged in -->
          <template v-else>
            <span class="mr-4 text-gray-700 font-semibold">Welcome, {{ user.name }}!</span>

            <button @click="logout" class="px-4 py-2 text-gray-900 bg-gray-200 hover:bg-gray-800 hover:text-white text-xs font-semibold  shadow-md rounded-md">
              Logout
            </button>
          </template>
        </div>
        </div>
              <!-- Login Modal -->

        <LoginModal :show="showLoginModal" @close="showLoginModal = false" @login-success="handleLoginSuccess" />     

            <!-- Signup Modal -->
        <SignupModal :show="showSignupModal" @close="showSignupModal = false" />


        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Project List -->
          <div class="bg-gray-100 p-4 shadow-md rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Projects</h3>
            <div class="space-y-2">
              <div v-for="project in projects" :key="project.id" 
                   @click="selectProject(project)"
                   class="p-3 bg-white rounded-md shadow-sm cursor-pointer hover:bg-blue-50"
                   :class="{'border-l-4 border-blue-500': selectedProject && selectedProject.id === project.id}">
                <h4 class="font-medium">{{ project.name }}</h4>
                <div class="text-sm text-gray-500">
                  <span :class="getStatusClass(project.status)">{{ formatStatus(project.status) }}</span>
                  <span v-if="project.due_date"> · Due: {{ formatDate(project.due_date) }}</span>
                </div>
              </div>
            </div>
            <button @click="showProjectModal = true" class="px-4 py-2 text-white bg-blue-500 hover:bg-gray-800 hover:text-white text-xs font-semibold  shadow-md rounded-md mt-3">
              Add Project
            </button>
          </div>
  
          <!-- Task List -->
          <div class="bg-gray-50 p-4 rounded-lg shadow-md col-span-2" v-if="selectedProject">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Tasks for {{ selectedProject.name }}</h3>
              <button @click="showTaskModal = true;" class="px-4 py-2 text-white bg-blue-500 hover:bg-gray-800 hover:text-white text-xs font-semibold  shadow-md rounded-md">
                Add Task
              </button>
            </div>
            
            <draggable 
              v-model="tasks" 
              group="tasks" 
              @end="onTaskReorder"
              item-key="id"
              class="space-y-2">
              <template #item="{element}">
                <div 
                  class="p-3 bg-white rounded-md shadow-sm cursor-pointer hover:bg-blue-50"
                  @click="selectTask(element)">
                  <div class="flex justify-between">
                    <h4 class="font-medium">{{ element.title }}</h4>
                    <div>
                      <span 
                        :class="getTaskStatusClass(element.status)"
                        class="px-2 py-1 text-xs rounded-full">
                        {{ formatTaskStatus(element.status) }}
                      </span>
                    </div>
                  </div>
                  <div class="text-sm text-gray-500 mt-1">
                    <span v-if="element.due_date">Due: {{ formatDate(element.due_date) }}</span>
                  </div>
                </div>
              </template>
            </draggable>
            
            <div v-if="tasks.length === 0" class="p-4 text-center text-gray-500">
              No tasks for this project yet.
            </div>
          </div>
          
          <div class="bg-gray-100 p-4 rounded-lg col-span-2" v-else>
            <div class="text-center text-gray-500 p-8">
              Select a project to view tasks
            </div>
          </div>
        </div>
      </div>
  
      <!-- Task Detail Modal -->
      <div v-if="showTaskDetailModal && selectedTask" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">{{ selectedTask.title }}</h3>
            <button @click="closeTaskDetail" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mb-4">
            <div class="text-sm font-semibold text-gray-500 mb-1">Description</div>
            <p class="text-gray-700">{{ selectedTask.description || "No description provided." }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div class="text-sm font-semibold text-gray-500 mb-1">Status</div>
              <select v-model="selectedTask.status" class="w-full border rounded p-2" @change="updateTaskStatus">
                <option value="to_do">To Do</option>
                <option value="under_review">Under Review</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-500 mb-1">Due Date</div>
              <div class="text-gray-700">{{ selectedTask.due_date ? formatDate(selectedTask.due_date) : "No due date" }}</div>
            </div>
          </div>
          
          <!-- Comments Section -->
          <div class="mt-6">
            <h4 class="text-lg font-semibold mb-3">Comments</h4>
            
            <div class="mb-4">
              <textarea 
                v-model="newComment" 
                placeholder="Add a comment..."
                class="w-full border rounded p-2"
                rows="3"></textarea>
              <button 
                @click="addComment" 
                class="px-4 py-2 text-white bg-blue-500 hover:bg-gray-800 hover:text-white text-xs font-semibold  shadow-md rounded-md mt-2">
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
        </div>
      </div>
  
      <!-- Project Modal -->
      <div v-if="showProjectModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">New Project</h3>
            <button @click="showProjectModal = false" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="createProject">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" v-model="newProject.name" class="w-full border rounded p-2" required>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="newProject.description" class="w-full border rounded p-2" rows="3"></textarea>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" v-model="newProject.due_date" class="w-full border rounded p-2">
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="newProject.status" class="w-full border rounded p-2" required>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div class="flex justify-end gap-2">
              <button type="button" @click="showProjectModal = false" class="px-4 py-2 text-white bg-gray-500 hover:bg-gray-800 hover:text-white text-xs font-semibold  shadow-md rounded-md">Cancel</button>
              <button type="submit" class="px-4 py-2 text-white bg-blue-500 hover:bg-gray-800 hover:text-white text-xs font-semibold  shadow-md rounded-md">Create Project</button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Task Modal -->
<div v-if="showTaskModal && selectedProject" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
  <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold">New Task</h3>
      <button @click="showTaskModal = false" class="text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
        <form @submit.prevent="createTask">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" v-model="newTask.title" class="w-full border rounded p-2" required>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="newTask.description" class="w-full border rounded p-2" rows="3"></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <input type="number" v-model="newTask.priority" class="w-full border rounded p-2" min="0">
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input type="date" v-model="newTask.due_date" class="w-full border rounded p-2">
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="newTask.status" class="w-full border rounded p-2" required>
              <option value="to_do">To Do</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

                    <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
            <select v-model="newTask.assigned_user_id" class="w-full border rounded p-2">
              <option value="">Unassigned</option>
              <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
            <input type="file" @change="handleFileUpload" multiple class="w-full border rounded p-2">
          </div>
          
          <div class="flex justify-end gap-2">
            <button type="button" @click="showTaskModal = false" class="px-4 py-2 text-white bg-gray-500 hover:bg-gray-800 hover:text-white text-xs font-semibold shadow-md rounded-md">Cancel</button>
            <button type="submit" class="px-4 py-2 text-white bg-blue-500 hover:bg-gray-800 hover:text-white text-xs font-semibold shadow-md rounded-md">Create Task</button>
          </div>
        </form>
      </div>
    </div>
      
      <!-- Notification Component -->
      <div class="fixed bottom-4 right-4 max-w-md w-full">
        <div v-for="(notification, index) in notifications" :key="index" 
             class="bg-white border-l-4 p-4 mb-2 shadow-md rounded-r"
             :class="getNotificationClass(notification.type)">
          <div class="flex justify-between">
            <div class="font-medium">{{ notification.title }}</div>
            <button @click="removeNotification(index)" class="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <div class="text-sm">{{ notification.message }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import draggable from 'vuedraggable';
import LoginModal from './LoginModal.vue';
import SignupModal from './SignupModal.vue';
import axios from 'axios';

export default {
  components: {
    draggable,
    LoginModal,
    SignupModal
  },
  data() {
    return {
      showLoginModal: false,
      showSignupModal: false,
      isAuthenticated: false,
      user: {
        name: ''
      },
      availableUsers: [],
      projects: [],
      tasks: [],
      comments: [],
      selectedProject: null,
      selectedTask: null,
      showProjectModal: false,
      showTaskModal: false,
      showTaskDetailModal: false,
      newProject: {
        name: '',
        description: '',
        due_date: '',
        status: 'not_started'
      },
      newTask: {
        title: '',
        description: '',
        due_date: '',
        status: 'to_do',
        priority: 0,
        attachments: []
      },
      newComment: '',
      notifications: [],
      isAuthenticated: false
    };
  },
  mounted() {
    this.checkAuth(); 
    this.fetchProjects();
    this.setupRealTimeListeners();
  },
  methods: {
    async checkAuth() {
      const token = localStorage.getItem('authToken');
      if (token) {
        this.isAuthenticated = true;
        await this.fetchUserDetails(); 
      } else {
        this.isAuthenticated = false;
      }
    },
    async fetchUserDetails() {
      try {
        const response = await axios.get('/api/user'); 
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    },
    handleLoginSuccess() {
      this.isAuthenticated = true;
      this.fetchUserDetails();
      this.fetchProjects();
      this.showLoginModal = false;
    },
    logout() {
      localStorage.removeItem('authToken'); 
      this.isAuthenticated = false; 
    },
    async fetchUsers() {
      try {
        const response = await axios.get('/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        this.availableUsers = response.data;
      } catch (error) {
        this.showNotification('Error', 'Failed to load users', 'error');
        console.error('Error fetching users:', error);
      }
   },
    closeTaskModal() {
      this.selectedTask = null; 
      this.isTaskModalOpen = false;
    },
    handleFileUpload(event) {
      this.newTask.attachments = Array.from(event.target.files);
    },
  
    async fetchProjects() {
      try {
        const response = await axios.get('/api/projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        this.projects = response.data;
      } catch (error) {
        this.showNotification('Error', 'Failed to load projects', 'error');
        console.error('Error fetching projects:', error);
      }
    },
    async fetchTasks(projectId) {
      try {
        const response = await axios.get(`/api/tasks?project_id=${projectId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        this.tasks = response.data;
      } catch (error) {
        this.showNotification('Error', 'Failed to load tasks', 'error');
        console.error('Error fetching tasks:', error);
      }
    },
    async fetchComments(taskId) {
      try {
        const response = await axios.get(`/api/comments?task_id=${taskId}`);
        this.comments = response.data;
      } catch (error) {
        this.showNotification('Error', 'Failed to load comments', 'error');
        console.error('Error fetching comments:', error);
      }
    },
    selectProject(project) {
      this.selectedProject = project;
      this.fetchTasks(project.id);
      this.selectedTask = null;
      this.showTaskDetailModal = false;
    },
    selectTask(task) {
      this.selectedTask = task;
      this.showTaskDetailModal = true;
      this.fetchComments(task.id);
    },
    closeTaskDetail() {
      this.showTaskDetailModal = false;
    },
    async createProject() {
      try {
        const response = await axios.post('/api/projects', this.newProject);
        this.projects.push(response.data);
        this.showNotification('Success', 'Project created successfully', 'success');
        
        // Reset form and close modal
        this.newProject = {
          name: '',
          description: '',
          due_date: '',
          status: 'not_started'
        };

        this.showProjectModal = false;
      } catch (error) {
        this.showNotification('Error', 'Failed to create project', 'error');
        console.error('Error creating project:', error);
      }
    },
    async createTask() {
  try {
    const taskData = new FormData();
    
    taskData.append('title', this.newTask.title);
    taskData.append('description', this.newTask.description);
    taskData.append('project_id', this.selectedProject.id);
    taskData.append('priority', this.newTask.priority);
    taskData.append('status', this.newTask.status);
    taskData.append('due_date', this.newTask.due_date);
    
    // Change assigned_user_id to user_id
    if (this.newTask.assigned_user_id) {
      taskData.append('user_id', this.newTask.assigned_user_id);
    } else {
      // Default to the current user if no assignment is made
      taskData.append('user_id', this.user.id);
    }
    
    // Add attachment files if any
    if (this.newTask.attachments.length > 0) {
      this.newTask.attachments.forEach((file, index) => {
        taskData.append(`attachments[${index}]`, file);
      });
    }
    
    const response = await axios.post('/api/tasks', taskData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    this.tasks.push(response.data);
    this.showNotification('Success', 'Task created successfully', 'success');
    
    // Reset form and close modal
    this.newTask = {
      title: '',
      description: '',
      due_date: '',
      status: 'to_do',
      priority: 0,
      attachments: [],
      assigned_user_id: '' 
    };
    this.showTaskModal = false;
  } catch (error) {
    this.showNotification('Error', 'Failed to create task', 'error');
    console.error('Error creating task:', error);
  }
},
    async addComment() {
      if (!this.newComment.trim()) return;
      
      try {
        const commentData = {
          content: this.newComment,
          task_id: this.selectedTask.id
        };
        
        const response = await axios.post('/api/comments', commentData);
        this.comments.unshift(response.data);
        this.newComment = '';
        this.showNotification('Success', 'Comment added', 'success');
      } catch (error) {
        this.showNotification('Error', 'Failed to add comment', 'error');
        console.error('Error adding comment:', error);
      }
    },
    async updateTaskStatus() {
      try {
        await axios.put(`/api/tasks/${this.selectedTask.id}`, {
          title: this.selectedTask.title || '',
          description: this.selectedTask.description || '',
          project_id: this.selectedTask.project_id,
          status: this.selectedTask.status,
          priority: this.selectedTask.priority || 0,
          due_date: this.selectedTask.due_date || null,
        });
        
        // Update the task in the tasks array
        const index = this.tasks.findIndex(t => t.id === this.selectedTask.id);
        if (index !== -1) {
          this.tasks[index].status = this.selectedTask.status;
        }
        
        this.showNotification('Success', 'Task status updated', 'success');

        this.closeTaskModal();

        
      } catch (error) {
        this.showNotification('Error', 'Failed to update task status', 'error');
        console.error('Error updating task status:', error);
      }
    },
    async onTaskReorder() {
  const taskUpdates = this.tasks.map((task, index) => ({
    id: task.id,
    priority: index
  }));

  try {
    await axios.post('/api/tasks/update-priorities', 
      { tasks: taskUpdates },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    this.showNotification('Success', 'Task order updated', 'success');
  } catch (error) {
    console.error('Full error:', error.response);
    this.showNotification('Error', 'Failed to update task order', 'error');
  }
},
    setupRealTimeListeners() {
      Echo.private(`App.Models.User.${window.userId}`)
        .listen('.task.created', (e) => {
          if (this.selectedProject && e.task.project_id === this.selectedProject.id) {
            this.tasks.push(e.task);
            this.showNotification('New Task', `A new task "${e.task.title}" has been added`, 'info');
          }
        })
        .listen('.comment.created', (e) => {
          if (this.selectedTask && e.comment.task_id === this.selectedTask.id) {
            this.comments.unshift(e.comment);
            this.showNotification('New Comment', `A new comment has been added`, 'info');
          }
        });
    },
    showNotification(title, message, type) {
      this.notifications.push({ title, message, type });
      setTimeout(() => {
        this.notifications.shift();
      }, 5000);
    },
    removeNotification(index) {
      this.notifications.splice(index, 1);
    },
    getStatusClass(status) {
      return {
        'text-red-500': status === 'not_started',
        'text-yellow-500': status === 'in_progress',
        'text-green-500': status === 'completed'
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
    getTaskStatusClass(status) {
      return {
        'bg-red-100 text-red-800': status === 'to_do',
        'bg-yellow-100 text-yellow-800': status === 'in_progress',
        'bg-purple-100 text-purple-800': status === 'under_review',
        'bg-green-100 text-green-800': status === 'completed'
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
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    formatDateTime(dateTimeString) {
      if (!dateTimeString) return '';
      const date = new Date(dateTimeString);
      return date.toLocaleString();
    },
    getNotificationClass(type) {
      return {
        'border-red-500': type === 'error',
        'border-green-500': type === 'success',
        'border-blue-500': type === 'info'
      };
    }
  }
};
</script>