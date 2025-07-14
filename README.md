# The Hawks Photo Sharing App

A complete Firebase-powered photo sharing application for "The Hawks" baseball team to upload and view photos from Cooperstown Dreams Park (July 30 – August 5, 2024).

## 🎯 Features

### Core Functionality
- **📸 Public Photo Gallery** - Responsive grid layout showing all uploaded photos
- **🔐 Magic Link Authentication** - Passwordless sign-in via email (no passwords needed)
- **⬆️ Protected Upload System** - Only authenticated users can upload photos
- **🏷️ Player Tagging** - Optional checkbox system to tag players in photos
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **⚡ Real-time Updates** - Photos appear immediately after upload

### Technical Features
- **🔒 Secure Storage** - Photos stored in Firebase Storage with access controls
- **📊 Metadata Tracking** - Upload date, file info, and player tags stored in Firestore
- **🖼️ Image Preview** - See photos before uploading
- **📏 File Validation** - Only images under 10MB accepted
- **🎨 Modern UI** - Clean, baseball-themed design with smooth animations

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Hosting**: Netlify (static hosting)
- **No Build Tools**: Pure static files, no frameworks or bundlers

## 📋 Prerequisites

Before starting, you'll need:
- A Google account (for Firebase)
- A GitHub account (for code hosting)
- A Netlify account (for deployment)
- Basic knowledge of web development

## 🚀 Complete Setup Guide

### Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account

2. **Create New Project**
   - Click "Create a project"
   - Enter project name: `The Hawks Photo App`
   - Click "Continue"

3. **Configure Project**
   - Choose whether to enable Google Analytics (optional)
   - Click "Create project"
   - Wait for project creation to complete

### Step 2: Enable Firebase Services

#### Authentication Setup
1. **Navigate to Authentication**
   - In Firebase Console, click "Authentication" in the left sidebar
   - Click "Get started"

2. **Enable Email/Password Provider**
   - Go to "Sign-in method" tab
   - Click "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

