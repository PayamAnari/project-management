<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-6 py-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <!-- Logo/Branding -->
          <div class="mb-4 md:mb-0">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Project Management</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">Manage your projects and tasks efficiently</p>
          </div>

          <!-- Auth Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 items-center">
            <template v-if="!isAuthenticated">
              <button
                @click="showLoginModal = true"
                class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </button>
              <button
                @click="showSignupModal = true"
                class="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Sign Up
              </button>
            </template>
            <template v-else>
              <div class="flex items-center space-x-4">
                <div class="hidden sm:flex items-center">
                  <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium text-sm">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <span class="ml-2 text-gray-700 dark:text-gray-300 font-medium">Welcome, {{ user.name }}</span>
                </div>
                <button
                  @click="logout"
                  class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-lg transition-all duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-8">
      <!-- Login Modal -->
      <LoginModal
        :show="showLoginModal"
        @close="showLoginModal = false"
        @login-success="handleLoginSuccess"
      />

      <!-- Signup Modal -->
      <SignupModal
        :show="showSignupModal"
        @close="showSignupModal = false"
        @signup-success="handleSignupSuccess"
      />

      <!-- Project and Task Layout -->
      <div v-if="isAuthenticated" class="flex flex-col lg:flex-row gap-6">
        <!-- Projects Column -->
        <div class="w-full lg:w-1/3">
          <ProjectList
            :projects="projects"
            :selected-project="selectedProject"
            @delete-project="handleDeleteProject"
            @project-selected="selectProject"
            @open-project-modal="showProjectModal = true"
          />
        </div>

        <!-- Tasks Column -->
        <div class="w-full lg:w-2/3">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <TaskList
              :project="selectedProject"
              :tasks="tasks"
              @update:tasks="tasks = $event"
              @task-selected="selectTask"
              @open-task-modal="openTaskModal"
              @delete-task="handleDeleteTask"
              @task-reordered="onTaskReorder"
              :show-notification="showNotification"
            />
          </div>
        </div>
      </div>

      <!-- Empty State for Unauthenticated Users -->
      <div v-else class="text-center py-12">
        <div class="max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 class="mt-4 text-xl font-medium text-gray-800 dark:text-gray-200">Please log in to manage your projects</h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Sign in or create an account to get started</p>
          <div class="mt-6 flex justify-center gap-3">
            <button
              @click="showLoginModal = true"
              class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              Login
            </button>
            <button
              @click="showSignupModal = true"
              class="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <ProjectModal
        :show="showProjectModal"
        :project="newProject"
        @close="showProjectModal = false"
        @create-project="createProject"
      />

      <TaskModal
        :show="showTaskModal"
        :task="newTask"
        :available-users="availableUsers"
        @close="showTaskModal = false"
        @create-task="createTask"
        @file-upload="handleFileUpload"
      />

      <TaskDetail
        :show="showTaskDetailModal"
        :task="selectedTask"
        :comments="comments"
        :new-comment="newComment"
        :user="user"
        :show-notification="showNotification"
        @close="closeTaskDetail"
        @update-task-status="updateTaskStatus"
        @add-comment="addComment"
        @update-comment="newComment = $event"
        @delete-comment="handleDeleteComment"
        @delete-attachment="handleDeleteAttachment"
      />

      <Notification
        :notifications="notifications"
        @remove-notification="removeNotification"
      />
    </main>
  </div>
</template>

<script>
import ProjectList from './projects/ProjectList.vue';
import ProjectModal from './projects/ProjectModal.vue';
import TaskList from './tasks/TaskList.vue';
import TaskModal from './tasks/TaskModal.vue';
import TaskDetail from './tasks/TaskDetail.vue';
import Notification from './shared/Notification.vue';
import LoginModal from './auth/LoginModal.vue';
import SignupModal from './auth/SignupModal.vue';
import axios from 'axios';

