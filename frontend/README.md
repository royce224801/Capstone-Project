# MERN Blog Platform - Frontend

A modern React frontend for the MERN Stack blogging platform with authentication, post management, and responsive design.

## Features

- **User Authentication**: Login/Register with JWT tokens
- **Blog Management**: Create, read, update, delete posts
- **Search & Filter**: Search posts by title, content, or tags
- **Responsive Design**: Mobile-first, responsive UI
- **Protected Routes**: Authentication-based route protection
- **Real-time Updates**: Like/unlike posts, view counts
- **Pagination**: Efficient loading of large post lists

## Tech Stack

- **React 18**: Modern React with hooks
- **React Router v6**: Client-side routing
- **Axios**: HTTP client for API calls
- **CSS3**: Custom responsive styling
- **Context API**: State management for authentication

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on port 5000

### Installation

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from create-react-app

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.js       # Navigation header
│   ├── PostCard.js     # Post preview card
│   ├── PostList.js     # Post listing with pagination
│   └── ProtectedRoute.js # Route protection
├── context/
│   └── AuthContext.js  # Authentication state management
├── pages/              # Page components
│   ├── Homepage.js     # Main landing page
│   ├── Login.js        # User login
│   ├── Register.js     # User registration
│   ├── CreatePost.js   # Post creation
│   └── PostDetail.js   # Single post view
├── App.js              # Main app component with routing
├── App.css             # Global styles
└── index.js            # React entry point
```

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api` with the following endpoints:

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/verify-token` - Token verification

### Posts
- `GET /api/posts` - Get all posts (with pagination/search)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/like` - Like/unlike post (protected)

## Features Overview

### Authentication System
- JWT-based authentication with token storage
- Automatic token verification on app load
- Protected routes that redirect to login
- Persistent login state across browser sessions

### Post Management
- Rich text post creation with validation
- Tag system for post categorization
- Draft and published post states
- Author-only edit/delete permissions

### User Interface
- Clean, modern design
- Responsive layout for all devices
- Loading states and error handling
- Search functionality with debouncing
- Pagination for better performance

### Security Features
- Client-side input validation
- XSS protection through React
- Secure token handling
- Error message sanitization

## Configuration

The app uses a proxy configuration in `package.json` to connect to the backend:

```json
"proxy": "http://localhost:5000"
```

This allows API calls to use relative paths like `/api/posts` instead of full URLs.

## Development Tips

1. **Hot Reloading**: The development server automatically reloads on file changes
2. **Error Handling**: Check the browser console for detailed error messages
3. **API Testing**: Use browser developer tools to monitor network requests
4. **State Debugging**: Install React Developer Tools for state inspection

## Production Build

To create a production build:

```bash
npm run build
```

This creates optimized files in the `build` directory ready for deployment.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Maintain responsive design principles
4. Add proper error handling
5. Write descriptive commit messages