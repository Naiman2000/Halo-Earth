# Halo Earth - Coral Conservation Platform

Halo Earth is a mobile-friendly, web-based platform dedicated to coral conservation. It connects users with partner programs, provides educational resources about coral species, and facilitates donations to support conservation efforts.

## Features

### Public Website
- **Homepage**: Mission statement, key statistics, and featured partner programs.
- **Partner Programs**: Searchable directory of conservation partners with filtering options.
- **Coral Dictionary**: Educational resource with details on various coral species.
- **Blog/News**: Articles and updates on conservation efforts.
- **Donation System**: Secure donation forms with QR code support for bank transfers.
- **Contact & Interest Forms**: Easy ways for users to get in touch or express interest in volunteering.

### Admin Dashboard
- **Secure Login**: Authenticated access for administrators.
- **Dashboard Overview**: Statistics on donations, messages, and leads.
- **Content Management**: Full CRUD capabilities for Partner Programs, Coral Species, Blog Posts, and Gallery.
- **Donation & Lead Management**: Tools to view, verify, and export donation and lead data.
- **Site Settings**: Global configuration for the website.

## Technology Stack

- **Frontend**: Angular 20
- **Styling**: Bootstrap 5
- **Backend**: Firebase (Firestore, Authentication, Storage, Hosting)
- **Key Libraries**:
  - `angularx-qrcode`: For generating QR codes.
  - `ngx-quill`: Rich text editor for admin content management.
  - `@angular/fire`: Official Angular library for Firebase.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: (Latest LTS version recommended)
- **Angular CLI**: Version 20.1.4 or higher (`npm install -g @angular/cli`)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd halo-earth
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Configuration

1.  **Firebase Setup:**
    - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    - Enable **Authentication** (Email/Password).
    - Enable **Firestore Database**.
    - Enable **Storage**.

2.  **Environment Configuration:**
    - Open `src/environments/environment.ts`.
    - Replace the placeholder values with your Firebase project configuration:

    ```typescript
    export const environment = {
      production: false,
      firebase: {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
      }
    };
    ```
    - For production, update `src/environments/environment.prod.ts` similarly.

## Development Server

Run the following command to start a local development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Building

To build the project for production:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Testing

To execute unit tests via [Karma](https://karma-runner.github.io):

```bash
ng test
```

## Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
