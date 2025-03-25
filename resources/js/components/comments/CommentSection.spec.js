import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CommentSection from '../comments/CommentSection.vue'; 

describe('CommentSection Component', () => {
  let wrapper;
  const mockComments = [
    { id: 1, user: { id: 1, name: 'User 1' }, content: 'First comment', created_at: '2025-03-25T10:00:00Z' },
    { id: 2, user: { id: 2, name: 'User 2' }, content: 'Second comment', created_at: '2025-03-25T11:00:00Z' },
  ];
  const mockUser = { id: 1, name: 'User 1', is_admin: false };

  beforeEach(() => {
    wrapper = mount(CommentSection, {
      props: {
        comments: [...mockComments],
        newComment: '',
        currentUser: { ...mockUser },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders comment input area', () => {
    const textarea = wrapper.find('textarea');
    expect(textarea.exists()).toBe(true);
    expect(textarea.attributes('placeholder')).toBe('Add a comment...');
    expect(wrapper.find('button').text()).toBe('Add Comment');
  });

  it('emits update-comment when typing in textarea', async () => {
    const textarea = wrapper.find('textarea');
    await textarea.setValue('New comment text');
    expect(wrapper.emitted('update-comment')).toBeTruthy();
    expect(wrapper.emitted('update-comment')[0]).toEqual(['New comment text']);
  });

  it('emits add-comment when Add Comment button is clicked', async () => {
    const button = wrapper.find('button');
    await button.trigger('click');
    expect(wrapper.emitted('add-comment')).toBeTruthy();
    expect(wrapper.emitted('add-comment').length).toBe(1);
  });

  it('renders list of comments', () => {
    const commentDivs = wrapper.findAll('.group');
    expect(commentDivs.length).toBe(2);
    expect(commentDivs[0].find('.font-medium').text()).toBe('User 1');
    expect(commentDivs[0].find('.text-gray-700').text()).toBe('First comment');
    expect(commentDivs[1].find('.font-medium').text()).toBe('User 2');
    expect(commentDivs[1].find('.text-gray-700').text()).toBe('Second comment');
  });

  it('displays "No comments yet" when comments array is empty', () => {
    wrapper = mount(CommentSection, {
      props: { comments: [], newComment: '', currentUser: mockUser },
    });
    expect(wrapper.text()).toContain('No comments yet.');
    expect(wrapper.find('.group').exists()).toBe(false);
  });

  it('shows delete button for own comment', () => {
    const commentDiv = wrapper.findAll('.group')[0]; 
    const deleteButton = commentDiv.find('button');
    expect(deleteButton.exists()).toBe(true);
    expect(deleteButton.classes()).toContain('opacity-0'); 
  });

  it('hides delete button for other user’s comment if not admin', () => {
    const commentDiv = wrapper.findAll('.group')[1]; 
    const deleteButton = commentDiv.find('button');
    expect(deleteButton.exists()).toBe(false); 
  });

  it('shows delete button for other user’s comment if admin', () => {
    wrapper = mount(CommentSection, {
      props: {
        comments: [...mockComments],
        newComment: '',
        currentUser: { id: 3, name: 'Admin', is_admin: true },
      },
    });
    const commentDiv = wrapper.findAll('.group')[1]; 
    const deleteButton = commentDiv.find('button');
    expect(deleteButton.exists()).toBe(true);
  });

  it('emits delete-comment when delete button is clicked and confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true); 
    const commentDiv = wrapper.findAll('.group')[0]; 
    const deleteButton = commentDiv.find('button');
    await deleteButton.trigger('click');
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this comment?');
    expect(wrapper.emitted('delete-comment')).toBeTruthy();
    expect(wrapper.emitted('delete-comment')[0]).toEqual([1]); 
    vi.restoreAllMocks();
  });

  it('does not emit delete-comment when delete is canceled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false); 
    const commentDiv = wrapper.findAll('.group')[0];
    const deleteButton = commentDiv.find('button');
    await deleteButton.trigger('click');
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this comment?');
    expect(wrapper.emitted('delete-comment')).toBeFalsy();
    vi.restoreAllMocks();
  });

  it('formats date and time correctly', () => {
    const commentDiv = wrapper.findAll('.group')[0]; 
    const dateDiv = commentDiv.find('.text-xs'); 
    expect(dateDiv.text()).toBe('3/25/2025, 11:00:00 AM'); 
  });
});