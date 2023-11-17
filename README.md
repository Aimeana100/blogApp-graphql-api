# GraphQL API for Blog App with Authentication and Authorization

This repository contains the GraphQL API backend for a blog application, offering user authentication, registration, post management, and role-based authorization features. The API is designed to integrate seamlessly with a frontend application, providing a secure and efficient way to manage users and blog posts.

## Features

- **User Authentication and Registration:**
  - Secure user registration and login functionality.
  - Password hashing for enhanced security.

- **Post Management:**
  - Authenticated users can create, edit, and delete their own posts.
  - Posts are accessible with author details and creation dates.

- **Authorization:**
  - Role-based authorization to control access to certain features.
  - Only user will see the unpublished posts when authenticated and authorized as the author of them

## Tech Stack

- **Backend:**
  - Node.js with Express for a robust server.
  - PostgreSQL for storing user information and blog posts.
  - GraphQL API for efficient communication with the frontend.

- **Authentication:**
  - JSON Web Tokens (JWT) for secure user authentication.

## Getting Started

1. Clone the repository:

   ```bash

   git clone https://github.com/Aimeana100/blogApp-graphql-api.git
   ```

2. Install dependencies:

   ```code
   cd blogApp-graphql-api
   npm install

   ```

3. Configure environment variables:

   - Create a .env file in the root of the project and add the following variables:

   - Set up environment variables for PostgreSQL connection, JWT secret, etc.

4. Run the application:

```bash
npm run dev
```

## Access the GraphQL playground at <http://localhost:4000> in your browser
