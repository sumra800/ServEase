# ServEase Backend API

Node.js/Express backend for ServEase platform with MongoDB and JWT authentication.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory:

```bash
cp env.example .env
```

Edit `.env` and update the following:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A random secret string for JWT tokens
- `PORT`: Server port (default: 5000)

### 3. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally
- Use: `mongodb://localhost:27017/servease`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Use: `mongodb+srv://username:password@cluster.mongodb.net/servease`

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Services

- `GET /api/services` - Get all available services

### Bookings

- `GET /api/bookings` - Get user bookings (Protected)
- `POST /api/bookings` - Create a new booking (Protected)

### Health Check

- `GET /api/health` - Check API status

## Example API Requests

### Register User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main St",
  "role": "client"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "role": "client"
}
```

### Get Current User (Protected)
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

## Technology Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Project Structure

```
server/
├── models/
│   └── User.js          # User model/schema
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── bookings.js      # Booking routes
│   └── services.js      # Service routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── server.js            # Main server file
├── package.json
└── .env                 # Environment variables (create this)
```

