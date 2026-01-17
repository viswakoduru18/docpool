# 🩺 DocPool - Doctor Information Management System

A comprehensive, mobile-first Progressive Web App (PWA) for collecting and managing detailed doctor information with a powerful web dashboard for data analysis and export.

## 🚀 Live Application

**Sandbox URL**: https://3000-i321w3b6y5ke7u44rgdxx-c81df28e.sandbox.novita.ai

### Application Routes

- **Home Page**: `/` - Landing page with navigation
- **Mobile App**: `/mobile` - Mobile-first doctor information collection interface
- **Web Dashboard**: `/dashboard` - Comprehensive data management and analytics dashboard

## ✨ Key Features

### Mobile Application (Progressive Web App)
- ✅ **Mobile-First Design** - Optimized for smartphones and tablets
- ✅ **9-Section Data Collection Form** - Comprehensive doctor information capture
- ✅ **Smart Name Entry** - Separate First, Middle, Last name fields with automatic "Dr." prefix
- ✅ **Live Name Preview** - Real-time preview of full name as you type
- ✅ **Offline Capability** - PWA with service worker for offline functionality
- ✅ **Installable** - Can be installed as a native app on mobile devices
- ✅ **Multi-Step Form** - Progress indicator with 9 detailed sections
- ✅ **Real-time Validation** - Instant feedback on form inputs
- ✅ **Doctor List View** - Browse and search existing doctors
- ✅ **Quick Edit/Delete** - Manage doctor records on the go

### Web Dashboard
- ✅ **Statistics Dashboard** - Real-time overview of doctor metrics
- ✅ **Advanced Filtering** - Filter by status, category, specialization, location
- ✅ **Search Functionality** - Quick search by name, mobile, or email
- ✅ **Detailed View Modal** - Comprehensive doctor profile display
- ✅ **CSV Export** - Export doctor data for external analysis
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Activity Tracking** - Monitor engagement and interactions

## 📋 Doctor Information Captured (9 Categories)

### 1️⃣ Core Identification Details
- Doctor ID (auto-generated: DOC-2026-XXXX)
- **First Name** (required) - Automatically prefixed with "Dr."
- **Middle Name** (optional)
- **Last Name** (required)
- Full Name (auto-generated: "Dr. [First] [Middle] [Last]")
- Gender (Male/Female/Other)
- Date of Birth
- Profile Photo URL
- Mobile Number (required)
- Email ID
- WhatsApp Enabled

### 2️⃣ Professional Credentials
- Primary Qualification (MBBS/BDS/BAMS/BHMS)
- Specialization (Cardiology/Dermatology/Ortho, etc.)
- Super Specialization (DM/MCh)
- Years of Experience
- Medical Council Registration Number
- Registration Council (State/NMC)
- Registration Valid Till Date

### 3️⃣ Practice & Work Details
- Practice Type (Clinic/Hospital/Both)
- Primary Hospital Name
- Secondary Hospitals (multiple)
- Clinic Name
- OPD Days (multi-select: Mon-Sun)
- OPD Timings
- Consultation Fee (₹)
- Teleconsultation Available

### 4️⃣ Location & Reach
- State
- City
- Area/Locality
- PIN Code
- Google Maps Link
- Home Visit Available

### 5️⃣ Digital & Platform Mapping
- Listed on Mysaa
- Listed on DocSynapse
- App Login Created
- Doctor Category (Platinum/Gold/Silver)
- CME Participation
- Workshop Conductor

### 6️⃣ Referral & Network Intelligence
- Referral Capability (High/Medium/Low)
- Common Referral Specialties
- Inbound Referrals
- Outbound Referrals
- Network Strength Score (1-10)

### 7️⃣ Commercial & Compliance
- Payment Model (Fixed/Revenue Share)
- Agreement Signed
- Agreement Start Date
- Agreement End Date
- GST Registered
- GST Number

### 8️⃣ Engagement & Activity Tracking
- Last Interaction Date
- Last CME Attended
- Last Referral Date
- Engagement Status (Active/Dormant/Inactive)
- Assigned Relationship Manager

### 9️⃣ Internal Notes & Flags
- Strategic Doctor
- KOL (Key Opinion Leader)
- Special Remarks (free text)
- Compliance Flag

## 🏗️ Technology Stack

### Backend
- **Hono Framework** - Lightweight, fast web framework
- **Cloudflare D1** - SQLite-based distributed database
- **Wrangler** - Cloudflare CLI tool for development

### Frontend
- **Vanilla JavaScript** - No heavy frameworks, maximum performance
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Font Awesome** - Icon library (via CDN)
- **Axios** - HTTP client for API calls (via CDN)

### Infrastructure
- **Cloudflare Workers** - Edge runtime for global performance
- **Cloudflare Pages** - Static site hosting with edge functions
- **PM2** - Process manager for development environment

## 📊 Database Schema

### Main Table: `doctors`
Comprehensive table with 50+ fields covering all doctor information categories.

### Supporting Table: `activity_logs`
Tracks all interactions and changes to doctor records.

### Indexes
Optimized indexes on:
- doctor_id (unique)
- mobile_number
- email
- specialization
- city, state
- engagement_status
- doctor_category

## 🔧 API Endpoints

### Doctor Management
- `GET /api/doctors` - List all doctors with filtering
  - Query params: `status`, `category`, `specialization`, `city`, `state`, `search`
- `GET /api/doctors/:id` - Get single doctor details
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor information
- `DELETE /api/doctors/:id` - Delete doctor

