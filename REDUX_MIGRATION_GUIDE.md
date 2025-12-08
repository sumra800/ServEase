# Redux Toolkit Migration Guide

## Overview

The application has been migrated from Context API to Redux Toolkit for state management. This provides better performance, predictable state updates, and easier debugging.

## Redux Store Structure

```
store/
├── store.js              # Store configuration
├── hooks.js              # Typed hooks
└── slices/
    ├── authSlice.js      # Authentication state
    ├── bookingsSlice.js  # Bookings state
    └── servicesSlice.js  # Services state
```

## Usage Examples

### Accessing State

```javascript
import { useAppSelector } from '../store/hooks';

function MyComponent() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const bookings = useAppSelector((state) => state.bookings.bookings);
  const loading = useAppSelector((state) => state.auth.loading);
  
  // Component code...
}
```

### Dispatching Actions

```javascript
import { useAppDispatch } from '../store/hooks';
import { loginUser, logout, updateProfile } from '../store/slices/authSlice';
import { fetchBookings, createBooking } from '../store/slices/bookingsSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  
  // Login
  const handleLogin = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      // Login successful
    }
  };
  
  // Logout
  const handleLogout = () => {
    dispatch(logout());
  };
  
  // Fetch bookings
  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);
  
  // Create booking
  const handleCreateBooking = async (bookingData) => {
    await dispatch(createBooking(bookingData));
  };
}
```

## Available Actions

### Auth Slice
- `loginUser({ email, password })` - Login user
- `registerUser(userData)` - Register new user
- `getCurrentUser()` - Get current user data
- `updateProfile(profileData)` - Update user profile
- `uploadAvatar(file)` - Upload avatar image
- `logout()` - Logout user
- `clearError()` - Clear error state

### Bookings Slice
- `fetchBookings()` - Fetch all bookings
- `createBooking(bookingData)` - Create new booking
- `updateBooking({ id, bookingData })` - Update booking
- `deleteBooking(id)` - Delete booking
- `clearError()` - Clear error state

### Services Slice
- `fetchServices()` - Fetch all services
- `clearError()` - Clear error state

## Migration from Context API

### Before (Context API)
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { currentUser, login, logout } = useAuth();
  // ...
}
```

### After (Redux Toolkit)
```javascript
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loginUser, logout } from '../store/slices/authSlice';

function MyComponent() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  
  const handleLogin = async (email, password) => {
    await dispatch(loginUser({ email, password }));
  };
  
  const handleLogout = () => {
    dispatch(logout());
  };
  // ...
}
```

## Benefits

1. **Performance**: Redux prevents unnecessary re-renders
2. **DevTools**: Redux DevTools for debugging
3. **Predictable State**: All state changes go through reducers
4. **Async Handling**: Built-in async thunk support
5. **Type Safety**: Better TypeScript support (if migrating to TS)

## Next Steps

Components that still use Context API should be migrated to Redux:
- Login.js
- Register.js
- Dashboard.js
- Profile.js (partially uses Redux)
- AdminDashboard.js

The migration can be done incrementally - both systems can coexist during transition.

