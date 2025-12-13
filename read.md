# ServEase - Project Evaluation & Technical Documentation

## 📋 Project Overview

**ServEase** is a full-stack service booking platform that connects clients with service providers (staff) for home and care services. The platform includes role-based access control with three user types: Clients, Service Providers (Staff), and Administrators.

---

## 🏗️ Architecture Overview

### Technology Stack

**Frontend:**
- React.js (with React Router for navigation)
- Redux Toolkit (state management)
- Framer Motion (animations)
- React Icons
- Tailwind CSS (styling)

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose (database)
- JWT (authentication)
- Bcrypt.js (password hashing)
- Multer (file uploads)
- Express Validator (input validation)

**Project Structure:**
```
web/
├── client/                 # React frontend
│   ├── src/
│   │   ├── Components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store & slices
│   │   ├── utils/         # API utilities
│   │   └── assets/        # Images & static files
│   └── public/
├── server/                # Express backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & upload middleware
│   └── uploads/          # User uploaded files
```

---

## 👥 User Roles & Permissions

### 1. **Client**
- Register and login
- Browse available services
- Create service bookings
- Select preferred service providers (optional)
- Make payments (JazzCash, EasyPaisa, Bank Transfer, Cash)
- Track booking status
- Rate and review completed services
- Manage profile

### 2. **Service Provider (Staff)**
- Register as staff member
- Manage profile and select services offered
- View assigned bookings
- Accept/reject booking requests
- Update booking status (in-progress, completed)
- Rate clients after service completion
- Requires admin verification to be active

### 3. **Administrator**
- Full dashboard with statistics
- User management (view, verify, delete)
- Staff verification and management
- Booking management (assign helpers, approve bookings)
- Payment verification (for bank transfers)
- View total revenue and analytics

---

## 🔄 Complete Application Flow

### **Phase 1: User Registration & Authentication**

#### Flow Diagram:
```
User → Register Page → API: POST /api/auth/register
                     ↓
              Create User in DB
                     ↓
              Generate JWT Token
                     ↓
              Return Token + User Data
                     ↓
              Store in Redux + LocalStorage
                     ↓
              Redirect to Dashboard
```

#### API Details:
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "address": "123 Main St",
    "role": "client" // or "staff"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client"
    }
  }
  ```

#### Login Flow:
```
User → Login Page → API: POST /api/auth/login
                  ↓
           Validate Credentials
                  ↓
           Generate JWT Token
                  ↓
           Return Token + User Data
                  ↓
           Store in Redux + LocalStorage
                  ↓
           Redirect Based on Role
```

---

### **Phase 2: Service Booking (Client Journey)**

#### Complete Booking Flow:
```
1. Browse Services
   ↓
   API: GET /api/services
   ↓
   Display Service Cards

2. Select Service
   ↓
   Navigate to Booking Page

3. Fill Booking Form (4 Steps)
   ↓
   Step 1: Date, Time, Duration
   Step 2: Select Provider (Optional)
           ↓
           API: GET /api/auth/providers?serviceId=X
   Step 3: Address & Instructions
   Step 4: Review & Payment Method

4. Submit Booking
   ↓
   API: POST /api/bookings
   ↓
   Create Booking in DB
   ↓
   Auto-assign Provider (if not selected)
   ↓
   Set Status: "pending_admin"

5. Payment Modal Opens
   ↓
   Select Payment Method:
   - JazzCash: API: POST /api/payments/jazzcash
   - EasyPaisa: API: POST /api/payments/easypaisa
   - Bank Transfer: API: POST /api/payments/bank-transfer
   ↓
   Create Payment Record (status: "pending" or "processing")

6. Redirect to Dashboard
```

#### Key APIs in Booking Flow:

**1. Get Services:**
- **Endpoint:** `GET /api/services`
- **Response:**
  ```json
  {
    "success": true,
    "services": [
      {
        "id": 1,
        "name": "House Help",
        "description": "Professional cleaning...",
        "price": "Starting at Rs.500/day",
        "basePrice": 500,
        "features": ["Deep cleaning", "Cooking", ...]
      }
    ]
  }
  ```

**2. Get Available Providers:**
- **Endpoint:** `GET /api/auth/providers?serviceId=1`
- **Response:**
  ```json
  {
    "success": true,
    "providers": [
      {
        "_id": "provider_id",
        "name": "Provider Name",
        "email": "provider@example.com",
        "servicesOffered": [1, 2]
      }
    ]
  }
  ```

**3. Create Booking:**
- **Endpoint:** `POST /api/bookings`
- **Request:**
  ```json
  {
    "service": "House Help",
    "serviceId": 1,
    "date": "2025-12-15",
    "time": "10:00",
    "duration": 4,
    "address": "123 Main St",
    "specialInstructions": "Please bring cleaning supplies",
    "paymentMethod": "bank-transfer",
    "assignedHelper": "provider_id" // optional
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "booking": {
      "_id": "booking_id",
      "status": "pending_admin",
      "totalAmount": 500,
      ...
    }
  }
  ```

**4. Create Payment:**
- **Endpoint:** `POST /api/payments/bank-transfer`
- **Request:**
  ```json
  {
    "bookingId": "booking_id",
    "amount": 500,
    "transactionId": "TXN123456",
    "bankName": "Bank Name",
    "accountNumber": "1234"
  }
  ```

---

### **Phase 3: Admin Approval Workflow**

#### Booking Approval Flow:
```
Booking Created (status: "pending_admin")
         ↓
