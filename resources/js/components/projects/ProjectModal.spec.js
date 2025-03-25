import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProjectModal from '../projects/ProjectModal.vue';

describe('ProjectModal Component', () => {
  let wrapper;

  const defaultProject = {
    name: '',
    description: '',
    due_date: '',
    status: 'not_started',
  };

  beforeEach(() => {
    wrapper = mount(ProjectModal, {
      props: {
        show: true,
        project: { ...defaultProject },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders modal when show prop is true', () => {
    expect(wrapper.find('h3').text()).toBe('New Project');
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('does not render modal when show prop is false', () => {
    wrapper = mount(ProjectModal, {
      props: { show: false, project: defaultProject },
    });
    expect(wrapper.find('h3').exists()).toBe(false);
    expect(wrapper.find('form').exists()).toBe(false);
  });

  it('emits close event when close button is clicked', async () => {
    const closeButton = wrapper.find('button');
    await closeButton.trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('emits close event when cancel button is clicked', async () => {
    const cancelButton = wrapper.find('button[type="button"]');
    expect(cancelButton.text()).toBe('Cancel');
    await cancelButton.trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('emits create-project with form data on submit', async () => {
    const form = wrapper.find('form');
    const inputs = wrapper.findAll('input');
    const textarea = wrapper.find('textarea');
    const select = wrapper.find('select');

    await inputs[0].setValue('Test Project');
    await textarea.setValue('Test Description');
    await inputs[1].setValue('2025-04-01');
    await select.setValue('in_progress');

    await form.trigger('submit.prevent');

    expect(wrapper.emitted('create-project')).toBeTruthy();
    expect(wrapper.emitted('create-project')[0]).toEqual([
      {
        name: 'Test Project',
        description: 'Test Description',
        due_date: '2025-04-01',
        status: 'in_progress',
      },
    ]);
  });

  it('displays default project values in form', () => {
    wrapper = mount(ProjectModal, {
      props: {
        show: true,
        project: {
          name: 'Existing Project',
          description: 'Existing Desc',
          due_date: '2025-05-01',
          status: 'completed',
        },
      },
    });

    const inputs = wrapper.findAll('input');
    const textarea = wrapper.find('textarea');
    const select = wrapper.find('select');

    expect(inputs[0].element.value).toBe('Existing Project');
    expect(textarea.element.value).toBe('Existing Desc');
    expect(inputs[1].element.value).toBe('2025-05-01');
    expect(select.element.value).toBe('completed');
  });
});