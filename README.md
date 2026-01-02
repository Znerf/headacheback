# Headache Tracker Backend (NestJS)

A clean, modern NestJS backend with JWT authentication (access + refresh tokens) and MongoDB integration.

## Features

- ✅ JWT Authentication with Access & Refresh Tokens
- ✅ MongoDB Integration with Mongoose
- ✅ User Signup & Login
- ✅ Secure Password Hashing with bcrypt
- ✅ Token Refresh Mechanism
- ✅ TypeScript
- ✅ Clean Architecture

## Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables

Update the `.env` file with your MongoDB password:

```env
MONGODB_URI=mongodb+srv://root:<YOUR_DB_PASSWORD>@cluster0.d1rir6r.mongodb.net/headache-tracker?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your-access-token-secret-change-this
JWT_REFRESH_SECRET=your-refresh-token-secret-change-this
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3001
```

**Important:** Replace `<YOUR_DB_PASSWORD>` with your actual MongoDB password.

### 3. Run the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- **POST** `/auth/signup` - Create new user account
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **POST** `/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **POST** `/auth/refresh` - Refresh access token
  ```json
  {
    "refreshToken": "your-refresh-token"
  }
  ```

- **POST** `/auth/logout` - Logout user (requires auth)

- **GET** `/auth/me` - Get current user profile (requires auth)

## Architecture

```
backend/
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   └── auth.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── jwt-refresh.guard.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt-refresh.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── schemas/
│   │   └── user.schema.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
├── nest-cli.json
├── package.json
└── tsconfig.json
```

## Technology Stack

- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Passport** - Authentication middleware
- **TypeScript** - Type safety

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT access tokens (15 minutes expiration)
- JWT refresh tokens (7 days expiration)
- Refresh token rotation
- Protected routes with guards
- CORS enabled for frontend

## Notes

- Access tokens expire in 15 minutes for security
- Refresh tokens expire in 7 days
- Refresh tokens are stored in the database for validation
- All passwords are hashed before storage
- CORS is configured to allow requests from `http://localhost:3000`