Admin Dashboard → View Bookings
         ↓
Admin Assigns Helper (if not assigned)
         ↓
API: PUT /api/admin/bookings/:id/assign
         ↓
Status Changes: "pending_admin" → "pending_provider"
         ↓
Admin Approves Booking
         ↓
API: PUT /api/bookings/:id/approve-admin
         ↓
Provider Receives Notification
```

#### Staff Verification Flow:
```
Staff Registers → isVerified: false
         ↓
Admin → Staff Management
         ↓
Click Verify Button
         ↓
API: PUT /api/admin/users/:id/verify
         ↓
Toggle isVerified: true
         ↓
Staff Can Now Receive Bookings
```

#### Payment Verification Flow:
```
Bank Transfer Payment Created (status: "processing")
         ↓
Admin → Payment Management
         ↓
Click Verify Button
         ↓
API: PUT /api/admin/payments/:id/verify
         ↓
Payment Status: "processing" → "completed"
Booking PaymentStatus: → "paid"
         ↓
Amount Added to Total Revenue
```

---

### **Phase 4: Provider Response & Service Execution**

#### Provider Workflow:
```
1. Provider Login
   ↓
   View Dashboard (assigned bookings)
   ↓
   API: GET /api/bookings (filtered by assignedHelper)

2. Booking with status "pending_provider"
   ↓
   Accept or Reject
   ↓
   API: PUT /api/bookings/:id/respond-provider
   ↓
   If Accept: Status → "confirmed"
   If Reject: Status → "rejected"

3. On Service Day
   ↓
   Update Status to "in-progress"
   ↓
   API: PUT /api/bookings/:id/status

4. After Service Completion
   ↓
   Update Status to "completed"
   ↓
   Rate Client (optional)
   ↓
   API: PUT /api/bookings/:id/client-rating
```

---

### **Phase 5: Client Review & Rating**

```
Booking Status: "completed"
         ↓
Client Dashboard → View Completed Bookings
         ↓
Click "Rate Service"
         ↓
Review Modal Opens
         ↓
Submit Rating (1-5 stars) + Review Text
         ↓
API: PUT /api/bookings/:id/rating
         ↓
Rating Saved to Booking
         ↓
Visible on Provider Profile
```

---

## 🔌 Complete API Reference

### **Authentication APIs**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| POST | `/api/auth/avatar` | Upload avatar | Yes |
| DELETE | `/api/auth/avatar` | Delete avatar | Yes |
| GET | `/api/auth/providers` | Get all providers | No |

### **Booking APIs**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/bookings` | Get user's bookings | Yes |
| GET | `/api/bookings/:id` | Get single booking | Yes |
| POST | `/api/bookings` | Create booking | Yes |
| PUT | `/api/bookings/:id` | Update booking | Yes |
| DELETE | `/api/bookings/:id` | Delete booking | Yes |
| PUT | `/api/bookings/:id/status` | Update status | Yes (Staff/Admin) |
| PUT | `/api/bookings/:id/approve-admin` | Admin approve | Yes (Admin) |
| PUT | `/api/bookings/:id/respond-provider` | Provider response | Yes (Staff) |
| PUT | `/api/bookings/:id/rating` | Add rating | Yes |
| PUT | `/api/bookings/:id/client-rating` | Rate client | Yes (Staff) |
| GET | `/api/bookings/provider/:id/reviews` | Get provider reviews | No |

### **Payment APIs**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payments/jazzcash` | JazzCash payment | Yes |
| POST | `/api/payments/easypaisa` | EasyPaisa payment | Yes |
| POST | `/api/payments/bank-transfer` | Bank transfer | Yes |
| POST | `/api/payments/qr-payment` | QR payment | Yes |
| GET | `/api/payments/:id` | Get payment | Yes |
| GET | `/api/payments/booking/:id` | Get by booking | Yes |

