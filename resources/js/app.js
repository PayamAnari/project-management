import './bootstrap';
import { createApp } from 'vue';
import TaskManager from './components/TaskManager.vue';

const app = createApp(TaskManager);

app.component('task-manager', TaskManager);

app.mount('#app');

// Initialize Echo for real-time updates
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true
});