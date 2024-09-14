Abbey FullStack Challenge
Overview
This is a full-stack application built with React, Node.js, Express, TypeScript, and PostgreSQL that implements a user authentication system, user account management, and relationships between users (friends/followers). The app uses OAuth for secure authentication and allows users to manage their profile, follow/unfollow others, and handle session management.

Tech Stack
Frontend: React
Backend: Node.js, Express, TypeScript
Database: PostgreSQL
Authentication: OAuth (Google)
API Communication: REST
Session Management: JWT (JSON Web Tokens)
Features
Authentication: Login/Logout using OAuth (Google)
User Profiles: Each user can store and retrieve account-specific information.
Relationships: Users can follow and unfollow each other. The application tracks relationships (friends/followers).
Session Handling: JWT tokens are used for user sessions with token validation and expiration.
Project Structure

├── client/                  # React frontend
│   ├── public/              # Public assets
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API calls to the backend
│   │   └── App.tsx          # Main App component
│   └── package.json
├── server/                  # Node.js backend
│   ├── controllers/         # Express route controllers
│   ├── middlewares/         # Auth and error middlewares
│   ├── services/            # Service layer for business logic
│   ├── routes/              # API routes
│   ├── db/                  # Database configuration
│   ├── utils/               # Helper functions (e.g., JWT utils)
│   ├── app.ts               # Express application entry point
│   └── package.json
├── database/                # SQL scripts for database setup
├── README.md
└── .env                     # Environment variables
