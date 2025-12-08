# ServEase - Complete Setup Guide

This guide will help you set up both the frontend and backend for the ServEase platform.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Backend Setup

### 1. Navigate to server directory
```bash
cd server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/servease
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**For MongoDB Atlas:**
Replace `MONGODB_URI` with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/servease?retryWrites=true&w=majority
```

### 4. Start the backend server
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to client directory
```bash
cd client
```

### 2. Install dependencies (if not already done)
```bash
npm install
```

### 3. Create environment file (optional)
Create a `.env` file in the `client` directory if you want to change the API URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

By default, the frontend will connect to `http://localhost:5000/api`

### 4. Start the frontend
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Testing the Connection

1. Start the backend server first
2. Start the frontend
3. Open `http://localhost:3000` in your browser
4. Try registering a new user or logging in

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

### Services
- `GET /api/services` - Get all services

### Bookings
- `GET /api/bookings` - Get user bookings (requires authentication)
- `POST /api/bookings` - Create booking (requires authentication)

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running (if using local MongoDB)
- Check your connection string in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### CORS Errors
- The backend is configured to allow requests from `http://localhost:3000`
- If you change the frontend port, update CORS settings in `server/server.js`

### Authentication Not Working
- Check that the backend server is running
- Verify the API URL in the frontend
- Check browser console for errors
- Ensure JWT_SECRET is set in backend `.env`

## Project Structure

```
web/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   ├── utils/         # API utilities
│   │   └── Components/    # Reusable components
│   └── package.json
│
└── server/                 # Node.js/Express backend
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    ├── middleware/        # Auth middleware
    ├── server.js          # Main server file
    └── package.json
```

## Next Steps

1. ✅ Backend and frontend are connected
2. Implement booking model and routes
3. Add service provider management
4. Implement payment integration
5. Add admin dashboard functionality
6. Deploy to production

## Support

For issues or questions, check the server README.md for detailed API documentation.

