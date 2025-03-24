<template>
    <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">New Project</h3>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="$emit('create-project', project)">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" v-model="project.name" class="w-full border rounded p-2" required>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="project.description" class="w-full border rounded p-2" rows="3"></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input type="date" v-model="project.due_date" class="w-full border rounded p-2">
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="project.status" class="w-full border rounded p-2" required>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div class="flex justify-end gap-2">
            <button type="button" @click="$emit('close')" class="px-4 py-2 text-white bg-gray-500 hover:bg-gray-800 hover:text-white text-xs font-semibold shadow-md rounded-md">Cancel</button>
            <button type="submit" class="px-4 py-2 text-white bg-blue-500 hover:bg-gray-800 hover:text-white text-xs font-semibold shadow-md rounded-md">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      show: Boolean,
      project: Object
    }
  };
  </script>