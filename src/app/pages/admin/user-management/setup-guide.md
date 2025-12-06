# User Management Setup Guide

## Initial Setup

Since you already have Firebase Auth users but no `users` collection in Firestore, follow these steps:

### Step 1: Login to Your Admin Account
1. Login with your existing Firebase Auth credentials
2. The system will automatically create a user document in Firestore with role `admin`

### Step 2: Set Your First Super Admin
1. Go to Firebase Console → Firestore Database
2. Navigate to the `users` collection
3. Find your user document (the document ID will match your Firebase Auth UID)
4. Click on the document to edit it
5. Find the `role` field and change its value from `admin` to `super-admin`
6. Save the document

### Step 3: Refresh and Verify
1. Log out and log back in, OR
2. Refresh the page
3. You should now see the "Users" menu item in the sidebar
4. You can now create and manage other admin users

## Finding Your Firebase Auth UID

To find your Firebase Auth UID:
1. Go to Firebase Console → Authentication → Users
2. Find your user email
3. The UID is displayed next to the email (it's a long string of characters)

## User Document Structure

Each user document in Firestore should have:
- `email`: User's email address
- `displayName`: User's display name
- `role`: Either `admin` or `super-admin`
- `active`: Boolean (true/false)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## Notes

- Only users with `role: 'super-admin'` can access the User Management page
- Regular `admin` users can access all other admin functions except user management
- When you create new users through the User Management page, they will automatically get a Firestore document

