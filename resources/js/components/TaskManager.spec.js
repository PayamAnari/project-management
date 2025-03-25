import { mount, shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TaskManager from './TaskManager.vue'; 
import axios from 'axios';

// Mock child components
vi.mock('./projects/ProjectList.vue', () => ({
  default: { template: '<div class="project-list-mock"></div>' },
}));
vi.mock('./projects/ProjectModal.vue', () => ({
  default: { template: '<div class="project-modal-mock"></div>' },
}));
vi.mock('./tasks/TaskList.vue', () => ({
  default: { template: '<div class="task-list-mock"></div>' },
}));
vi.mock('./tasks/TaskModal.vue', () => ({
  default: { template: '<div class="task-modal-mock"></div>' },
}));
vi.mock('./tasks/TaskDetail.vue', () => ({
  default: { template: '<div class="task-detail-mock"></div>' },
}));
vi.mock('./shared/Notification.vue', () => ({
  default: { template: '<div class="notification-mock"></div>' },
}));
vi.mock('./auth/LoginModal.vue', () => ({
  default: { template: '<div class="login-modal-mock"></div>' },
}));
vi.mock('./auth/SignupModal.vue', () => ({
  default: { template: '<div class="signup-modal-mock"></div>' },
}));
vi.mock('vuedraggable', () => ({
  default: { template: '<div><slot></slot></div>' },
}));

// Mock Axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock Echo
global.Echo = {
  private: vi.fn(() => ({
    listen: vi.fn(() => ({ listen: vi.fn() })),
  })),
};

describe('TaskManager Component', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    wrapper = mount(TaskManager, { 
      global: { mocks: { $axios: axios } },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders unauthenticated state correctly', () => {
    expect(wrapper.find('h2').text()).toBe('Project Management');
    const buttons = wrapper.findAll('button');
    expect(buttons[0].text()).toBe('Login');
    expect(buttons[1].text()).toBe('Sign Up');
    expect(wrapper.find('.project-list-mock').exists()).toBe(true);
    expect(wrapper.find('.task-list-mock').exists()).toBe(true);
  });

  it('renders authenticated state correctly', async () => {
    localStorage.setItem('authToken', 'mock-token');
    axios.get
      .mockResolvedValueOnce({ data: { name: 'Test User' } }) 
      .mockResolvedValueOnce({ data: [] }); 
    wrapper = mount(TaskManager, {
      global: { mocks: { $axios: axios } },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick(); 
    expect(wrapper.vm.isAuthenticated).toBe(true);
    expect(wrapper.text()).toContain('Welcome, Test User!');
    expect(wrapper.find('button').text()).toBe('Logout');
  });

  it('opens login modal when Login button is clicked', async () => {
    const loginButton = wrapper.findAll('button')[0]; 
    await loginButton.trigger('click');
    expect(wrapper.vm.showLoginModal).toBe(true);
    expect(wrapper.find('.login-modal-mock').exists()).toBe(true);
  });

  it('opens signup modal when Sign Up button is clicked', async () => {
    const signupButton = wrapper.findAll('button')[1]; 
    await signupButton.trigger('click');
    expect(wrapper.vm.showSignupModal).toBe(true);
    expect(wrapper.find('.signup-modal-mock').exists()).toBe(true);
  });

  it('handles login success', async () => {
    wrapper.vm.showNotification = vi.fn();
    axios.get
      .mockResolvedValueOnce({ data: { name: 'Test User' } }) 
      .mockResolvedValueOnce({ data: [] }); 
    await wrapper.vm.handleLoginSuccess();
    expect(wrapper.vm.isAuthenticated).toBe(true);
    expect(wrapper.vm.user.name).toBe('Test User');
    expect(wrapper.vm.showLoginModal).toBe(false);
    expect(wrapper.vm.showNotification).toHaveBeenCalledWith('Success', 'You have been logged in', 'success');
  });

  it('logs out user and resets state', async () => {
    localStorage.setItem('authToken', 'mock-token');
    wrapper.vm.showNotification = vi.fn();
    await wrapper.setData({ isAuthenticated: true, user: { name: 'Test User' }, projects: [{ id: 1 }] });
    const logoutButton = wrapper.find('button');
    await logoutButton.trigger('click');
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(wrapper.vm.isAuthenticated).toBe(false);
    expect(wrapper.vm.user.name).toBe('');
    expect(wrapper.vm.projects).toEqual([]);
    expect(wrapper.vm.showNotification).toHaveBeenCalledWith('Success', 'You have been logged out', 'success');
  });

  it('fetches projects when authenticated', async () => {
    localStorage.setItem('authToken', 'mock-token');
    axios.get
      .mockResolvedValueOnce({ data: { name: 'Test User' } }) 
      .mockResolvedValueOnce({ data: [{ id: 1, name: 'Project 1' }] }); 
    wrapper = mount(TaskManager, {
      global: { mocks: { $axios: axios } },
    });
    await wrapper.vm.$nextTick();
    expect(axios.get).toHaveBeenCalledWith('/api/projects', expect.any(Object));
    expect(wrapper.vm.projects).toEqual([{ id: 1, name: 'Project 1' }]);
  });

  it('does not fetch projects when unauthenticated', async () => {
    axios.get.mockClear();
    wrapper.vm.fetchProjects();
    await wrapper.vm.$nextTick();
    expect(axios.get).not.toHaveBeenCalled();
    expect(wrapper.vm.projects).toEqual([]);
  });

  it('selects project and fetches tasks', async () => {
    wrapper.vm.showNotification = vi.fn();
    const project = { id: 1, name: 'Project 1' };
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, title: 'Task 1' }] });
    await wrapper.vm.selectProject(project);
    expect(wrapper.vm.selectedProject).toEqual(project); 
    expect(axios.get).toHaveBeenCalledWith('/api/tasks?project_id=1', expect.any(Object));
    expect(wrapper.vm.tasks).toEqual([{ id: 1, title: 'Task 1' }]);
    expect(wrapper.vm.selectedTask).toBeNull();
    expect(wrapper.vm.showTaskDetailModal).toBe(false);
  });

  it('creates a project', async () => {
    wrapper.vm.showNotification = vi.fn();
    const newProjectData = { name: 'New Project', description: 'Test', due_date: '', status: 'not_started' };
    await wrapper.setData({ newProject: { ...newProjectData } });
    axios.post.mockResolvedValueOnce({ data: { id: 1, ...newProjectData } });
    await wrapper.vm.createProject();
    expect(axios.post).toHaveBeenCalledWith('/api/projects', newProjectData);
    expect(wrapper.vm.projects).toContainEqual({ id: 1, ...newProjectData });
    expect(wrapper.vm.newProject).toEqual({ name: '', description: '', due_date: '', status: 'not_started' });
    expect(wrapper.vm.showProjectModal).toBe(false);
    expect(wrapper.vm.showNotification).toHaveBeenCalledWith('Success', 'Project created successfully', 'success');
  });

  it('creates a task with FormData', async () => {
    wrapper.vm.showNotification = vi.fn();
    wrapper.setData({
      selectedProject: { id: 1 },
      newTask: { title: 'New Task', description: 'Test', attachments: [new File([''], 'test.txt')] },
    });
    axios.post.mockResolvedValueOnce({ data: { id: 1, title: 'New Task' } });
    await wrapper.vm.createTask();
    expect(axios.post).toHaveBeenCalledWith('/api/tasks', expect.any(FormData), expect.any(Object));
    expect(wrapper.vm.tasks).toContainEqual({ id: 1, title: 'New Task' });
    expect(wrapper.vm.showTaskModal).toBe(false);
    expect(wrapper.vm.showNotification).toHaveBeenCalledWith('Success', 'Task created successfully', 'success');
  });

  it('adds a comment', async () => {
    wrapper.vm.showNotification = vi.fn();
    wrapper.setData({ selectedTask: { id: 1 }, newComment: 'Test comment' });
    axios.post.mockResolvedValueOnce({ data: { id: 1, content: 'Test comment' } });
    await wrapper.vm.addComment();
    expect(axios.post).toHaveBeenCalledWith('/api/comments', { content: 'Test comment', task_id: 1 });
    expect(wrapper.vm.comments[0]).toEqual({ id: 1, content: 'Test comment' });
    expect(wrapper.vm.newComment).toBe('');
    expect(wrapper.vm.showNotification).toHaveBeenCalledWith('Success', 'Comment added', 'success');
  });

  it('updates task status', async () => {
    wrapper.vm.showNotification = vi.fn();
    wrapper.setData({ selectedTask: { id: 1, status: 'in_progress' }, tasks: [{ id: 1, status: 'to_do' }] });
    axios.put.mockResolvedValueOnce({});
    await wrapper.vm.updateTaskStatus();
    expect(axios.put).toHaveBeenCalledWith('/api/tasks/1', expect.any(Object));
    expect(wrapper.vm.tasks[0].status).toBe('in_progress');
    expect(wrapper.vm.showTaskDetailModal).toBe(false);
    expect(wrapper.vm.showNotification).toHaveBeenCalledWith('Success', 'Task status updated', 'success');
  });

  it('sets up real-time listeners', () => {
    window.userId = 1;
    wrapper.vm.setupRealTimeListeners();
    expect(Echo.private).toHaveBeenCalledWith('App.Models.User.1');
  });
});