3. **Configure Authorized Domains**
   - Go to "Settings" tab
   - Scroll to "Authorized domains"
   - Add your domain (you'll get this after Netlify deployment)
   - For now, add: `localhost` (for local testing)

#### Firestore Database Setup
1. **Create Database**
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"

2. **Choose Security Rules**
   - Select "Start in test mode" (we'll secure it later)
   - Click "Next"

3. **Choose Location**
   - Select a region close to your users (e.g., `us-central1`)
   - Click "Done"

#### Storage Setup
1. **Create Storage**
   - Click "Storage" in the left sidebar
   - Click "Get started"

2. **Choose Security Rules**
   - Select "Start in test mode" (we'll secure it later)
   - Click "Next"

3. **Choose Location**
   - Select the same region as Firestore
   - Click "Done"

### Step 3: Get Firebase Configuration

1. **Access Project Settings**
   - Click the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"

2. **Add Web App**
   - Scroll to "Your apps" section
   - Click "Add app" (</> icon)
   - Choose "Web" platform

3. **Register App**
   - Enter app nickname: `The Hawks Web App`
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

4. **Copy Configuration**
   - Copy the `firebaseConfig` object
   - It looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

### Step 4: Update Application Configuration

1. **Open Firebase Config File**
   - Navigate to `js/firebase-config.js` in your project
   - Replace the empty config with your actual Firebase config

2. **Test Configuration**
   - Open `index.html` in a web browser
   - Check browser console for any errors
   - You should see Firebase initialization messages

### Step 5: Configure Security Rules

#### Firestore Security Rules
1. **Navigate to Firestore Rules**
   - Go to Firestore Database → Rules tab
   - Replace existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /photos/{photoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

2. **Publish Rules**
   - Click "Publish"

#### Storage Security Rules
1. **Navigate to Storage Rules**
   - Go to Storage → Rules tab
   - Replace existing rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

2. **Publish Rules**
   - Click "Publish"

### Step 6: Deploy to Netlify

#### Option A: Deploy from GitHub
1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/hawks-photo-app.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [https://netlify.com/](https://netlify.com/)
   - Sign up/login with GitHub
   - Click "New site from Git"

3. **Configure Deployment**
   - Choose your GitHub repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: `.` (root)
   - Click "Deploy site"

#### Option B: Deploy from Local Files
1. **Drag and Drop**
   - Go to Netlify dashboard
   - Drag your project folder to the deploy area
   - Wait for deployment

2. **Get Your URL**
   - Netlify will provide a URL like: `https://random-name.netlify.app`
   - Note this URL for the next step

### Step 7: Update Authorized Domains

1. **Add Netlify Domain**
   - Go back to Firebase Console → Authentication → Settings
   - Add your Netlify domain to "Authorized domains"
   - Example: `random-name.netlify.app`

2. **Update Magic Link URL**
   - Open `js/login.js`
   - Find the `actionCodeSettings` object
   - Update the URL to your Netlify domain:
   ```javascript
   const actionCodeSettings = {
       url: 'https://your-site.netlify.app/upload.html',
       handleCodeInApp: true
   };
   ```

### Step 8: Test the Application

1. **Test Public Gallery**
   - Visit your Netlify URL
   - Should show empty state with upload button

2. **Test Authentication**
   - Click "Login"
   - Enter your email
   - Check email for magic link
   - Click link to sign in

3. **Test Upload**
   - After signing in, click "Upload"
   - Select an image file
   - Add player tags (optional)
   - Click "Upload Photo"
   - Verify photo appears in gallery

## 🎨 Customization Guide

### Update Player Names
1. **Edit Upload Form**
   - Open `upload.html`
   - Find the player checkboxes section
   - Replace with actual player names:

```html
<label class="checkbox-label">
    <input type="checkbox" name="players" value="John Smith">
    <span class="checkbox-custom"></span>
    John Smith
</label>
<label class="checkbox-label">
    <input type="checkbox" name="players" value="Mike Johnson">
    <span class="checkbox-custom"></span>
    Mike Johnson
</label>
<!-- Add more players as needed -->
```

### Customize Styling
1. **Change Colors**
   - Open `css/styles.css`
   - Update CSS variables for team colors:
   ```css
   :root {
     --primary-color: #1e40af;    /* Team blue */
     --secondary-color: #3b82f6;  /* Light blue */
     --accent-color: #dc2626;     /* Team red */
   }
   ```

2. **Add Team Logo**
   - Add logo to project root
   - Update header in HTML files:
   ```html
   <h1 class="logo">
     <img src="team-logo.png" alt="The Hawks" class="logo-img">
     The Hawks
   </h1>
   ```

### Update Tournament Dates
1. **Edit Date Range**
   - Open `index.html`
   - Find the hero section
   - Update the date text:
   ```html
   <p>July 30 – August 5, 2024</p>
   ```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Magic Links Not Working
**Problem**: Users don't receive magic link emails
**Solutions**:
1. Check Firebase Console → Authentication → Settings → Authorized domains
2. Verify your domain is added correctly
3. Check spam folder for magic link emails
4. Ensure Firebase project is on Blaze plan (free tier works for testing)

#### Uploads Failing
**Problem**: Photos won't upload
**Solutions**:
1. Check browser console for errors
2. Verify user is signed in
3. Check Storage rules allow authenticated uploads
4. Ensure file is under 10MB
5. Verify file is an image (JPG, PNG, GIF)

#### Photos Not Loading
**Problem**: Gallery shows empty or error
**Solutions**:
1. Check Firestore rules allow public reads
2. Verify photos exist in Firestore collection
3. Check browser console for network errors
4. Ensure Firebase config is correct

#### Authentication Errors
**Problem**: Users can't sign in
**Solutions**:
1. Verify Firebase config in `js/firebase-config.js`
2. Check authorized domains in Firebase Console
3. Ensure magic link URL is correct
4. Clear browser cache and try again

### Debug Steps

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Verify Firebase Console**
   - Check Authentication → Users
   - Check Firestore → Data
   - Check Storage → Files

3. **Test Local Development**
   ```bash
   # Serve locally with Python
   python -m http.server 8000
   # Or with Node.js
   npx serve .
   ```

## 📱 Usage Instructions

### For Team Members

#### Viewing Photos
1. Visit the main page (your Netlify URL)
2. Browse photos in the responsive grid
3. Click any photo to view full-size in new tab
4. Photos are sorted by upload date (newest first)

#### Uploading Photos
1. Click "Login" in the navigation
2. Enter your email address
3. Check your email for the magic link
4. Click the link to sign in
5. Click "Upload" in the navigation
6. Select an image file (JPG, PNG, or GIF, under 10MB)
7. Optionally tag players using checkboxes
8. Click "Upload Photo"
9. Photo will appear in the gallery immediately

#### Signing Out
1. Click "Logout" in the navigation
2. You'll be redirected to the gallery

### For Administrators

#### Monitoring Usage
1. **Firebase Console** → Authentication → Users
   - View all registered users
   - Monitor sign-in activity

2. **Firebase Console** → Firestore Database
   - View all photo metadata
   - Export data if needed

3. **Firebase Console** → Storage
   - Monitor storage usage
   - View uploaded files

#### Managing Access
1. **Add/Remove Users**
   - Users can sign up with any email
   - No manual user management needed
   - Magic links are secure and temporary

2. **Storage Management**
   - Monitor storage usage in Firebase Console
   - Set up billing alerts if needed
   - Photos are automatically organized by date

## 🔒 Security Features

### Authentication
- **Magic Links**: No passwords stored, secure email-based auth
- **Session Management**: Automatic sign-out after browser close
- **Domain Verification**: Only authorized domains can send magic links

### Data Protection
- **File Validation**: Only images under 10MB accepted
- **Access Controls**: Public read, authenticated write
- **Secure Storage**: Files stored in Firebase Storage with rules

### Privacy
- **No Personal Data**: Only email addresses stored
- **Public Gallery**: Photos visible to everyone
- **Upload Tracking**: Only uploader email stored with photos

## 📊 Performance & Limits

### Firebase Free Tier Limits
- **Authentication**: 10,000 users/month
- **Firestore**: 1GB storage, 50,000 reads/day, 20,000 writes/day
- **Storage**: 5GB storage, 1GB downloads/day

### File Limits
- **Maximum file size**: 10MB per photo
- **Supported formats**: JPG, PNG, GIF
- **No video support**: Photos only

### Browser Support
- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **Mobile browsers**: iOS Safari, Chrome Mobile
- **No IE support**: Modern JavaScript features used

## 🆘 Support & Maintenance

### Getting Help
1. **Check this README** for common solutions
2. **Review Firebase Console** for service status
3. **Check browser console** for JavaScript errors
4. **Verify network connectivity** for API calls

### Regular Maintenance
1. **Monitor storage usage** in Firebase Console
2. **Check for new Firebase features** quarterly
3. **Update security rules** if needed
4. **Backup important photos** regularly

### Emergency Procedures
1. **If uploads stop working**: Check Firebase quotas
2. **If authentication fails**: Verify domain settings
3. **If photos disappear**: Check Firestore rules
4. **If site is down**: Check Netlify status

## 📝 License & Legal

This application is for internal use by The Hawks baseball team. All photos uploaded remain the property of the uploader. The application does not claim ownership of uploaded content.

---

**Need help?** Check the troubleshooting section above or contact your team administrator. 
