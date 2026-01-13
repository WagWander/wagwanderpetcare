# Wag & Wander Pet Care

A mobile-first Progressive Web App (PWA) for a single-owner pet care business. Built with Next.js, Firebase, and Tailwind CSS.

## Features

### Public Pages (No Authentication Required)
- **Home** - Service information, pricing, and quick action buttons
- **New Client Intake** - Complete onboarding form with pet photo upload
- **Booking Request** - Service booking with date/time selection
- **Payment** - Stripe Payment Links integration

### Admin Pages (Authentication Required)
- **Dashboard** - Overview of pending, approved, and completed requests
- **Clients** - View all clients and their pet information
- **Requests** - Manage booking requests (approve/complete)
- **Visits** - Create visit records with photos and SMS updates

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase
  - Firestore (Database)
  - Firebase Storage (Photo uploads)
  - Firebase Auth (Admin only)
- **Hosting**: Vercel
- **Payments**: Stripe Payment Links
- **Repository**: GitHub

## Prerequisites

- Node.js 18+ and npm
- Firebase account
- Vercel account
- Stripe account
- GitHub account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/wag-wander-petcare.git
cd wag-wander-petcare
npm install
```

### 2. Firebase Setup

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the wizard
3. Name it "wag-wander-petcare" (or your preferred name)
4. Disable Google Analytics (optional)

#### Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Save changes

#### Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Start in **production mode** (we'll deploy rules later)
4. Choose a location close to your users
5. Click **Enable**

#### Enable Firebase Storage

1. In Firebase Console, go to **Storage**
2. Click **Get started**
3. Start in **production mode**
4. Use the same location as Firestore
5. Click **Done**

#### Get Firebase Configuration

1. In Firebase Console, go to **Project settings** (gear icon)
2. Scroll to **Your apps** section
3. Click the **Web** icon (`</>`)
4. Register your app (name: "Wag & Wander")
5. Copy the `firebaseConfig` object

#### Deploy Security Rules

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Storage
# - Use existing project: wag-wander-petcare

# When prompted for Firestore rules file: firestore.rules
# When prompted for Storage rules file: storage.rules

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

#### Create Settings Document

In Firebase Console:
1. Go to **Firestore Database**
2. Click **Start collection**
3. Collection ID: `settings`
4. Document ID: `config`
5. Add fields:
   ```
   businessName: "Wag & Wander Pet Care"
   website: "https://wagwanderpetcare.com"
   phone: "+18458240221"
   instagramUrl: "https://instagram.com/wagwanderpetcare"
   paymentLinks: (map)
     - walk30: "https://buy.stripe.com/5kQeVfb36cOC1Qz2UV6kg05"
     - walk60: "https://buy.stripe.com/6oU6oJ4EIg0Ocvd9jj6kg04"
     - homeVisit: "https://buy.stripe.com/00wdRb3AE4i6eDldzz6kg03"
   ```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Fill in your Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Business Info
NEXT_PUBLIC_BUSINESS_NAME="Wag & Wander Pet Care"
NEXT_PUBLIC_BUSINESS_PHONE="+18458240221"
NEXT_PUBLIC_BUSINESS_WEBSITE="https://wagwanderpetcare.com"
NEXT_PUBLIC_INSTAGRAM_URL="https://instagram.com/wagwanderpetcare"
```

### 4. Create Admin User

You need to create the admin user through Firebase Console:

1. Go to **Firebase Console** → **Authentication** → **Users**
2. Click **Add user**
3. Enter email and password:
   - Email: `admin@wagwanderpetcare.com` (or your preferred email)
   - Password: Create a strong password
4. Click **Add user**

**Important**: Save these credentials securely. This is the only admin account.

### 5. Stripe Payment Links

The app is configured with the provided Stripe payment links. To update them:

1. Go to **Firebase Console** → **Firestore Database**
2. Find the `settings/config` document
3. Update the `paymentLinks` map with your Stripe links

Or update them directly in code at `/app/pay/page.tsx` if you prefer hardcoded links.

### 6. Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Test the app:
- Public pages work without login
- Admin pages redirect to `/admin/login`
- Use the admin credentials you created

### 7. Deploy to Vercel

#### Initial Setup

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/wag-wander-petcare.git
git push -u origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### Add Environment Variables

