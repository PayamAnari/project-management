import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TaskList from '../tasks/TaskList.vue';

describe('TaskList Component', () => {
  const mockProject = { id: 1, name: 'Test Project' };
  const mockTasks = [
    { id: 1, title: 'Task A', status: 'to_do', due_date: '2025-04-01' },
    { id: 2, title: 'Task B', status: 'in_progress' },
  ];

  it('renders tasks when project is provided', () => {
    const wrapper = mount(TaskList, {
      props: { project: mockProject, tasks: mockTasks },
    });
    expect(wrapper.find('h3').text()).toBe('Tasks for Test Project');
    const taskItems = wrapper.findAll('.group');
    expect(taskItems.length).toBe(2);
    expect(taskItems[0].text()).toContain('Task A');
    expect(taskItems[1].text()).toContain('Task B');
  });

  it('shows no tasks message when tasks array is empty', () => {
    const wrapper = mount(TaskList, {
      props: { project: mockProject, tasks: [] },
    });
    expect(wrapper.text()).toContain('No tasks for this project yet.');
  });

  it('shows select project message when project is null', () => {
    const wrapper = mount(TaskList, { props: { project: null, tasks: [] } });
    expect(wrapper.text()).toContain('Select a project to view tasks');
  });

  it('emits open-task-modal when add task button is clicked', async () => {
    const wrapper = mount(TaskList, {
      props: { project: mockProject, tasks: mockTasks },
    });
    const addButton = wrapper.find('button');
    expect(addButton.text()).toBe('Add Task');
    await addButton.trigger('click');
    expect(wrapper.emitted('open-task-modal')).toBeTruthy();
  });

  it('emits task-selected when task is clicked', async () => {
    const wrapper = mount(TaskList, {
      props: { project: mockProject, tasks: mockTasks },
    });
    const taskItem = wrapper.findAll('.group')[0].find('div');
    await taskItem.trigger('click');
    expect(wrapper.emitted('task-selected')).toBeTruthy();
    expect(wrapper.emitted('task-selected')[0]).toEqual([mockTasks[0]]);
  });

  it('emits delete-task when delete is confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const wrapper = mount(TaskList, {
      props: { project: mockProject, tasks: mockTasks },
    });
    const deleteButton = wrapper.findAll('.group')[0].find('button');
    await deleteButton.trigger('click');
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Task A"?');
    expect(wrapper.emitted('delete-task')).toBeTruthy();
    expect(wrapper.emitted('delete-task')[0]).toEqual([1]);
    vi.restoreAllMocks();
  });

  it('does not emit delete-task when confirm is canceled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const wrapper = mount(TaskList, {
      props: { project: mockProject, tasks: mockTasks },
    });
    const deleteButton = wrapper.findAll('.group')[0].find('button');
    await deleteButton.trigger('click');
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Task A"?');
    expect(wrapper.emitted('delete-task')).toBeFalsy();
    vi.restoreAllMocks();
  });

  it('emits task-reordered when drag ends', async () => {
    const wrapper = mount(TaskList, {
      props: { project: mockProject, tasks: mockTasks },
    });
    const draggable = wrapper.findComponent({ name: 'draggable' });
    await draggable.vm.$emit('end');
    expect(wrapper.emitted('task-reordered')).toBeTruthy();
  });

  it('displays status with correct formatting and classes', () => {
    const wrapper = mount(TaskList, {
      props: { project: mockProject, tasks: mockTasks },
    });
    const statusSpans = wrapper.findAll('.rounded-full');
    expect(statusSpans[0].text()).toBe('To Do');
    expect(statusSpans[0].classes()).toContain('bg-red-100');
    expect(statusSpans[1].text()).toBe('In Progress');
    expect(statusSpans[1].classes()).toContain('bg-yellow-100');
  });
});