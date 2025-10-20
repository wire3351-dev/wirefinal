# Firebase Integration Guide

This application has been migrated from Supabase to Firebase for global data synchronization.

## Firebase Configuration

The Firebase configuration is already set up in `src/lib/firebase.ts` with your provided credentials:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDmcRYCkcdQqb4eeH15QhcSrXT2C74EcjE",
  authDomain: "wirebazar-c1322.firebaseapp.com",
  projectId: "wirebazar-c1322",
  storageBucket: "wirebazar-c1322.firebasestorage.app",
  messagingSenderId: "995482331483",
  appId: "1:995482331483:web:d432b29fc0ab3adf94527e"
};
```

## Firebase Setup Required

Before running the application, you need to set up your Firebase project:

### 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **wirebazar-c1322**
3. Navigate to **Firestore Database**
4. Click **Create Database**
5. Choose **Start in production mode** or **Test mode** (for development)
6. Select a location closest to your users

### 2. Firestore Security Rules

Set up security rules in the Firebase Console under **Firestore Database > Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User profiles - authenticated users can read/write their own profile
    match /user_profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Orders - users can only access their own orders
    match /orders/{orderId} {
      allow read: if request.auth != null &&
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null &&
                       request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null &&
                       resource.data.userId == request.auth.uid;
    }

    // Inquiries - users can only access their own inquiries
    match /inquiries/{inquiryId} {
      allow read: if request.auth != null &&
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }

    // Products - read by all, write by authenticated users (admin check needed)
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Enable Authentication

1. Go to **Authentication** in Firebase Console
2. Click **Get Started**
3. Enable **Anonymous** authentication method
4. This is required for user login functionality

### 4. Initialize Products Data

On first run, the owner dashboard will need to add products. Alternatively, you can run this in the browser console to initialize products:

```javascript
import { initializeProductsInFirebase } from './src/lib/firebase-init';
await initializeProductsInFirebase();
```

## Key Features

### Global Data Sync
- **Products**: All products added in the Owner Dashboard are stored in Firebase and synced globally
- **Orders**: User orders are saved to Firebase and accessible across all devices
- **Inquiries**: Customer inquiries are stored centrally
- **User Profiles**: User profile data syncs across devices

### User Authentication
- **Anonymous Authentication**: Users authenticate via OTP (email or phone)
- **Session Management**: Firebase handles user sessions
- **User Isolation**: Each user can only access their own cart and orders

### Owner Dashboard
- **Product Management**: Add, edit, and delete products globally
- **Order Management**: View and manage all customer orders
- **Inquiry Management**: View and respond to customer inquiries

## Collections Structure

### users
- `id` (string): Firebase Auth UID
- `contact` (string): Email or phone number
- `lastLoginAt` (timestamp): Last login timestamp
- `createdAt` (timestamp): Account creation date

### user_profiles
- `fullName` (string)
- `email` (string)
- `phoneNumber` (string)
- `address` (string)
- `city` (string)
- `state` (string)
- `pincode` (string)
- `companyName` (string, optional)
- `businessType` (string, optional)
- `gstNumber` (string, optional)
- `profileCompleted` (boolean)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### orders
- `orderNumber` (string): Unique order identifier
- `userId` (string): Firebase Auth UID
- `customerInfo` (object): Customer details
- `items` (array): Order items
- `subtotal` (number)
- `shippingCost` (number)
- `totalAmount` (number)
- `status` (string): Order status
- `paymentStatus` (string): Payment status
- `paymentMethod` (string)
- `qrCodeData` (string, optional)
- `transactionId` (string, optional)
- `estimatedDelivery` (string, optional)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### inquiries
- `userId` (string): Firebase Auth UID
- `userType` (string): Customer type
- `location` (string)
- `productName` (string, optional)
- `productSpecification` (string, optional)
- `quantity` (string, optional)
- `contactName` (string)
- `contactEmail` (string)
- `contactPhone` (string)
- `additionalRequirements` (string, optional)
- `status` (string): Inquiry status
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### products
- `id` (string): Unique product ID
- `name` (string)
- `brand` (string)
- `category` (string)
- `color` (array): Available colors
- `description` (string)
- `specifications` (object)
- `basePrice` (number)
- `unitType` (string): 'metres' or 'coils'
- `stockQuantity` (number)
- `imageUrl` (string)
- `isActive` (boolean)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## Issues Fixed

1. **Login/Signup Failure**: Now uses Firebase Anonymous Authentication
2. **Profile Not Loading**: Profile data now loads from Firebase with proper error handling
3. **Profile Display**: Profile page now shows all user details with edit functionality
4. **Order Placement**: Orders are properly saved to Firebase with user isolation

## Testing

1. **Test User Login**:
   - Click Login/Signup in header
   - Enter email or phone
   - Use test OTP: 123456
   - Verify login success

2. **Test Profile**:
   - Navigate to Profile
   - Click Edit Profile
   - Fill in details
   - Save and verify data persists

3. **Test Orders**:
   - Add items to cart
   - Proceed to checkout
   - Complete order
   - Verify order appears in Orders page

4. **Test Owner Dashboard**:
   - Login at /owner/login
   - Email: owner@cablehq.com
   - Password: SecurePass123!
   - Add/Edit products
   - Verify products appear on website

## Development Notes

- Firebase SDK installed: `firebase`
- All Supabase references removed
- Local storage used as fallback for offline functionality
- Real-time sync available via Firebase listeners (can be added if needed)

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules are properly configured
- Ensure user is authenticated before accessing data

### Data not syncing
- Check browser console for Firebase errors
- Verify Firebase configuration is correct
- Check network connectivity

### Products not appearing
- Run product initialization script
- Check Firestore console for products collection
- Verify security rules allow reading products

## Support

For Firebase-specific issues, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
