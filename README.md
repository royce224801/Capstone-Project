# 🧠✍️ MindScribble - Creative Writing Platform

**Where thoughts become words, and words become stories.**

A modern MERN stack blogging platform designed for creative writers and storytellers. MindScribble provides an elegant, intuitive interface for sharing your thoughts and connecting with fellow writers.

![MindScribble](https://img.shields.io/badge/MindScribble-v1.0.0-purple?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

## 🌟 Features

### 🔐 **User Authentication**
- Secure JWT-based authentication
- User registration and login
- Protected routes and author permissions
- Persistent login sessions

### ✍️ **Creative Writing Tools**
- Rich text post creation
- Draft and publish modes  
- Tag system for content organization
- Author-only edit/delete permissions

### 🔍 **Discovery & Engagement**
- Search posts by title, content, or tags
- Like/unlike functionality
- View count tracking
- Pagination for better performance

### 🎨 **Modern UI/UX**
- Responsive design (mobile-first)
- Gradient color scheme
- Smooth animations and transitions
- Clean, distraction-free writing environment

### 🛡️ **Security & Performance**
- Input validation and sanitization
- Password hashing with bcrypt
- Rate limiting and CORS protection
- Optimized database queries

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd "MERN Stack"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Update .env file with your MongoDB connection
   # Start the server
   node index.js
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🏗️ Project Structure

```
MindScribble/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database configuration
│   ├── middleware/         # JWT authentication
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── .env               # Environment variables
│   └── index.js           # Server entry point
│
├── frontend/               # React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Authentication context
│   │   ├── pages/         # Page components
│   │   ├── App.js         # Main app component
│   │   └── App.css        # Global styles
│   └── package.json
│
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)
- `POST /api/users/verify-token` - Verify JWT token

### Posts
- `GET /api/posts` - Get all posts (with pagination/search)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/like` - Like/unlike post (protected)

## 🎨 Design Features

### Color Scheme
- **Primary Gradient**: Purple to Blue (`#667eea` to `#764ba2`)
- **Background**: Light gray (`#f8f9fa`)
- **Text**: Dark gray (`#333`)
- **Accent**: Various shades for tags and buttons

### Typography
- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Bold weights with proper hierarchy
- **Body Text**: 1.6 line height for readability

### Responsive Breakpoints
- **Desktop**: 1200px+ (3-column grid)
- **Tablet**: 768px-1199px (2-column grid)
- **Mobile**: <768px (1-column grid)

## 🛠️ Technology Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

### Frontend
- **React 18**: UI library with hooks
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **Context API**: State management
- **CSS3**: Custom responsive styling

## 📝 Usage Guide

### For Writers
1. **Sign Up**: Create your MindScribble account
2. **Login**: Access your dashboard
3. **Create**: Write your first post using the intuitive editor
4. **Organize**: Add relevant tags to categorize your content
5. **Publish**: Share your work with the community
6. **Engage**: Like and discover other writers' work

### For Readers
1. **Browse**: Explore the latest mind scribblings on the homepage
2. **Search**: Find specific topics using the search functionality
3. **Read**: Enjoy full posts with a distraction-free reading experience
4. **Interact**: Like posts you enjoy (requires account)

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Tokens**: Secure authentication with expiration
- **Input Validation**: Client and server-side validation
- **Protected Routes**: Authentication-based access control
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use cloud MongoDB
2. Update environment variables for production
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or GitHub Pages
3. Update API URLs for production

## 📈 Performance Optimization

- **Pagination**: Efficient loading of large post lists
- **Image Optimization**: Lazy loading and compression
- **Database Indexing**: Optimized queries for better performance
- **Code Splitting**: React component optimization
- **Caching**: Strategic caching for frequently accessed data

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Development Team

Built with ❤️ by passionate developers who believe in the power of creative expression.

---

**MindScribble** - *Where creativity meets technology* ✨

Start your writing journey today at `http://localhost:3000`