import './bootstrap';
import { createApp } from 'vue';
import TaskBoard from './components/TaskBoard.vue';
import TaskList from './components/TaskList.vue';
import '../css/app.css'; 

const app = createApp(TaskBoard);

app.component('task-board', TaskBoard);
app.component('task-list', TaskList);

app.mount('#app');