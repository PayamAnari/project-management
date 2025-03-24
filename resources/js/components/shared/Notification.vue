<template>
    <div class="fixed bottom-4 right-4 max-w-md w-full">
      <div v-for="(notification, index) in notifications" :key="index" 
           class="bg-white border-l-4 p-4 mb-2 shadow-md rounded-r"
           :class="getNotificationClass(notification.type)">
        <div class="flex justify-between">
          <div class="font-medium">{{ notification.title }}</div>
          <button @click="$emit('remove-notification', index)" class="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div class="text-sm">{{ notification.message }}</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      notifications: Array
    },
    methods: {
      getNotificationClass(type) {
        return {
          'border-red-500': type === 'error',
          'border-green-500': type === 'success',
          'border-blue-500': type === 'info'
        };
      }
    }
  };
  </script>