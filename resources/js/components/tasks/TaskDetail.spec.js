import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TaskDetail from '../tasks/TaskDetail.vue';

// Mock the CommentSection component
vi.mock('../comments/CommentSection.vue', () => ({
  default: {
    name: 'CommentSection',
    template: '<div><slot></slot></div>',
    props: ['comments', 'newComment', 'currentUser'],
  },
}));

describe('TaskDetail Component', () => {
  let wrapper;
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'to_do',
    due_date: '2025-04-01',
  };
  const mockComments = [
    { id: 1, content: 'First comment' },
    { id: 2, content: 'Second comment' },
  ];
  const mockUser = { id: 1, name: 'John Doe' };

  beforeEach(() => {
    wrapper = mount(TaskDetail, {
      props: {
        show: true,
        task: { ...mockTask }, 
        comments: mockComments,
        newComment: '',
        user: mockUser,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders modal when show prop is true and task is provided', () => {
    expect(wrapper.find('h3').text()).toBe('Test Task');
    expect(wrapper.find('.text-gray-700').text()).toBe('Test Description');
    expect(wrapper.isVisible()).toBe(true);
  });

  it('does not render modal when show prop is false', () => {
    wrapper = mount(TaskDetail, {
      props: { show: false, task: mockTask, comments: [], user: mockUser },
    });
    expect(wrapper.find('h3').exists()).toBe(false);
    expect(wrapper.find('div').exists()).toBe(false); 
  });

  it('does not render modal when task is null', () => {
    wrapper = mount(TaskDetail, {
      props: { show: true, task: null, comments: [], user: mockUser },
    });
    expect(wrapper.find('h3').exists()).toBe(false);
    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('emits close event when close button is clicked', async () => {
    const closeButton = wrapper.find('button');
    expect(closeButton.exists()).toBe(true);
    await closeButton.trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
    expect(wrapper.emitted('close').length).toBe(1);
  });

  it('displays "No description provided" when description is empty', () => {
    wrapper = mount(TaskDetail, {
      props: {
        show: true,
        task: { ...mockTask, description: '' },
        comments: [],
        user: mockUser,
      },
    });
    expect(wrapper.find('.text-gray-700').text()).toBe('No description provided.');
  });

  it('displays due date or "No due date" correctly', () => {
    const dueDateDiv = wrapper.findAll('.text-gray-700')[1];
    expect(dueDateDiv.text()).toBe('4/1/2025');

    wrapper = mount(TaskDetail, {
      props: {
        show: true,
        task: { ...mockTask, due_date: null },
        comments: [],
        user: mockUser,
      },
    });
    expect(wrapper.findAll('.text-gray-700')[1].text()).toBe('No due date');
  });

  it('emits update-task-status when status is changed', async () => {
    const select = wrapper.find('select');
    expect(select.element.value).toBe('to_do');
    await select.setValue('in_progress');
    expect(wrapper.emitted('update-task-status')).toBeTruthy();
    expect(wrapper.emitted('update-task-status')[0]).toEqual([
      { ...mockTask, status: 'in_progress' },
    ]);
  });

  it('passes props to CommentSection and proxies its events', () => {
    const commentSection = wrapper.findComponent({ name: 'CommentSection' });
    expect(commentSection.exists()).toBe(true);
    expect(commentSection.props('comments')).toEqual(mockComments);
    expect(commentSection.props('newComment')).toBe('');
    expect(commentSection.props('currentUser')).toEqual(mockUser);

    // Simulate events from CommentSection
    commentSection.vm.$emit('add-comment', 'newComment');
    commentSection.vm.$emit('update-comment', { id: 1, content: 'Updated' });
    commentSection.vm.$emit('delete-comment', 2);

    expect(wrapper.emitted('add-comment')).toBeTruthy();
    expect(wrapper.emitted('add-comment')[0]).toEqual(['newComment']);
    expect(wrapper.emitted('update-comment')).toBeTruthy();
    expect(wrapper.emitted('update-comment')[0]).toEqual([{ id: 1, content: 'Updated' }]);
    expect(wrapper.emitted('delete-comment')).toBeTruthy();
    expect(wrapper.emitted('delete-comment')[0]).toEqual([2]);
  });
});