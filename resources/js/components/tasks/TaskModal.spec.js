import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TaskModal from '../tasks/TaskModal.vue'; 

describe('TaskModal Component', () => {
  let wrapper;
  const mockTask = {
    title: 'Test Task',
    description: 'Test Description',
    priority: 1,
    due_date: '2025-04-01',
    status: 'to_do',
    assigned_user_id: null,
    attachments: [],
  };
  const mockUsers = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
  ];

  beforeEach(() => {
    wrapper = mount(TaskModal, {
      props: {
        show: true,
        task: { ...mockTask },
        availableUsers: [...mockUsers],
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders modal when show prop is true and task is provided', () => {
    expect(wrapper.find('h3').text()).toBe('New Task');
    expect(wrapper.find('input[type="text"]').element.value).toBe('Test Task');
    expect(wrapper.find('textarea').element.value).toBe('Test Description');
    expect(wrapper.isVisible()).toBe(true);
  });

  it('does not render modal when show prop is false', () => {
    wrapper = mount(TaskModal, {
      props: {
        show: false,
        task: { ...mockTask },
      },
    });
    expect(wrapper.find('h3').exists()).toBe(false);
    expect(wrapper.html()).toContain('<!--v-if-->');
  });

  it('emits close event when close button is clicked', async () => {
    const closeButton = wrapper.find('button[type="button"]');
    await closeButton.trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('displays empty description field when description is empty', async () => {
    wrapper = mount(TaskModal, {
      props: {
        show: true,
        task: { ...mockTask, description: '' },
        availableUsers: [...mockUsers],
      },
    });
    expect(wrapper.find('textarea').element.value).toBe('');
  });

  it('displays due date correctly', () => {
    expect(wrapper.find('input[type="date"]').element.value).toBe('2025-04-01');
  });

  it('emits create-task when form is submitted', async () => {
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.emitted('create-task')).toBeTruthy();
    expect(wrapper.emitted('create-task')[0]).toEqual([mockTask]);
  });

  it('emits file-upload when files are selected', async () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = wrapper.find('input[type="file"]');
    
    Object.defineProperty(input.element, 'files', {
      value: [file],
      writable: false,
    });
    
    await input.trigger('change');
    expect(wrapper.emitted('file-upload')).toBeTruthy();
    expect(wrapper.emitted('file-upload')[0][0]).toEqual([file]);
  });

  it('renders user assignment options', () => {
    const options = wrapper.findAll('select')[1].findAll('option'); 
    expect(options.length).toBe(mockUsers.length + 1); 
    expect(options[0].text()).toBe('Unassigned');
    expect(options[1].text()).toBe('User 1');
    expect(options[2].text()).toBe('User 2');
  });
});