# Halo Earth - Coral Conservation Platform

Halo Earth is a premium, mobile-responsive web platform dedicated to coral reef conservation. Built with **Angular 20** and **Firebase**, it provides an immersive experience for users to learn about marine ecosystems, track conservation efforts via interactive maps, and support global initiatives through a secure donation system.

## ✨ Key Highlights

- **Premium UI/UX**: Modern glassmorphism design with full-screen cinematic backgrounds.
- **Interactive Reef Mapping**: Real-time tracking of conservation sites using Leaflet.js.
- **Comprehensive CMS**: Data-driven admin dashboard for managing all platform content.
- **Secure Donations**: Integrated QR-code based donation system with manual verification workflows.

## 🚀 Features

### 🌐 Public Portal
- **Interactive Map**: Explore active conservation stations and expanding reef projects worldwide.
- **Coral Dictionary**: A searchable, filterable educational resource for coral species and habitats.
- **Partner Programs**: Directory of conservation organizations with detailed profiles.
- **News & Insights**: Blog section with rich-text articles and category filtering.
- **Newsletter Subscription**: Targeted updates based on user interests (Marine Research, Volunteer, etc.).
- **Photo Gallery**: Immersive lightbox gallery showcasing reef restoration progress.
- **Secure Donations**: Form-based donations with unique reference generation and QR support.

### 🛡️ Management Dashboard (Admin)
- **Dashboard Overview**: Centralized view of donation statistics, recent leads, and platform activity.
- **User Management**: Support for **Super Admin** and **Admin** roles with secure 초대 (invite) and audit capabilities.
- **Content CRUD**: Full lifecycle management for Partners, Coral Species, Articles, and Gallery assets.
- **Donation & Lead Tracking**: Workflow tools to verify manual transfers and manage volunteer/interest leads.
- **Site Settings**: Dynamic configuration of site name, social links, contact info, and SEO metadata.

## 🛠️ Technology Stack

- **Framework**: [Angular 20+](https://angular.dev/)
- **State & Logic**: Signals-based architecture for reactive UI.
- **Styling**: Bootstrap 5 with custom SCSS and Glassmorphism effects.
- **Backend-as-a-Service**: Firebase
  - **Firestore**: Real-time NoSQL database.
  - **Authentication**: Secure email/password auth with role-based access control (RBAC).
  - **Cloud Storage**: Optimized hosting for media assets.
  - **Hosting**: Fast, global CDN deployment.
- **Third-Party Libraries**:
  - `Leaflet`: Interactive map integration.
  - `ngx-quill`: Pro-grade rich text editor for content creators.
  - `angularx-qrcode`: Dynamic QR reference generation.
  - `Bootstrap Icons`: Modern iconography.

## 📦 Project Structure

```text
src/app/
├── components/          # Reusable UI components (Headers, Sidebars, etc.)
├── layouts/             # Public and Admin layout wrappers
├── models/              # TypeScript interfaces for data consistency
├── pages/
│   ├── public/          # Consumer-facing pages (Home, Map, Dictionary)
│   └── admin/           # Secured management modules
├── services/            # Core business logic and Firebase integration
└── environments/        # Project configuration and API keys
```

## ⚙️ Prerequisites

- **Node.js**: v18.x or v20.x (LTS recommended)
- **Angular CLI**: v20.1.4 or higher
- **Firebase Account**: For database and authentication setup.

## 🛠️ Installation & Setup

1. **Clone & Install**:
   ```bash
   git clone <repository-url>
   cd halo-earth
   npm install
   ```

2. **Environment Configuration**:
   - Create `src/environments/environment.ts` based on the template.
   - Add your Firebase SDK configuration keys.
   - *Note: These files are gitignored for security.*

3. **Firebase Rules**:
   - Deploy the provided `firestore.rules` and `storage.rules` to ensure data security.

4. **Run Development Server**:
   ```bash
   ng serve
   ```
   Access at `http://localhost:4200`.

## 🧪 Testing

Execute unit tests via Karma:
```bash
ng test
```

## 📄 License & Security

For detailed security implementation details, please refer to [SECURITY.md](./SECURITY.md).
