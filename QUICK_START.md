# Wag & Wander Pet Care - Quick Start Guide

## Fastest Path to Deployment (30 minutes)

### 1. Install Dependencies (2 min)
```bash
cd wag-wander-petcare
npm install
```

### 2. Firebase Setup (10 min)

**Create Project**
1. Visit https://console.firebase.google.com/
2. Create new project: "wag-wander-petcare"
3. Disable Google Analytics

**Enable Services**
1. Authentication → Enable Email/Password
2. Firestore Database → Create database (Production mode)
3. Storage → Get started (Production mode)

**Get Config**
1. Project Settings → Your apps → Web
2. Copy firebaseConfig values

**Deploy Rules**
```bash
npm install -g firebase-tools
firebase login
firebase init  # Select Firestore + Storage, use existing project
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

**Create Settings Document**
In Firestore console, create collection `settings`, document `config`:
```json
{
  "businessName": "Wag & Wander Pet Care",
  "phone": "+18458240221",
  "website": "https://wagwanderpetcare.com",
  "instagramUrl": "https://instagram.com/wagwanderpetcare",
  "paymentLinks": {
    "walk30": "https://buy.stripe.com/5kQeVfb36cOC1Qz2UV6kg05",
    "walk60": "https://buy.stripe.com/6oU6oJ4EIg0Ocvd9jj6kg04",
    "homeVisit": "https://buy.stripe.com/00wdRb3AE4i6eDldzz6kg03"
  }
}
```

**Create Admin User**
In Authentication console, add user:
- Email: `admin@wagwanderpetcare.com`
- Password: (create strong password)

### 3. Environment Setup (2 min)

Create `.env.local`:
```bash
cp .env.local.example .env.local
```

Fill in Firebase config from step 2.

### 4. Test Locally (5 min)
```bash
npm run dev
```

Visit http://localhost:3000
- Test public pages
- Login at `/admin/login` with admin credentials

### 5. Deploy to Vercel (10 min)

**Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/wag-wander-petcare.git
git push -u origin main
```

**Deploy**
1. Visit https://vercel.com/new
2. Import your GitHub repo
3. Add all environment variables from `.env.local`
4. Deploy

**Add Domain to Firebase Auth**
1. Copy your Vercel URL
2. Firebase → Authentication → Settings → Authorized domains
3. Add your Vercel domain

### 6. Done! 🎉

Your app is live. Test everything using the deployment checklist.

## Essential Files to Customize

1. **Business Info** - Already configured with provided details:
   - Phone: +1 845 824 0221
   - Instagram: @wagwanderpetcare
   - Domain: wagwanderpetcare.com

2. **Payment Links** - Already configured with provided Stripe links

3. **PWA Icons** - Add your logo:
   - `/public/icon-192.png` (192x192px)
   - `/public/icon-512.png` (512x512px)

## Common Issues

**"Permission denied" on form submit**
→ Run `firebase deploy --only firestore:rules`

**"Photo upload failed"**
→ Run `firebase deploy --only storage:rules`

**"Can't login to admin"**
→ Add your domain to Firebase Auth authorized domains

**"Payment links don't work"**
→ Check Firestore settings/config document exists

## Next Steps

After deployment:
1. Test all features using DEPLOYMENT_CHECKLIST.md
2. Submit test intake form
3. Submit test booking request
4. Login to admin and approve a request
5. Create a visit record with photos
6. Test SMS update feature

## Support

Full documentation: See README.md
Deployment checklist: See DEPLOYMENT_CHECKLIST.md

---

**Important**: Save your admin credentials securely!
