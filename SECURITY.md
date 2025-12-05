# Security Guidelines

## Overview

This document outlines the security measures implemented in the Halo Earth project to protect sensitive data, particularly Firebase API keys and configuration.

## API Key Security

### Why Firebase API Keys Need Protection

While Firebase API keys for web applications are designed to be included in client-side code and are not secret by themselves, they should still be protected from unauthorized access through:

1. **Firebase Security Rules** (Primary Protection)
2. **Version Control Protection** (Prevent key exposure)
3. **Domain Restrictions** (Limit key usage to authorized domains)

### Implementation

#### 1. Environment File Protection

We use a template-based approach to prevent accidental commits of sensitive data:

- **Template Files** (Committed to Git):
  - `src/environments/environment.template.ts`
  - `src/environments/environment.prod.template.ts`

- **Actual Environment Files** (Gitignored, not committed):
  - `src/environments/environment.ts`
  - `src/environments/environment.prod.ts`

#### 2. Setup Instructions

**First-time Setup:**

```bash
# 1. Copy template files to create your local environment files
cp src/environments/environment.template.ts src/environments/environment.ts
cp src/environments/environment.prod.template.ts src/environments/environment.prod.ts

# 2. Edit the files and replace placeholders with your Firebase config
# Get your config from: https://console.firebase.google.com/
```

**Getting Your Firebase Configuration:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon → Project Settings
4. Scroll to "Your apps" section
5. Copy the configuration values

#### 3. What to Do If Keys Are Exposed

If API keys are accidentally committed to version control:

1. **Immediately rotate the exposed keys:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Navigate to Project Settings
   - Generate new API keys

2. **Remove keys from Git history:**
   ```bash
   # WARNING: This rewrites Git history. Coordinate with your team!
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch src/environments/environment.ts" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (CAUTION: This affects all team members)
   git push origin --force --all
   ```

3. **Update Firebase Security Rules** (see below)

## Firebase Security Rules

### Firestore Security Rules

Ensure your `firestore.rules` file has proper security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Public read access for certain collections
    match /partners/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /corals/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /blog/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Protected admin-only collections
    match /donations/{document} {
      allow read, write: if isAdmin();
    }
    
    match /leads/{document} {
      allow read, write: if isAdmin();
    }
    
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
      allow read: if isAdmin();
    }
  }
}
```

### Storage Security Rules

Ensure your Firebase Storage has proper security:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Public read access, admin-only write
    match /{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

## Additional Security Measures

### 1. Domain Restrictions

In the Firebase Console, restrict your API key to specific domains:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Find your API key
4. Click "Edit"
5. Under "Application restrictions", select "HTTP referrers (web sites)"
6. Add your authorized domains:
   - `localhost:4200` (for development)
   - `your-production-domain.com` (for production)

### 2. Enable App Check (Recommended)

Firebase App Check helps protect your backend resources from abuse:

1. Go to Firebase Console → App Check
2. Enable App Check for your web app
3. Configure reCAPTCHA v3 or reCAPTCHA Enterprise
4. Enforce App Check for your services

### 3. Monitor Usage

Regularly monitor your Firebase usage:

1. Check Firebase Console → Usage tab
2. Set up billing alerts
3. Review authentication logs
4. Monitor for suspicious activity

## Best Practices Checklist

- [ ] Never commit actual `environment.ts` or `environment.prod.ts` files
- [ ] Always use template files as the source of truth
- [ ] Implement proper Firebase Security Rules
- [ ] Restrict API keys to specific domains
- [ ] Enable Firebase App Check
- [ ] Monitor Firebase usage regularly
- [ ] Rotate keys if they are exposed
- [ ] Use authentication for sensitive operations
- [ ] Implement role-based access control (RBAC)
- [ ] Keep Firebase SDK and dependencies updated

## Reporting Security Issues

If you discover a security vulnerability, please email security@halo-earth.org (or your designated security contact) instead of using the public issue tracker.

## References

- [Firebase Security Documentation](https://firebase.google.com/docs/rules)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Google Cloud API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