### **Admin APIs**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/stats` | Dashboard stats | Yes (Admin) |
| GET | `/api/admin/users` | Get all users | Yes (Admin) |
| GET | `/api/admin/users/:id` | Get user details | Yes (Admin) |
| PUT | `/api/admin/users/:id` | Update user | Yes (Admin) |
| PUT | `/api/admin/users/:id/verify` | Verify user | Yes (Admin) |
| DELETE | `/api/admin/users/:id` | Delete user | Yes (Admin) |
| GET | `/api/admin/bookings` | Get all bookings | Yes (Admin) |
| PUT | `/api/admin/bookings/:id/assign` | Assign helper | Yes (Admin) |
| GET | `/api/admin/staff` | Get all staff | Yes (Admin) |
| GET | `/api/admin/payments` | Get all payments | Yes (Admin) |
| PUT | `/api/admin/payments/:id/verify` | Verify payment | Yes (Admin) |

### **Service APIs**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/services` | Get all services | No |

---

## 🗄️ Database Schema

### **User Model**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  role: Enum ['client', 'staff', 'admin'],
  servicesOffered: [Number], // Service IDs for staff
  isVerified: Boolean,
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Booking Model**
```javascript
{
  user: ObjectId (ref: User),
  service: String,
  serviceId: Number,
  date: Date,
  time: String,
  duration: Number,
  address: String,
  specialInstructions: String,
  totalAmount: Number,
  paymentMethod: Enum,
  paymentStatus: Enum ['pending', 'paid', 'failed'],
  status: Enum ['pending', 'pending_admin', 'pending_provider', 
                'confirmed', 'in-progress', 'completed', 
                'cancelled', 'rejected'],
  assignedHelper: ObjectId (ref: User),
  helperName: String,
  rating: Number (1-5),
  review: String,
  clientRating: Number,
  clientReview: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Payment Model**
```javascript
{
  booking: ObjectId (ref: Booking),
  user: ObjectId (ref: User),
  amount: Number,
  currency: String,
  paymentMethod: Enum ['qr', 'bank-transfer', 'cash', 
                       'jazzcash', 'easypaisa'],
  status: Enum ['pending', 'processing', 'completed', 
                'failed', 'refunded', 'cancelled'],
  transactionId: String,
  bankName: String,
  accountNumber: String,
  mobileNumber: String,
  paidAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication & Authorization

### JWT Token Flow:
```
1. User Login
   ↓
2. Server validates credentials
   ↓
3. Generate JWT with user ID
   ↓
4. Token sent to client
   ↓
5. Client stores in localStorage
   ↓
6. Every API request includes token in header:
   Authorization: Bearer <token>
   ↓
7. Server middleware validates token
   ↓
8. Attach user to request object
   ↓
9. Route handler accesses req.user
```

### Middleware Chain:
```javascript
// Protected route example
router.get('/bookings', 
  protect,              // Verify JWT token
  authorize('admin'),   // Check role
  async (req, res) => {
    // Handler code
  }
);
```

---

## 📊 State Management (Redux)

### Auth Slice:
```javascript
State: {
  user: null | UserObject,
  token: null | string,
  isAuthenticated: boolean,
  loading: boolean,
  error: null | string
}

Actions:
- registerUser
- loginUser
- getCurrentUser
- updateProfile
- uploadAvatar
- logout
```

### Booking Slice:
```javascript
State: {
  bookings: [],
  currentBooking: null,
  loading: boolean,
  error: null | string
}

Actions:
- fetchBookings
- createBooking
- updateBooking
- deleteBooking
```

---

## 🎨 Frontend Components Architecture

### Page Components:
- **Home** - Landing page with service overview
- **Services** - Browse all services with modal details
- **Booking** - Multi-step booking form
- **Dashboard** - User-specific dashboard (role-based)
- **Profile** - User profile management
- **AdminDashboard** - Admin statistics and overview
- **UserManagement** - Admin user CRUD
- **StaffManagement** - Admin staff verification
- **BookingManagement** - Admin booking oversight
- **PaymentManagement** - Admin payment verification

### Reusable Components:
- **Button** - Styled button with variants
- **Card** - Container component
- **NavBar** - Navigation with role-based links
- **PaymentModal** - Payment method selection
- **ReviewModal** - Service rating form
- **ClientReviewModal** - Client rating form

---

## 🚀 Key Features Implemented

### ✅ User Management
- Role-based registration (Client/Staff)
- JWT authentication
- Profile management with avatar upload
- Staff verification by admin

### ✅ Service Booking
- Multi-step booking wizard
- Optional provider selection
- Auto-assignment algorithm
- Date/time scheduling

### ✅ Payment Integration
- Multiple payment methods
- Payment verification workflow
- Revenue tracking
- Transaction history

### ✅ Booking Workflow
- Multi-stage approval process
- Provider acceptance/rejection
- Status tracking
- Real-time updates

### ✅ Rating & Review System
- Bidirectional ratings (Client ↔ Provider)
- Review display on provider profiles
- Average rating calculation

### ✅ Admin Dashboard
- User statistics
- Revenue analytics
- Booking management
- Payment verification

---

## 🔄 Data Flow Example: Complete Booking Lifecycle

```
1. CLIENT: Browse services
   → GET /api/services
   
2. CLIENT: Create booking
   → POST /api/bookings
   → DB: Create Booking (status: pending_admin)
   
3. CLIENT: Make payment
   → POST /api/payments/bank-transfer
   → DB: Create Payment (status: processing)
   
4. ADMIN: View pending bookings
   → GET /api/admin/bookings?status=pending_admin
   
5. ADMIN: Assign helper (if needed)
   → PUT /api/admin/bookings/:id/assign
   → DB: Update Booking (assignedHelper, status: pending_provider)
   
6. ADMIN: Approve booking
   → PUT /api/bookings/:id/approve-admin
   → DB: Update Booking (status: pending_provider)
   
7. PROVIDER: View assigned booking
   → GET /api/bookings (filtered by assignedHelper)
   
8. PROVIDER: Accept booking
   → PUT /api/bookings/:id/respond-provider
   → DB: Update Booking (status: confirmed)
   
9. PROVIDER: Start service
   → PUT /api/bookings/:id/status
   → DB: Update Booking (status: in-progress)
   
10. PROVIDER: Complete service
    → PUT /api/bookings/:id/status
    → DB: Update Booking (status: completed)
    
11. ADMIN: Verify payment
    → PUT /api/admin/payments/:id/verify
    → DB: Update Payment (status: completed)
    → DB: Update Booking (paymentStatus: paid)
    
12. CLIENT: Rate service
    → PUT /api/bookings/:id/rating
    → DB: Update Booking (rating, review)
    
13. PROVIDER: Rate client
    → PUT /api/bookings/:id/client-rating
    → DB: Update Booking (clientRating, clientReview)
```

---

## 📈 Revenue Calculation Logic

```javascript
// Total Revenue = Sum of all completed payments
const totalRevenue = await Payment.aggregate([
  { $match: { status: 'completed' } },
  { $group: { 
      _id: null, 
      total: { $sum: '$amount' } 
    } 
  }
]);

// Monthly Revenue
const monthlyRevenue = completedPayments
  .filter(payment => {
    const paymentDate = new Date(payment.paidAt);
    return paymentDate.getMonth() === currentMonth;
  })
  .reduce((sum, payment) => sum + payment.amount, 0);
```

---

## 🛡️ Security Features

1. **Password Hashing** - Bcrypt with salt rounds
2. **JWT Authentication** - Secure token-based auth
3. **Role-Based Access Control** - Middleware authorization
4. **Input Validation** - Express-validator
5. **CORS Protection** - Configured CORS policy
6. **File Upload Security** - Multer with file type validation
7. **MongoDB Injection Prevention** - Mongoose sanitization

---

## 🎯 Project Strengths

1. **Complete CRUD Operations** - All entities fully manageable
2. **Role-Based Architecture** - Clear separation of concerns
3. **Multi-Stage Workflows** - Realistic booking approval process
4. **Payment Integration** - Multiple payment methods
5. **Bidirectional Ratings** - Trust system for both parties
6. **Admin Controls** - Comprehensive management tools
7. **Responsive Design** - Mobile-friendly interface
8. **State Management** - Redux for predictable state
9. **API Organization** - RESTful design patterns
10. **Error Handling** - Comprehensive error responses

---

## 📝 Potential Improvements

1. **Real-time Notifications** - WebSocket integration
2. **Email Notifications** - Nodemailer for booking updates
3. **Advanced Search** - Filter services by location, price
4. **Calendar Integration** - Provider availability calendar
5. **Chat System** - Client-Provider messaging
6. **Analytics Dashboard** - More detailed metrics
7. **Mobile App** - React Native version
8. **Payment Gateway** - Actual Razorpay/Stripe integration
9. **Geolocation** - Map-based provider selection
10. **Multi-language Support** - i18n implementation

---

## 🏁 Conclusion

ServEase is a well-architected, full-stack service booking platform demonstrating:
- **Modern web development practices**
- **Secure authentication and authorization**
- **Complex state management**
- **RESTful API design**
- **Database modeling and relationships**
- **Role-based access control**
- **Multi-stage business workflows**

The project successfully implements a complete booking lifecycle from service discovery to payment verification and review submission, making it a comprehensive demonstration of full-stack development skills.
