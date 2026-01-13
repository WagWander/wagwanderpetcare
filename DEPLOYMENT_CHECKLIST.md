# Wag & Wander Pet Care - Deployment Checklist

Use this checklist to ensure everything is properly configured before going live.

## Pre-Deployment

### Local Development
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create `.env.local` from `.env.local.example`
- [ ] Test app locally with `npm run dev`

### Firebase Setup
- [ ] Create Firebase project
- [ ] Enable Email/Password authentication
- [ ] Create Firestore database
- [ ] Enable Firebase Storage
- [ ] Copy Firebase config to `.env.local`
- [ ] Deploy Firestore rules: `firebase deploy --only firestore:rules`
- [ ] Deploy Storage rules: `firebase deploy --only storage:rules`
- [ ] Create `settings/config` document in Firestore with payment links
- [ ] Create admin user in Firebase Auth
- [ ] Save admin credentials securely

### Stripe
- [ ] Verify all three payment links are in LIVE mode
- [ ] Test each payment link opens correctly
- [ ] Update payment links in Firestore `settings/config`

### Assets
- [ ] Create business logo
- [ ] Generate icon-192.png (192x192px)
- [ ] Generate icon-512.png (512x512px)
- [ ] Place icons in `/public` folder

## Deployment

### GitHub
- [ ] Create new repository on GitHub
- [ ] Push code to GitHub:
  ```bash
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/yourusername/wag-wander-petcare.git
  git push -u origin main
  ```

### Vercel
- [ ] Connect GitHub repository to Vercel
- [ ] Configure project settings:
  - Framework: Next.js
  - Root: ./
- [ ] Add all environment variables from `.env.local`
- [ ] Deploy project
- [ ] Verify deployment successful

### Domain Configuration
- [ ] Add custom domain in Vercel
- [ ] Configure DNS records
- [ ] Wait for SSL certificate
- [ ] Add authorized domains to Firebase Auth:
  - [ ] wagwanderpetcare.com
  - [ ] www.wagwanderpetcare.com
  - [ ] your-project.vercel.app

## Post-Deployment Testing

### Public Pages
- [ ] Visit home page - verify all buttons work
- [ ] Test "Book a Service" button → booking form
- [ ] Test "New Client Intake" → intake form
- [ ] Test "Text Me" → opens SMS
- [ ] Test "Pay Now" → payment page
- [ ] Test "Instagram" → opens Instagram
- [ ] Verify service pricing displays correctly

### New Client Intake
- [ ] Fill out owner information
- [ ] Fill out pet information
- [ ] Select behavior flags
- [ ] Upload pet photo
- [ ] Submit form
- [ ] Verify success page displays
- [ ] Check Firestore for new client document
- [ ] Check Firestore for new pet document
- [ ] Check Storage for uploaded photo

### Booking Request
- [ ] Enter phone number
- [ ] Select service type
- [ ] Choose date
- [ ] Enter time window
- [ ] Add notes
- [ ] Verify cancellation policy displays
- [ ] Submit booking
- [ ] Verify success page displays
- [ ] Check Firestore for new request document

### Payment Page
- [ ] Verify all three payment buttons display
- [ ] Click each payment button
- [ ] Verify each opens correct Stripe link in new tab
- [ ] Test completing a payment (use test mode first if available)

### Admin Login
- [ ] Visit `/admin/login`
- [ ] Enter admin credentials
- [ ] Verify successful login
- [ ] Verify redirect to dashboard

### Admin Dashboard
- [ ] Verify dashboard loads
- [ ] Check pending requests count
- [ ] Check approved requests count
- [ ] Check completed requests count
- [ ] Click on a pending request → detail page

### Admin Clients
- [ ] Navigate to Clients page
- [ ] Verify clients list displays
- [ ] Use search functionality
- [ ] Click on a client → detail page
- [ ] Verify pet information displays
- [ ] Verify pet photo displays (if uploaded)

### Admin Requests
- [ ] Navigate to Requests page
- [ ] Test filter tabs (All, Pending, Approved, Completed)
- [ ] Click on a request → detail page
- [ ] Test "Approve Request" button
- [ ] Verify status updates in Firestore
- [ ] Test "Mark as Completed & Create Visit" button

### Admin Visits
- [ ] Navigate to Visits page
- [ ] Click "New Visit" or "Create First Visit"
- [ ] Enter visit summary
- [ ] Upload multiple photos
- [ ] Verify photo previews display
- [ ] Test remove photo functionality
- [ ] Create visit record
- [ ] Verify visit appears in list
- [ ] Click on visit → detail page
- [ ] Verify photos display correctly
- [ ] Test "Send SMS Update" button
- [ ] Verify SMS opens with prefilled message

### Mobile Testing
- [ ] Test on iPhone Safari
- [ ] Test on Android Chrome
- [ ] Verify responsive design
- [ ] Test all forms on mobile
- [ ] Test photo upload on mobile
- [ ] Verify buttons are easily tappable
- [ ] Test SMS functionality on mobile

### PWA Testing
- [ ] Add to home screen on mobile
- [ ] Verify app icon displays
- [ ] Launch from home screen
- [ ] Verify app opens in standalone mode

## Security Verification

### Firestore Rules
- [ ] Try to read clients collection from public page (should fail)
- [ ] Try to read pets collection from public page (should fail)
- [ ] Try to read requests collection from public page (should fail)
- [ ] Verify public can create intake forms
- [ ] Verify public can create booking requests
- [ ] Verify public can read settings document
- [ ] Verify admin can read all collections
- [ ] Verify admin can write to all collections

### Storage Rules
- [ ] Try to list files from public page (should fail)
- [ ] Try to read pet photos from public page (should fail)
- [ ] Verify public can upload during intake
- [ ] Verify admin can read all files
- [ ] Verify admin can upload visit photos

### Authentication
- [ ] Verify `/admin` redirects to login when not authenticated
- [ ] Verify admin pages require login
- [ ] Verify public pages work without login
- [ ] Test logout functionality

## Performance

- [ ] Run Lighthouse audit
- [ ] Check mobile performance score
- [ ] Check accessibility score
- [ ] Optimize images if needed
- [ ] Verify fast page loads

## Final Checks

- [ ] Review all content for typos
- [ ] Verify contact information is correct
- [ ] Test all external links
- [ ] Verify Instagram link works
- [ ] Verify phone number formatting
- [ ] Check email addresses
- [ ] Review pricing accuracy

## Go Live

- [ ] Remove any test data from Firestore
- [ ] Remove any test photos from Storage
- [ ] Announce launch on social media
- [ ] Update Instagram bio with website link
- [ ] Share website with existing clients
- [ ] Monitor for any errors in first 24 hours

## Post-Launch Monitoring

### Daily (First Week)
- [ ] Check Vercel deployment status
- [ ] Review Firebase usage
- [ ] Monitor Firestore for new submissions
- [ ] Check for any error logs

### Weekly
- [ ] Review new client intakes
- [ ] Review booking requests
- [ ] Check payment completions
- [ ] Monitor Firebase Storage usage
- [ ] Review any user feedback

### Monthly
- [ ] Review Firebase costs
- [ ] Review Vercel costs
- [ ] Update dependencies if needed
- [ ] Backup Firestore data
- [ ] Review and optimize performance

## Emergency Contacts

**Firebase Support**: Firebase Console → Support
**Vercel Support**: Vercel Dashboard → Help
**Stripe Support**: Stripe Dashboard → Support

## Notes

Add any deployment-specific notes, issues encountered, or customizations here:

---

Deployment Date: _______________
Deployed By: _______________
Production URL: _______________
Admin Email: _______________
