<template>
  <div class="task-manager">
    <div class="bg-white p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-md font-bold text-gray-800 lg:text-2xl">Project Management</h2>
          <p class="text-sm text-gray-600 lg:text-md">Manage your projects and tasks</p>
        </div>
        <div class="flex flex-col gap-2 mt-4 lg:flex-row items-center">
          <template v-if="!isAuthenticated">
            <button @click="showLoginModal = true" class="px-4 py-2 text-white bg-blue-500 hover:bg-gray-800 hover:text-white text-xs font-semibold mr-2 shadow-md rounded-md">
              Login
            </button>
            <button @click="showSignupModal = true" class="px-4 py-2 text-white bg-green-500 hover:bg-gray-800 hover:text-white text-xs font-semibold shadow-md rounded-md">
              Sign Up
            </button>
          </template>
          <template v-else>
            <span class="text-gray-700 font-semibold lg:mr-4">Welcome, {{ user.name }}!</span>
            <button @click="logout" class="px-4 py-2 text-gray-900 bg-gray-200 hover:bg-gray-800 hover:text-white text-xs font-semibold shadow-md rounded-md">
              Logout
            </button>
          </template>
        </div>
      </div>

      <!-- Login Modal -->
      <LoginModal :show="showLoginModal" @close="showLoginModal = false" @login-success="handleLoginSuccess" />     
      <!-- Signup Modal -->
      <SignupModal :show="showSignupModal" @close="showSignupModal = false" />

      <!-- Main Content Area - Side by Side Layout -->
      <div class="flex flex-col md:flex-row gap-3">
        <div class="w-full md:w-1/3">
          <project-list 
            :projects="projects"
            :selected-project="selectedProject"
            @delete-project="handleDeleteProject"
            @project-selected="selectProject"
            @open-project-modal="showProjectModal = true" />
        </div>
        <div class="w-full md:w-2/3">
          <task-list 
            :project="selectedProject"
            :tasks="tasks"
            @update:tasks="tasks = $event"
            @task-selected="selectTask"
            @open-task-modal="openTaskModal"
            @delete-task="handleDeleteTask"
            @task-reordered="onTaskReorder" />
        </div>
      </div>
    
      <!-- Modals -->
      <project-modal 
        :show="showProjectModal"
        :project="newProject"
        @close="showProjectModal = false"
        @create-project="createProject" />
    
      <task-modal 
        :show="showTaskModal"
        :task="newTask"
        :available-users="availableUsers"
        @close="showTaskModal = false"
        @create-task="createTask"
        @file-upload="handleFileUpload" />
    
      <task-detail 
        :show="showTaskDetailModal"
        :task="selectedTask"
        :comments="comments"
        :new-comment="newComment"
        :user="user"
        @close="closeTaskDetail"
        @update-task-status="updateTaskStatus"
        @add-comment="addComment"
        @update-comment="newComment = $event"
        @delete-comment="handleDeleteComment" />
    
      <notification 
        :notifications="notifications"
        @remove-notification="removeNotification" />
    </div>
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
    async fetchTasks(projectId) {
      try {
        const response = await axios.get(`/api/tasks?project_id=${projectId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        this.tasks = response.data; // Now includes attachments
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
    // Other methods remain unchanged
    showNotification(title, message, type) {
      this.notifications.push({ title, message, type });
      setTimeout(() => this.notifications.shift(), 5000);
    }
  }
};
</script>