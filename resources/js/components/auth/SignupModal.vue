<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Sign Up</h2>
      <!-- Signup Form -->
      <form @submit.prevent="handleSignup">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" v-model="name" class="w-full border rounded p-2" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" v-model="email" class="w-full border rounded p-2" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" v-model="password" class="w-full border rounded p-2" required />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input type="password" v-model="password_confirmation" class="w-full border rounded p-2" required />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="closeModal" class="px-4 py-2 text-white bg-gray-500 hover:bg-gray-800 hover:text-white text-xs font-semibold  shadow-md rounded-md">
            Close
          </button>
          <button type="submit" class="px-4 py-2 text-white bg-green-500 hover:bg-gray-800 hover:text-white text-xs font-semibold  shadow-md rounded-md">
            Sign Up
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
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async handleSignup() {
  try {
    if (this.password !== this.password_confirmation) {
      alert('Passwords do not match.');
      return;
    }

    const response = await axios.post('http://localhost:8000/api/register', {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Signup successful:', response.data);
    alert('Signup successful! You can now log in.');

    this.closeModal();
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data); 
      const errors = error.response.data.errors;
      let errorMessage = 'Signup failed:\n';
      for (const key in errors) {
        errorMessage += `${errors[key].join(', ')}\n`;
      }
      alert(errorMessage);
    } else {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
    }
  }
}
  }
};
</script>