### Analytics
- `GET /api/stats` - Get dashboard statistics
  - Total doctors
  - Active doctors
  - Category breakdown (Platinum/Gold/Silver)

### Activity Tracking
- `GET /api/activity-logs/:doctor_id` - Get activity history for a doctor

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
cd /home/user/webapp

# Install dependencies (already done)
npm install

# Build the application
npm run build

# Apply database migrations (local)
npm run db:migrate:local

# Start development server with PM2
pm2 start ecosystem.config.cjs

# Test the application
curl http://localhost:3000
```

### Development Scripts

```bash
# Start Vite dev server (alternative)
npm run dev

# Start sandbox dev server with D1 database
npm run dev:sandbox

# Build for production
npm run build

# Preview production build
npm run preview

# Database migrations (local)
npm run db:migrate:local

# Database migrations (production)
npm run db:migrate:prod

# Database console (local)
npm run db:console:local

# Clean port 3000
npm run clean-port
```

## 📱 Mobile App Usage

1. **Access the Mobile App**: Navigate to `/mobile`
2. **Browse Doctors**: View all existing doctors in a card-based layout
3. **Add New Doctor**: Tap the blue '+' button at the bottom right
4. **Fill Form**: Complete the 9-section form with doctor information
   - Navigate between sections using Next/Previous buttons
   - Required fields are marked with red asterisk (*)
5. **Save**: Tap "Save Doctor" on the final section
6. **Edit**: Tap "Edit" on any doctor card to modify information
7. **Delete**: Tap "Delete" to remove a doctor (with confirmation)

## 💻 Dashboard Usage

1. **Access Dashboard**: Navigate to `/dashboard`
2. **View Statistics**: See total doctors and category breakdowns at the top
3. **Filter Data**: Use dropdown filters for status, category, and search
4. **View Details**: Click "View" on any doctor row to see full information
5. **Export Data**: Click "Export CSV" to download all data
6. **Add Doctor**: Click "Add Doctor" to go to mobile form
7. **Delete**: Click delete icon (with confirmation)

## 📦 Deployment to Cloudflare Pages

### First-Time Deployment

```bash
# 1. Create production D1 database
npx wrangler d1 create docpool-production

# 2. Update wrangler.jsonc with the database_id from step 1

# 3. Apply migrations to production
npm run db:migrate:prod

# 4. Build the application
npm run build

# 5. Create Cloudflare Pages project
npx wrangler pages project create docpool --production-branch main

# 6. Deploy to Cloudflare Pages
npm run deploy
```

### Subsequent Deployments

```bash
# Build and deploy in one command
npm run deploy
```

## 🗂️ Project Structure

```
webapp/
├── src/
│   └── index.tsx                 # Hono backend with API routes
├── public/
│   └── static/
│       ├── mobile-app.js         # Mobile PWA JavaScript
│       ├── dashboard.js          # Dashboard JavaScript
│       ├── manifest.json         # PWA manifest
│       └── sw.js                 # Service worker for offline support
├── migrations/
│   └── 0001_initial_schema.sql   # Database schema
├── dist/                         # Build output (generated)
├── .wrangler/                    # Local D1 database (generated)
├── ecosystem.config.cjs          # PM2 configuration
├── wrangler.jsonc                # Cloudflare configuration
├── package.json                  # Dependencies and scripts
├── vite.config.ts                # Vite build configuration
└── README.md                     # This file
```

## 🔐 Security Features

- Input validation on all form fields
- SQL injection protection via parameterized queries
- CORS enabled for API routes
- Unique doctor ID generation
- Database constraints and foreign keys
- Trigger-based timestamp updates

## 📈 Performance Optimizations

- CDN-hosted libraries (Tailwind, Font Awesome, Axios)
- Database indexes on frequently queried fields
- Efficient SQL queries with proper filtering
- Edge deployment via Cloudflare Workers
- Service worker caching for offline support
- Minimal JavaScript bundle size

## 🎯 Current Status

✅ **Completed Features**:
- Mobile-first Progressive Web App with 9-section form
- Web dashboard with filtering, search, and export
- Comprehensive D1 database with full schema
- RESTful API with all CRUD operations
- Statistics and analytics dashboard
- Activity logging system
- Git repository initialized and committed
- Running successfully in sandbox environment

## 🚀 Next Steps (Recommended)

1. **Add Authentication** - Implement user login and role-based access
2. **Photo Upload** - Add profile photo upload functionality
3. **Advanced Reporting** - Generate detailed reports and visualizations
4. **Bulk Import** - CSV/Excel import for existing doctor data
5. **Email Notifications** - Alert system for important updates
6. **Mobile App Refinements** - Add more interactive features
7. **Dashboard Enhancements** - Add charts and graphs
8. **Export Options** - Add PDF and Excel export formats
9. **Deploy to Production** - Deploy to Cloudflare Pages
10. **Custom Domain** - Set up custom domain for production

## 📝 Notes

- Local development uses SQLite database in `.wrangler/state/v3/d1/`
- Production will use Cloudflare D1 distributed database
- All doctor IDs are auto-generated in format: DOC-YYYY-XXXX
- Activity logs track all create/update operations
- Mobile app is installable as PWA on iOS and Android

## 🤝 Support

For issues or questions about DocPool, please refer to the API endpoints documentation above or check the browser console for detailed error messages.

## 📄 License

This project is part of the DocPool doctor information management initiative.

---

**Built with ❤️ using Hono, Cloudflare Workers, and modern web technologies**
