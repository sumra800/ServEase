# Booking System - MongoDB Integration

## Overview

The booking system is fully integrated with MongoDB and provides complete CRUD operations for managing service bookings in the ServEase platform.

## Database Schema

### Booking Model (`server/models/Booking.js`)

The Booking schema includes:

- **User Reference**: Links booking to the user who created it
- **Service Information**: Service name and ID
- **Scheduling**: Date, time, and duration
- **Location**: Service address and special instructions
- **Status Tracking**: pending, confirmed, in-progress, completed, cancelled
- **Helper Assignment**: Assigned helper reference and name
- **Payment**: Total amount, payment method, and payment status
- **Reviews**: Rating (1-5) and review text
- **Timestamps**: createdAt and updatedAt

## API Endpoints

All booking endpoints are protected with JWT authentication.

### 1. Get All Bookings
```
GET /api/bookings
```
- Returns all bookings for the current user
- Admins can see all bookings
- Includes populated user and helper information
- Sorted by creation date (newest first)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "bookings": [...]
}
```

### 2. Get Single Booking
```
GET /api/bookings/:id
```
- Returns a specific booking by ID
- User must own the booking or be an admin

### 3. Create Booking
```
POST /api/bookings
```
**Request Body:**
```json
{
  "service": "House Help",
  "serviceId": 1,
  "date": "2024-01-15",
  "time": "09:00",
  "duration": 4,
  "address": "123 Main St",
  "specialInstructions": "Please bring cleaning supplies",
  "paymentMethod": "qr"
}
```

**Features:**
- Automatic price calculation based on service and duration
- Validates all required fields
- Links booking to authenticated user
- Sets default status to "pending"

### 4. Update Booking
```
PUT /api/bookings/:id
```
- Updates booking details
- User must own the booking or be an admin
- Validates data before saving

### 5. Delete Booking
```
DELETE /api/bookings/:id
```
- Deletes a booking
- User must own the booking or be an admin

### 6. Assign Helper (Admin Only)
```
PUT /api/bookings/:id/assign-helper
```
**Request Body:**
```json
{
  "helperId": "user_id_here",
  "helperName": "John Doe"
}
```
- Admin-only endpoint
- Assigns a helper to a booking
- Automatically changes status to "confirmed" if pending

### 7. Update Status
```
PUT /api/bookings/:id/status
```
**Request Body:**
```json
{
  "status": "confirmed"
}
```
- Valid statuses: pending, confirmed, in-progress, completed, cancelled
- User or admin can update status

### 8. Add Rating/Review
```
PUT /api/bookings/:id/rating
```
**Request Body:**
```json
{
  "rating": 5,
  "review": "Excellent service!"
}
```
- Only for completed bookings
- Rating must be between 1-5
- Only booking owner can add rating

## MongoDB Connection

The booking system connects to MongoDB through:

1. **Connection String**: Set in `.env` file as `MONGODB_URI`
2. **Connection**: Established in `server/server.js`
3. **Model**: Uses Mongoose ODM for schema and queries

## Database Indexes

The Booking model includes indexes for optimized queries:

- `user + createdAt`: Fast user booking queries
- `status`: Quick status filtering
- `date`: Efficient date-based searches
- `assignedHelper`: Helper assignment queries

## Data Flow

1. **Frontend** → Makes API request with JWT token
2. **Backend Middleware** → Verifies JWT and attaches user
3. **Route Handler** → Validates input and processes request
4. **MongoDB** → Stores/retrieves booking data
5. **Response** → Returns JSON with booking information

## Example Usage

### Creating a Booking (Frontend)
```javascript
import { bookingsAPI } from '../utils/api';

const bookingData = {
  service: 'House Help',
  serviceId: 1,
  date: '2024-01-15',
  time: '09:00',
  duration: 4,
  address: '123 Main St',
  specialInstructions: 'Please bring cleaning supplies',
  paymentMethod: 'qr'
};

const response = await bookingsAPI.create(bookingData);
```

### Fetching User Bookings
```javascript
const response = await bookingsAPI.getAll();
const bookings = response.bookings;
```

## Security Features

1. **JWT Authentication**: All endpoints require valid token
2. **User Authorization**: Users can only access their own bookings
3. **Admin Access**: Admins can access all bookings
4. **Input Validation**: All inputs validated before processing
5. **Error Handling**: Comprehensive error handling and logging

## Testing the Connection

1. **Start MongoDB**: Ensure MongoDB is running
2. **Start Server**: `cd server && npm run dev`
3. **Create Booking**: Use frontend or API client
4. **Verify**: Check MongoDB database for new booking document

## Database Queries

The system uses Mongoose queries like:

```javascript
// Find user's bookings
Booking.find({ user: userId }).sort({ createdAt: -1 })

// Find by status
Booking.find({ status: 'pending' })

// Find with populated user data
Booking.find().populate('user', 'name email')
```

## Next Steps

- [ ] Add booking cancellation logic
- [ ] Implement booking reminders
- [ ] Add booking history pagination
- [ ] Create booking analytics
- [ ] Add email notifications
