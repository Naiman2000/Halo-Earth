# Quick Start Setup Guide

## 🚀 Getting Started

### 1. Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd halo-earth

# Install dependencies
npm install
```

### 2. Configure Environment (REQUIRED)

**⚠️ IMPORTANT: You must configure your Firebase credentials before running the app!**

```bash
# Copy template files to create your environment files
cp src/environments/environment.template.ts src/environments/environment.ts
cp src/environments/environment.prod.template.ts src/environments/environment.prod.ts
```

### 3. Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ → **Project Settings**
4. Scroll to **Your apps** section
5. Click on your web app (or create one)
6. Copy the configuration object

### 4. Update Environment Files

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "paste-your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
  }
};
```

Do the same for `src/environments/environment.prod.ts` (set `production: true`).

### 5. Run the Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`

## 🔐 Security Notes

- **Never commit** your actual `environment.ts` or `environment.prod.ts` files
- These files are already in `.gitignore`
- Only commit the `.template.ts` files
- See [SECURITY.md](./SECURITY.md) for detailed security guidelines

## 📝 Firebase Setup Checklist

Before running the app, ensure you have:

- [ ] Created a Firebase project
- [ ] Enabled Authentication (Email/Password)
- [ ] Created Firestore Database
- [ ] Enabled Storage
- [ ] Configured Security Rules (see `firestore.rules`)
- [ ] Copied environment template files
- [ ] Added your Firebase configuration
- [ ] Verified `.gitignore` includes environment files

## 🆘 Troubleshooting

**Error: "Firebase configuration not found"**
- Make sure you've copied and configured the environment files

**Error: "Permission denied"**
- Check your Firebase Security Rules in the Firebase Console
- Ensure you've deployed your rules: `firebase deploy --only firestore:rules`

**API Key Issues**
- Verify your API key is correct in the environment file
- Check domain restrictions in Google Cloud Console
- See [SECURITY.md](./SECURITY.md) for key security best practices

## 📚 Additional Resources

- [Full README](./README.md)
- [Security Guidelines](./SECURITY.md)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Angular Documentation](https://angular.dev/)
