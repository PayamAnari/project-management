<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Login</h2>
      <!-- Login Form -->
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" v-model="email" class="w-full border rounded p-2" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" v-model="password" class="w-full border rounded p-2" required />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="closeModal" class="px-4 py-2 text-white bg-gray-500 hover:bg-gray-800 hover:text-white text-xs font-semibold  shadow-md rounded-md">
            Close
          </button>
          <button type="submit" class="px-4 py-2 text-white bg-blue-500 hover:bg-gray-800 hover:text-white text-xs font-semibold  shadow-md rounded-md">
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async handleLogin() {
  try {
    const response = await axios.post('http://localhost:8000/api/login', {
      email: this.email,
      password: this.password
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    localStorage.setItem('authToken', response.data.token);
    this.$emit('login-success');
    this.closeModal();
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      alert(error.response.data.message);
    } else {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  }
}
  }
};
</script>