<h1 align="center">
  <img
    width="300"
    alt="project"
    src="https://live.staticflickr.com/65535/54408515600_2cc05b315d_w.jpg">
</h1>

---

<h3 align="center">
  <strong>
      ⚙️ Project Management ⚙️
  </strong>
</h3>

---

<p align="center">
  <img 
    width="1200"
    alt="home"
    src="https://live.staticflickr.com/65535/54408155796_17ac116345_h.jpg"/>
</p>

---

<p align="center">
  <img 
    width="1200"
    alt="home"
    src="https://live.staticflickr.com/65535/54408206751_c76cecf625_c.jpg"/>
</p>

---
<p align="center">
  <img 
    width="1200"
    alt="home"
    src="https://live.staticflickr.com/65535/54408212311_a65c47261d_z.jpg"/>
</p>



## Description

### Project Management

A modern project management application built with Laravel Filament (admin panel) and Vue.js (frontend interface). This application provides a complete solution for task and project management with real-time updates.

## ✨ Features

### 🖥️ Admin Panel (Laravel Filament)
- **Full CRUD Operations**:
  - Create, Read, Update, and Delete projects/tasks/users
  - Batch actions for mass operations
- **Advanced Data Management**:
  - Powerful filtering system (by status, date, priority)
  - Global and column-specific search


### 📋 Project Management
  - Create, view, delete and organize projects
  - Track project status (Not Started, In Progress, Completed)
  - Set due dates and priorities

### ✅ Task System
  - Drag-and-drop task organization
  - Delete task and comment
  - Multiple statuses (To Do, In Progress, Under Review, Completed)
  - Task assignment to team members
  - File attachments
  - Comments and collaboration
  - 
### 🤵🏽‍♀️ User Management
  - Authentication system (login/registration)
  - Role-based permissions (via Filament)

### 🔔 Real-time Features
  - Live task updates
  - Instant notifications
  - Comment activity stream

---

## 🛠️ Technology Stack

### Backend
- **Core Framework**: Laravel 12 (PHP 8.2+)
- **Admin Panel**: Filament v3 (+Forms, Notifications)
- **Authentication**: Laravel Breeze + Sanctum
- **Real-time**: Laravel Echo + Pusher (PHP Server & JS Client)
- **Database**: SQLite (Development), MySQL/PostgreSQL (Production)
- **Testing**: PHPUnit + Pest (with Collision reporting)

### Frontend
- **Core Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Vite 6
- **UI Framework**: Tailwind CSS 3 + PostCSS
- **Key Packages**:
  - Vue Router 4 (SPA navigation)
  - Vuedraggable 4 (Drag-and-drop interfaces)
  - Axios 1 (HTTP client)
- **Real-time**: Pusher.js 8 + Laravel Echo

### Development Tools
- **Local Environment**: Laravel Sail (Docker)
- **Code Quality**: Laravel Pint (PHP CS Fixer)
- **Logging**: Laravel Pail (Real-time logs)
- **Process Manager**: Concurrent dev server execution

### Infrastructure
- **Queue System**: Laravel Queue (with auto-retry)
- **API**: Sanctum (SPA Authentication)
- **Packaging**: Composer 2 + npm 9+

### Testing

- **Vitest**: (Unit testing)

- **Vue Test Utils**: (Component testing)

- **JSDOM**: (Browser environment simulation)

 <p align="left">
  <img src="https://img.shields.io/badge/laravel-00008B?style=for-the-badge&logo=laravel&logoColor=white"/>
  <img src="https://img.shields.io/badge/filament-acace6?style=for-the-badge&logo=filament&logoColor=white"/>
  <img src="https://img.shields.io/badge/breeze-800000?style=for-the-badge&logo=breeze&logoColor=white"/>
  <img src="https://img.shields.io/badge/pusherjs-85EA2D?style=for-the-badge&logo=pusherjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/vuejs-ffa500?style=for-the-badge&logo=vuejs&logoColor=white"/>
  <img src="https://img.shields.io/badge/postgresql-ff0000?style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/tailwindcss-0000FF?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
   <img src="https://img.shields.io/badge/sanctum-008000?style=for-the-badge&logo=sanctum&logoColor=white"/>
  <img src="https://img.shields.io/badge/composer-ffff32?style=for-the-badge&logo=composer&logoColor=white"/>
  <img src="https://img.shields.io/badge/git-ff5600?style=for-the-badge&logo=git&logoColor=white"/>
  <img src="https://img.shields.io/badge/github-bf00ff?style=for-the-badge&logo=github&logoColor=white"/>
  <img src="https://img.shields.io/badge/vitest-bfddff?style=for-the-badge&logo=gvitest&logoColor=white"/>


</p>


---

## 🧪 Testing
### Testing Strategy
- The application includes comprehensive unit tests for all Vue.js components using Vitest. Tests cover:

- **Authentication Components**
SignupModal, LoginModal - Form validation, API interactions, error handling

- **Project Management**
ProjectList, ProjectModal - CRUD operations, list rendering, form validation

- **Task Management**
TaskList, TaskModal, TaskDetail - Task operations, drag-and-drop, status changes

- **Core Components**
TaskManager, CommentSection - Data flow, real-time updates, notifications

### Running Tests
1- **To run the tests locally:**

Ensure dependencies are installed:
```
npm install
```

2- **Run the test suite:**
```
npm run test
```

- Executes all tests in resources/js/components/.
- Use npm run test -- --watch for development watch mode.

### Test Setup

Configuration: Defined in vitest.config.js:
```
import vue from '@vitejs/plugin-vue';
  export default {
    plugins: [laravel({...}), vue()],
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['resources/js/components/**/*.{test,spec}.js'],
      deps: {
        optimizer: {
          web: { include: ['@vue/test-utils', 'vue'] }
        }
      }
    }
  };
```

---

## 📦 Installation

###  System Requirements
- PHP 8.2+
- Node.js 18+
- Composer 2+
- MySQL 8+/PostgreSQL 15+ (or SQLite for development)

1- **Clone the repository:**
```
git clone https://github.com/PayamAnari/project-management.git
cd project-management

```
2- **Install dependencies:**
```
composer install
npm install
```

3- **Configure environment:**
```
cp .env.example .env
php artisan key:generate
```

4- **Set up database and run migrations:**
```
php artisan migrate
```

5- **Build assets:**
```
npm run build

```

6- **Start development servers:**
```
php artisan serve
npm run dev

# Create admin user (Filament)
php artisan make:filament-user

```

7- **Open the application in your browser:**
```
Visit http://localhost:8000 to view the application.
Visit http://localhost:8000/admin to view admin panel
```

---

## License
This project is licensed under the [MIT License](LICENSE).

---

### Built with ❤️ by Payam Anari

Thank you for exploring the Django-Airbnb! If you have any questions, feedback, or just want to say hi, feel free to [reach out](mailto:anari.p62@gmail.com). Happy fitness journey!

---