In Vercel project settings:
1. Go to **Settings** → **Environment Variables**
2. Add all variables from `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_BUSINESS_NAME`
   - `NEXT_PUBLIC_BUSINESS_PHONE`
   - `NEXT_PUBLIC_BUSINESS_WEBSITE`
   - `NEXT_PUBLIC_INSTAGRAM_URL`

3. Click **Deploy**

#### Custom Domain

1. In Vercel project, go to **Settings** → **Domains**
2. Add your domain: `wagwanderpetcare.com`
3. Follow Vercel's instructions to configure DNS
4. Wait for SSL certificate to provision

#### Update Firebase Auth Domain

1. Go to **Firebase Console** → **Authentication** → **Settings**
2. Add your Vercel domain to **Authorized domains**:
   - `wagwanderpetcare.com`
   - `www.wagwanderpetcare.com`
   - Your Vercel deployment URL (e.g., `wag-wander-petcare.vercel.app`)

### 8. Post-Deployment Configuration

#### Test Everything

1. Visit your live site
2. Test public pages (intake, booking, payment)
3. Login to admin at `/admin/login`
4. Test admin features:
   - View clients
   - Approve requests
   - Create visits
   - Upload photos

#### Create PWA Icons

The app needs two icon files in the `/public` folder:
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)

These should be your business logo optimized for mobile.

## Project Structure

```
wag-wander-petcare/
├── app/
│   ├── admin/                 # Admin pages (protected)
│   │   ├── clients/          # Client management
│   │   ├── requests/         # Request management
│   │   ├── visits/           # Visit records
│   │   ├── layout.tsx        # Admin layout with auth
│   │   ├── login/            # Admin login
│   │   └── page.tsx          # Dashboard
│   ├── booking/              # Public booking
│   ├── intake/               # New client intake
│   ├── pay/                  # Payment page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── lib/
│   ├── firebase.ts           # Firebase config
│   └── auth-context.tsx      # Auth provider
├── types/
│   └── index.ts              # TypeScript types
├── public/
│   └── manifest.json         # PWA manifest
├── firestore.rules           # Firestore security rules
├── storage.rules             # Storage security rules
├── .env.local.example        # Environment variables template
├── next.config.ts            # Next.js config
├── tailwind.config.ts        # Tailwind config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

## Security

### Firestore Rules
- Public users can CREATE intake forms and booking requests
- Public users CANNOT read any data
- Admin can read/write everything
- Settings are readable by everyone (for payment links)

### Storage Rules
- Public can upload pet photos during intake only
- Public cannot list or read other files
- Admin can read/write all files

### Authentication
- Only one admin user (set up manually)
- Admin pages redirect to login if not authenticated
- Public pages work without authentication

## Updating Payment Links

Option 1: Update Firestore directly
1. Go to Firebase Console → Firestore
2. Navigate to `settings/config`
3. Update `paymentLinks` fields

Option 2: Update in code
- Edit `/app/pay/page.tsx`
- Update the default `paymentLinks` object

## Maintenance

### View Logs
```bash
# Vercel deployment logs
vercel logs

# Firebase logs
firebase functions:log
```

### Backup Database
```bash
# Export Firestore data
gcloud firestore export gs://[BUCKET_NAME]
```

### Update Dependencies
```bash
npm update
npm audit fix
```

## Troubleshooting

### Admin Can't Login
- Verify user exists in Firebase Auth
- Check authorized domains in Firebase Auth settings
- Verify environment variables in Vercel

### Photos Won't Upload
- Check Firebase Storage rules are deployed
- Verify Storage bucket name in environment variables
- Check browser console for CORS errors

### Payment Links Don't Work
- Verify Stripe links are correct in Firestore
- Check that links are LIVE mode (not TEST mode)
- Ensure settings document exists in Firestore

### Public Can't Submit Forms
- Check Firestore rules are deployed
- Verify collections are created (they'll auto-create on first write)
- Check browser console for errors

## Support

For issues or questions:
- Check Firebase Console for error logs
- Check Vercel deployment logs
- Review browser console for client-side errors
- Verify all environment variables are set correctly

## License

Proprietary - All rights reserved by Wag & Wander Pet Care