export default {
  components: {
    ProjectList,
    ProjectModal,
    TaskList,
    TaskModal,
    TaskDetail,
    Notification,
    LoginModal,
    SignupModal
  },
  data() {
    return {
      showLoginModal: false,
      showSignupModal: false,
      isAuthenticated: false,
      user: { name: '' },
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
        attachments: [],
        assigned_user_id: ''
      },
      newComment: '',
      notifications: []
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
        const response = await axios.get('/api/user', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
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
      this.showNotification('Success', 'You have been logged in', 'success');
    },
    logout() {
      localStorage.removeItem('authToken');
      this.isAuthenticated = false;
      this.user = { name: '' };
      this.projects = [];
      this.tasks = [];
      this.comments = [];
      this.selectedProject = null;
      this.selectedTask = null;
      this.showTaskModal = false;
      this.showProjectModal = false;
      this.showTaskDetailModal = false;
      this.showNotification('Success', 'You have been logged out', 'success');
    },
    async fetchUsers() {
      try {
        const response = await axios.get('/api/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        this.availableUsers = response.data;
      } catch (error) {
        this.showNotification('Error', 'Failed to load users', 'error');
        console.error('Error fetching users:', error);
      }
    },
    async openTaskModal() {
      this.newTask = {
        title: '',
        description: '',
        due_date: '',
        status: 'to_do',
        priority: 0,
        attachments: [],
        assigned_user_id: ''
      };
      await this.fetchUsers();
      this.showTaskModal = true;
    },
    handleFileUpload(files) {
      this.newTask.attachments = files;
    },
    async fetchProjects() {
      if (!this.isAuthenticated) {
        this.projects = [];
        return;
      }
      try {
        const response = await axios.get('/api/projects', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        this.projects = response.data;
      } catch (error) {
        this.showNotification('Error', 'Failed to load projects', 'error');
        console.error('Error fetching projects:', error);
      }
    },
    async handleDeleteProject(projectId) {
      try {
        await axios.delete(`/api/projects/${projectId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        this.projects = this.projects.filter(p => p.id !== projectId);
        if (this.selectedProject && this.selectedProject.id === projectId) {
          this.selectedProject = null;
          this.tasks = [];
        }
        this.showNotification('Success', 'Project deleted', 'success');
      } catch (error) {
        this.showNotification('Error', 'Failed to delete project', 'error');
        console.error('Error deleting project:', error);
      }
    },
    async fetchTasks(projectId) {
      try {
        const response = await axios.get(`/api/tasks?project_id=${projectId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        this.tasks = response.data;
      } catch (error) {
        this.showNotification('Error', 'Failed to load tasks', 'error');
        console.error('Error fetching tasks:', error);
      }
    },
    async fetchComments(taskId) {
      try {
        const response = await axios.get(`/api/comments?task_id=${taskId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
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
        const response = await axios.post('/api/projects', this.newProject, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        this.projects.push(response.data);
        this.showNotification('Success', 'Project created successfully', 'success');
        this.newProject = { name: '', description: '', due_date: '', status: 'not_started' };
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
        taskData.append('user_id', this.newTask.assigned_user_id || this.user.id);

        if (this.newTask.attachments && this.newTask.attachments.length > 0) {
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
        console.error('Error creating task:', error.response?.data || error);
      }
    },
    async addComment() {
      if (!this.newComment.trim()) return;
      try {
        const commentData = { content: this.newComment, task_id: this.selectedTask.id };
        const response = await axios.post('/api/comments', commentData, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        this.comments.unshift(response.data);
        this.newComment = '';
        this.showNotification('Success', 'Comment added', 'success');
      } catch (error) {
        this.showNotification('Error', 'Failed to add comment', 'error');
        console.error('Error adding comment:', error);
      }
    },
    async handleDeleteComment(commentId) {
      try {
        await axios.delete(`/api/comments/${commentId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        this.comments = this.comments.filter(c => c.id !== commentId);
        this.showNotification('Success', 'Comment deleted', 'success');
      } catch (error) {
        this.showNotification('Error', 'Failed to delete comment', 'error');
        console.error('Error deleting comment:', error);
      }
    },
    async updateTaskStatus() {
      try {
        const taskData = {
          title: this.selectedTask.title || '',
          description: this.selectedTask.description || '',
          project_id: this.selectedTask.project_id,
          status: this.selectedTask.status,
          priority: this.selectedTask.priority || 0,
          due_date: this.selectedTask.due_date || null
        };
        await axios.put(`/api/tasks/${this.selectedTask.id}`, taskData, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        const index = this.tasks.findIndex(t => t.id === this.selectedTask.id);
        if (index !== -1) {
          this.tasks[index].status = this.selectedTask.status;
        }
        this.showNotification('Success', 'Task status updated', 'success');
        this.showTaskDetailModal = false;
      } catch (error) {
        this.showNotification('Error', 'Failed to update task status', 'error');
        console.error('Error updating task status:', error);
      }
    },
    async handleDeleteTask(taskId) {
      try {
        await axios.delete(`/api/tasks/${taskId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        if (this.selectedTask && this.selectedTask.id === taskId) {
          this.selectedTask = null;
          this.showTaskDetailModal = false;
        }
        this.showNotification('Success', 'Task deleted', 'success');
      } catch (error) {
        this.showNotification('Error', 'Failed to delete task', 'error');
        console.error('Error deleting task:', error);
      }
    },
    async onTaskReorder() {
      const taskUpdates = this.tasks.map((task, index) => ({
        id: task.id,
        priority: index
      }));
      try {
        await axios.post('/api/tasks/update-priorities', { tasks: taskUpdates }, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        this.showNotification('Success', 'Task order updated', 'success');
      } catch (error) {
        this.showNotification('Error', 'Failed to update task order', 'error');
        console.error('Error updating task order:', error.response?.data || error);
      }
    },
    async handleDeleteAttachment(attachmentId) {
      try {
        await axios.delete(`/api/tasks/${taskId}/attachments/${attachmentId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        this.newTask.attachments = this.newTask.attachments.filter(a => a.id !== attachmentId);
        this.showNotification('Success', 'Attachment deleted', 'success');
      } catch (error) {
        this.showNotification('Error', 'Failed to delete attachment', 'error');
        console.error('Error deleting attachment:', error);
      }
    },
    setupRealTimeListeners() {
      if (window.Echo && this.user.id) {
        window.Echo.private(`App.Models.User.${this.user.id}`)
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
      }
    },
    showNotification(title, message, type) {
      this.notifications.push({ title, message, type });
      setTimeout(() => this.notifications.shift(), 5000);
    },
    removeNotification(index) {
      this.notifications.splice(index, 1);
    }
  }
};
</script>
