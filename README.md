# 🍽️ Recipe App

A full-stack recipe sharing platform where users can create, view, like, and save their favorite recipes.  
Built with **TypeScript**, **Express**, **MongoDB**, and **React (Next.js)** — featuring authentication, image uploads, rate limiting, and more.

---

## 🚀 Tech Stack

### 🧠 Backend

- **Node.js** + **Express** (TypeScript)
- **MongoDB** + **Mongoose**
- **JWT Authentication**
- **Cloudinary** for image uploads
- **Multer** for file handling
- **Upstash Redis** for rate limiting
- **dotenv** for environment management

### 💻 Frontend (In Progress)

- **Next.js** (React + TypeScript)
- **Tailwind CSS** + **ShadCN UI** for styling
- **Axios** for API communication
- **React Query / TanStack Query** for data fetching
- **Framer Motion** for animations

---

## ⚙️ Features

### ✅ Backend Completed

- **User Authentication** (Register, Login, Protected Routes)
- **Recipe CRUD**
  - Create, Read, Update, Delete recipes
  - Add multiple ingredients and steps
- **Image Upload**
  - Upload recipe images via **Cloudinary**
  - Multer handles multipart form data
- **Likes & Favorites**
  - Toggle recipe likes and favorites
- **Comments System**
  - Add, delete, and view recipe comments
- **Rate Limiter**
  - Limits excessive API calls for protection
- **Data Validation**
  - Using Mongoose schema validation
- **Error Handling**
  - Centralized and consistent error responses
- **Timestamps**
  - All recipes include creation and update times

---

### Frontend (Work in Progress)

- [ ] Authentication pages (Register / Login)
- [ ] Create & Edit Recipe forms
- [ ] Recipe Feed (List all recipes)
- [ ] Recipe Details Page (with image, likes, comments, etc.)
- [ ] User Profile Page
- [ ] Responsive layout with Tailwind
- [ ] Favorites & Likes UI
- [ ] Integration with backend API

---
- Frontend Hosting: Vercel

- Backend Hosting: Render 

- CI/CD: GitHub Actions for auto-deployment

---

## Installation & Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/recipe_app.git
cd recipe_app



2️⃣ Backend Setup
cd recipe_api
npm install


Create a .env file:

PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


Then start the backend:

npm run dev


Backend will run at:
 http://localhost:8080



3️⃣ Frontend Setup (after building it)
cd recipe_client
npm install
npm run dev


Frontend will run at:
 http://localhost:3000

 Testing

You can test your API using:

Postman

or cURL commands, e.g.:

curl -X GET http://localhost:8080/api/recipes


Protected routes require a token:

-H "Authorization: Bearer <your_token>"

📁 Folder Structure
recipe_app/
│
├── recipe_api/              # Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── config/
│   └── package.json
│
├── recipe_client/           # Frontend (Next.js)
│   ├── src/
│   └── package.json
│
└── README.m
```

## 🏗️ Recipe App Architecture

                                 ┌────────────────────────┐
                                 │        User (UI)       │
                                 │  ────────────────       │
                                 │  • Explore Recipes     │
                                 │  • Add Recipe          │
                                 │  • View Favourites     │
                                 │  • Manage Profile      │
                                 └──────────┬─────────────┘
                                            │
                                            ▼
                             ┌────────────────────────────┐
                             │   Frontend (Next.js)       │
                             │                            │
                             │ • Pages (Explore, Add...)  │
                             │ • Components (Card, Form)  │
                             │ • State: Redux / TanStack  │
                             │ • API Calls via Axios      │
                             │ • Auth Context / Hooks     │
                             └──────────┬─────────────────┘
                                        │
                             (API requests / responses)
                                        │
                                        ▼
                     ┌────────────────────────────────────┐
                     │   Backend (Node.js / Express.js)   │
                     │                                   │
                     │ • Routes (/recipes, /users, /auth)│
                     │ • Controllers (Business Logic)     │
                     │ • Middleware (Auth, Error, Upload) │
                     │ • Validation & Security            │
                     └──────────┬─────────────────────────┘
                                │
                                ▼
               ┌────────────────────────────────────────────┐
               │            Database (MongoDB)              │
               │                                            │
               │ • Users Collection                         │
               │ • Recipes Collection                       │
               │ • Favourites Collection                    │
               └────────────────────────────────────────────┘
                                │
                                ▼
               ┌────────────────────────────────────────────┐
               │          Cloud Storage (Cloudinary)        │
               │                                            │
               │ • Stores Recipe Images                     │
               │ • Returns Image URLs for DB Storage        │
               └────────────────────────────────────────────┘
