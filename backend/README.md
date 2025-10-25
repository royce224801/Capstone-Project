# MERN Stack Blog Backend

A secure and feature-rich backend API for a blogging platform built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **User Management**: Registration, login, profile management
- **Blog Posts**: Full CRUD operations for blog posts
- **Security**: Protected routes, input validation, and secure password storage
- **Advanced Features**: Post likes, views tracking, pagination, search, and filtering

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User schema with password hashing
│   └── Post.js              # Post schema with relationships
├── routes/
│   ├── users.js             # User authentication and profile routes
│   └── posts.js             # Blog post CRUD and management routes
├── .env                     # Environment variables (create from .env.example)
├── .gitignore               # Git ignore rules
├── index.js                 # Express server setup
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## API Endpoints

### Authentication Routes (`/api/users`)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `POST /api/users/verify-token` - Verify JWT token (protected)

### Blog Posts Routes (`/api/posts`)
- `GET /api/posts` - Get all published posts (public, with pagination)
- `GET /api/posts/:id` - Get single post by ID (public)
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected, author only)
- `DELETE /api/posts/:id` - Delete post (protected, author only)
- `POST /api/posts/:id/like` - Like/unlike post (protected)
- `GET /api/posts/user/:userId` - Get posts by specific user (public)

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd "d:\\MERN Stack\\backend"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env` file and update the values:
   ```
   MONGODB_URI=mongodb://localhost:27017/mern-blog-db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if using local MongoDB):
   ```bash
   mongod
   ```

5. **Run the server**:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## Security Features

- **Password Hashing**: Uses bcrypt with salt rounds for secure password storage
- **JWT Authentication**: Secure token-based authentication with expiration
- **Input Validation**: Comprehensive validation using Mongoose and validator
- **Protected Routes**: Middleware-based route protection
- **CORS Configuration**: Configured for secure cross-origin requests
- **Error Handling**: Centralized error handling with appropriate status codes

## Data Models

### User Schema
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  timestamps: true
}
```

### Post Schema
```javascript
{
  title: String (required, 3-200 chars),
  content: String (required, 10-10000 chars),
  author: ObjectId (ref: User, required),
  slug: String (auto-generated, unique),
  status: Enum ['draft', 'published', 'archived'],
  tags: [String] (lowercase),
  views: Number (default: 0),
  likes: [{ user: ObjectId, createdAt: Date }],
  timestamps: true
}
```

## Testing the API

You can test the API using tools like Postman, curl, or any HTTP client:

### Register a new user:
```bash
curl -X POST http://localhost:5000/api/users/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/users/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a post (with JWT token):
```bash
curl -X POST http://localhost:5000/api/posts \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post...",
    "tags": ["javascript", "nodejs", "mongodb"]
  }'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/mern-blog-db` |
| `JWT_SECRET` | JWT signing secret | Required (change in production) |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## Production Deployment

1. **Set secure environment variables**:
   - Use a strong, unique `JWT_SECRET`
   - Use a production MongoDB URI (MongoDB Atlas recommended)
   - Set `NODE_ENV=production`

2. **Security considerations**:
   - Use HTTPS in production
   - Implement rate limiting
   - Set up proper CORS origins
   - Use environment-specific configurations
   - Enable MongoDB authentication

3. **Performance optimizations**:
   - Enable MongoDB indexes
   - Implement caching where appropriate
   - Use compression middleware
   - Set up proper logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.