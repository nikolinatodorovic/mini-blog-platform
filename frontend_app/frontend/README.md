# Mini Blog Platform with CRUD Operations

## Overview
The **Mini Blog Platform** is a simple yet powerful blogging application that allows users to create, read, update, and delete blog posts and comments. Built with a modern tech stack, it provides a user-friendly interface and seamless interactions, making it an excellent solution for bloggers and readers alike.

## Technologies Used

### Frontend
- **React with Vite**: For a fast and efficient user interface.
- **TypeScript**: Ensures type safety and improves code quality.
- **TanStack Query (React Query)**: Manages data fetching and caching for improved performance.
- **CSS Modules**: For styling and design.
- **Post Search**: Users can search for blog posts.

### Backend
- **Node.js**: A JavaScript runtime for building server-side applications.
- **Express.js**: A web framework for Node.js, providing a robust set of features for web and mobile applications.
- **Supabase**: A backend-as-a-service platform using PostgreSQL as the database.

## Features

### User Authentication
- **Secured user authentication** using Supabase Auth.

### Blog Posts
- **CRUD Operations**: Create, read, update, and delete blog posts.
- **List View with Pagination**: View multiple posts with pagination support.
- **Single Post View**: View the details of individual posts.

### Comments
- **CRUD Operations for Comments**: Add, edit, delete, and view comments for each post.
- **Comment List**: Displays comments under each corresponding post.

### API Endpoints
The following API endpoints are provided:
- `POST /api/posts`
- `GET /api/posts`
- `GET /api/posts/:id`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/posts/:id/comments`
- `GET /api/posts/:id/comments`
- `PUT /api/posts/:id/comments/:commentId`
- `DELETE /api/posts/:id/comments/:commentId`

## How to Install and Run the Project

1. **Clone the Repository and Install Dependencies**
   ```bash
   git clone https://github.com/yourusername/mini-blog.git
   cd mini-blog
   cd frontend_app/frontend
   npm install
   cd ../backend
   npm install

2. **Install Dependencies for Frontend and Backend**
   ```bash
   cd frontend_app/frontend
   npm install
   cd ../backend
   npm install

3. **Run the Frontend and Backend Servers**
   - **Frontend:** 
     ```bash
     cd frontend_app/frontend
     npm run dev
     ```
   - **Backend:** 
     ```bash
     cd ../backend
     nodemon src/index.js
     ```

