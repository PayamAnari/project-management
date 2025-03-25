import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ProjectList from '../projects/ProjectList.vue';

describe('ProjectList Component', () => {
  const mockProjects = [
    { id: 1, name: 'Project A', status: 'not_started', due_date: '2025-04-01' },
    { id: 2, name: 'Project B', status: 'in_progress', due_date: '2025-05-01' },
    { id: 3, name: 'Project C', status: 'completed' },
  ];

  it('renders project list with provided projects', () => {
    const wrapper = mount(ProjectList, {
      props: { projects: mockProjects, selectedProject: null },
    });
    const projectItems = wrapper.findAll('.group');
    expect(projectItems.length).toBe(3);
    expect(projectItems[0].text()).toContain('Project A');
    expect(projectItems[1].text()).toContain('Project B');
    expect(projectItems[2].text()).toContain('Project C');
  });

  it('highlights selected project with border', () => {
    const wrapper = mount(ProjectList, {
      props: { projects: mockProjects, selectedProject: mockProjects[1] },
    });
    const selectedItem = wrapper.findAll('.group')[1];
    expect(selectedItem.classes()).toContain('border-l-4');
    expect(selectedItem.classes()).toContain('border-blue-500');
  });

  it('emits project-selected event when project is clicked', async () => {
    const wrapper = mount(ProjectList, {
      props: { projects: mockProjects, selectedProject: null },
    });
    const projectItem = wrapper.findAll('.group')[0].find('div');
    await projectItem.trigger('click');
    expect(wrapper.emitted('project-selected')).toBeTruthy();
    expect(wrapper.emitted('project-selected')[0]).toEqual([mockProjects[0]]);
  });

  it('shows delete button on hover and emits delete-project on confirm', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const wrapper = mount(ProjectList, {
      props: { projects: mockProjects, selectedProject: null },
    });
    const projectItem = wrapper.findAll('.group')[0];
    const deleteButton = projectItem.find('button');
    expect(deleteButton.classes()).toContain('opacity-0');
    await deleteButton.trigger('click');
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Project A"?');
    expect(wrapper.emitted('delete-project')).toBeTruthy();
    expect(wrapper.emitted('delete-project')[0]).toEqual([1]);
    vi.restoreAllMocks();
  });

  it('does not emit delete-project if confirm is canceled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const wrapper = mount(ProjectList, {
      props: { projects: mockProjects, selectedProject: null },
    });
    const deleteButton = wrapper.findAll('.group')[0].find('button');
    await deleteButton.trigger('click');
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Project A"?');
    expect(wrapper.emitted('delete-project')).toBeFalsy();
    vi.restoreAllMocks();
  });

  it('emits open-project-modal when add project button is clicked', async () => {
    const wrapper = mount(ProjectList, {
      props: { projects: mockProjects, selectedProject: null },
    });
    const addButton = wrapper.find('button.bg-blue-500');
    expect(addButton.text()).toBe('Add Project');
    await addButton.trigger('click');
    expect(wrapper.emitted('open-project-modal')).toBeTruthy();
  });

  it('displays status with correct color and formatting', () => {
    const wrapper = mount(ProjectList, {
      props: { projects: mockProjects, selectedProject: null },
    });
    const statuses = wrapper.findAll('.text-sm span:first-child');
    expect(statuses[0].text()).toBe('Not Started');
    expect(statuses[0].classes()).toContain('text-red-500');
    expect(statuses[1].text()).toBe('In Progress');
    expect(statuses[1].classes()).toContain('text-yellow-500');
    expect(statuses[2].text()).toBe('Completed');
    expect(statuses[2].classes()).toContain('text-green-500');
  });

  it('displays due date when present', () => {
    const wrapper = mount(ProjectList, {
      props: { projects: mockProjects, selectedProject: null },
    });
    const dueDates = wrapper.findAll('.text-sm');
    expect(dueDates[0].text()).toContain('Due: 4/1/2025');
    expect(dueDates[1].text()).toContain('Due: 5/1/2025');
    expect(dueDates[2].text()).not.toContain('Due');
  });
});