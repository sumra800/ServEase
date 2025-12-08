# Testing Guide - ServEase Application

## Prerequisites

1. **Backend Server Running**
   ```bash
   cd server
   npm install
   npm run dev
   ```
   Server should run on `http://localhost:5000`

2. **Frontend Running**
   ```bash
   cd client
   npm install
   npm start
   ```
   Frontend should run on `http://localhost:3000`

3. **MongoDB Running**
   - Local MongoDB instance or MongoDB Atlas connection
   - Database name: `servease`

---

## Test 1: Profile Page - Avatar Upload & Profile Update

### Steps:

1. **Login/Register**
   - Navigate to `http://localhost:3000/login`
   - Login with existing account or register new one
   - Should redirect to Dashboard

2. **Access Profile Page**
   - Click "Profile Settings" from Dashboard
   - Or navigate to `http://localhost:3000/profile`

3. **Upload Avatar**
   - Click the camera icon on the avatar placeholder
   - Select an image file (JPG/PNG, max 5MB)
   - Click "Upload" button
   - **Expected**: Avatar should update immediately, success message shown

4. **Update Profile Information**
   - Change name, phone, or address
   - Click "Save Changes"
   - **Expected**: Success message, profile data updated

5. **Delete Avatar**
   - Click "Delete" button
   - Confirm deletion
   - **Expected**: Avatar removed, placeholder shown

### Expected Results:
- ✅ Avatar uploads successfully
- ✅ Profile information updates correctly
- ✅ Changes persist after page refresh
- ✅ Avatar displays correctly in navigation/user areas

---

## Test 2: Support Page - QR Codes & Payment Details

### Steps:

1. **Navigate to Support Page**
   - Click "Support" in navigation bar
   - Or go to `http://localhost:3000/support`

2. **View Payment Methods**
   - **Easypaisa**: Should show account number and QR code
   - **JazzCash**: Should show account number and QR code
   - **Bank Transfer**: Should show bank details, account number, IBAN

3. **Test Copy Functionality**
   - Click copy icon next to account numbers/IBAN
   - **Expected**: Text copied to clipboard, checkmark appears

4. **Verify QR Codes**
   - QR codes should be visible and scannable
   - **Expected**: QR codes render correctly, can be scanned with mobile apps

### Expected Results:
- ✅ All payment methods displayed
- ✅ QR codes render correctly
- ✅ Copy to clipboard works
- ✅ Professional SaaS-style design
- ✅ Responsive on mobile devices

---

## Test 3: Redux State Management

### Steps:

1. **Login Flow**
   - Login should use Redux `loginUser` thunk
   - **Expected**: User state stored in Redux, accessible via `useAppSelector`

2. **Navigation Bar**
   - Check if user info comes from Redux
   - **Expected**: NavBar uses `useAppSelector((state) => state.auth.user)`

3. **Dashboard**
   - Bookings should load via Redux `fetchBookings` thunk
   - **Expected**: Bookings in Redux store, no unnecessary API calls

4. **Profile Updates**
   - Update profile should use Redux `updateProfile` thunk
   - **Expected**: State updates in Redux, UI reflects changes immediately

### Expected Results:
- ✅ All components use Redux hooks
- ✅ State persists across navigation
- ✅ No unnecessary re-renders
- ✅ Redux DevTools shows state changes

---

## Test 4: CRUD Operations

### 4.1 Create Booking

1. Navigate to Services page
2. Select a service
3. Fill booking form (date, time, address)
4. Submit booking
5. **Expected**: Booking created, appears in Dashboard

### 4.2 Read Bookings

1. Go to Dashboard
2. **Expected**: All user bookings displayed
3. Go to Admin Dashboard → Bookings tab
4. **Expected**: All bookings visible (admin view)

### 4.3 Update Booking

1. In Dashboard, find a booking
2. Update booking status (if admin) or details
3. **Expected**: Changes saved, UI updates

### 4.4 Delete Booking

1. Find a booking in Dashboard
2. Delete booking (if allowed)
3. **Expected**: Booking removed from list

### Expected Results:
- ✅ All CRUD operations work correctly
- ✅ Changes reflect in database
- ✅ UI updates immediately
- ✅ Proper error handling

---

## Test 5: Search & Filters

### Steps:

1. **Admin Panel - User Search**
   - Go to Admin Dashboard → Users tab
   - Search by name/email
   - Filter by role/verification status
   - **Expected**: Results filter correctly

2. **Admin Panel - Booking Filters**
   - Go to Admin Dashboard → Bookings tab
   - Filter by status
   - **Expected**: Bookings filtered correctly

3. **Admin Panel - Staff Search**
   - Go to Admin Dashboard → Staff tab
   - Search staff members
   - **Expected**: Search works correctly

### Expected Results:
- ✅ Search functionality works
- ✅ Filters apply correctly
- ✅ Results update in real-time
- ✅ Pagination works (if applicable)

---

## Test 6: Authentication & Authorization

### Steps:

1. **Login**
   - Login with valid credentials
   - **Expected**: JWT token stored, user authenticated

2. **Protected Routes**
   - Try accessing `/dashboard` without login
   - **Expected**: Redirected to login

3. **Admin Routes**
   - Login as non-admin user
   - Try accessing `/admin`
   - **Expected**: Redirected to home

4. **Logout**
   - Click logout
   - **Expected**: Token cleared, redirected to home

### Expected Results:
- ✅ JWT authentication works
- ✅ Protected routes enforce authentication
- ✅ Role-based access control works
- ✅ Logout clears all auth state

---

## Test 7: Responsive Design

### Steps:

1. **Desktop View** (1920x1080)
   - Test all pages
   - **Expected**: Full layout, all features visible

2. **Tablet View** (768x1024)
   - Test navigation, forms, cards
   - **Expected**: Responsive layout, readable

3. **Mobile View** (375x667)
   - Test mobile menu, forms, cards
   - **Expected**: Mobile-friendly, touch targets adequate

### Expected Results:
- ✅ Responsive on all screen sizes
- ✅ Mobile menu works
- ✅ Forms usable on mobile
- ✅ No horizontal scrolling

---

## Common Issues & Solutions

### Issue: Avatar not uploading
- **Check**: File size < 5MB, image format (JPG/PNG)
- **Check**: Backend server running, uploads directory exists
- **Check**: CORS configured correctly

### Issue: Redux state not updating
- **Check**: Components using `useAppSelector` correctly
- **Check**: Actions dispatched properly
- **Check**: Redux DevTools for state changes

### Issue: API calls failing
- **Check**: Backend server running on port 5000
- **Check**: MongoDB connection
- **Check**: JWT token valid
- **Check**: CORS configuration

### Issue: Profile updates not saving
- **Check**: Form validation passing
- **Check**: API endpoint responding
- **Check**: Redux state updating

---

## Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ All features working as expected
- ✅ Proper error handling
- ✅ Responsive design working
- ✅ State management consistent
- ✅ API calls successful

---

## Next Steps After Testing

1. Fix any bugs found
2. Improve error messages
3. Add loading states where needed
4. Enhance user feedback
5. Optimize performance

