# The Hawks Photo Sharing App

A simple, static web app for "The Hawks" baseball team to upload and view photos from Cooperstown Dreams Park (July 30 – August 5, 2024).

## Features

- **Public Gallery**: View all uploaded photos in a responsive grid layout
- **Magic Link Authentication**: Passwordless sign-in via email
- **Photo Upload**: Upload photos with optional player tagging
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Firebase Integration**: Secure storage and real-time updates

## Tech Stack

- **Frontend**: Plain HTML, CSS, JavaScript
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Hosting**: Netlify-friendly static hosting

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "The Hawks Photo App"
4. Follow the setup wizard (you can disable Google Analytics if desired)

### 2. Enable Firebase Services

#### Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" provider
3. Add your domain to "Authorized domains" (for magic links)

#### Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location close to your users

#### Storage
1. Go to "Storage" → "Get started"
2. Choose "Start in test mode" (for development)
3. Select the same location as Firestore

### 3. Configure Firebase

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → "Web" (</>)
4. Register app with name "The Hawks Web App"
5. Copy the Firebase config object

### 4. Update Firebase Configuration

1. Open `js/firebase-config.js`
2. Replace the empty `firebaseConfig` object with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 5. Configure Security Rules

#### Firestore Rules
In Firebase Console → Firestore Database → Rules, replace with:

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

#### Storage Rules
In Firebase Console → Storage → Rules, replace with:

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

### 6. Deploy to Netlify

1. Push your code to a GitHub repository
2. Go to [Netlify](https://netlify.com/) and sign up/login
3. Click "New site from Git"
4. Connect your GitHub account and select your repository
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.` (root)
6. Click "Deploy site"

### 7. Update Authorized Domains

1. In Firebase Console → Authentication → Settings
2. Add your Netlify domain to "Authorized domains"
3. Update the magic link URL in `js/login.js`:

```javascript
const actionCodeSettings = {
    url: 'https://your-site.netlify.app/upload.html',
    handleCodeInApp: true
};
```

## File Structure

```
/
├── index.html          # Public gallery page
├── login.html          # Magic link authentication
├── upload.html         # Photo upload (protected)
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   ├── firebase-config.js  # Firebase configuration
│   ├── gallery.js          # Gallery functionality
│   ├── login.js            # Authentication logic
│   └── upload.js           # Upload functionality
└── README.md           # This file
```

## Usage

### For Team Members

1. **View Photos**: Visit the main page to see all uploaded photos
2. **Sign In**: Click "Login" and enter your email address
3. **Upload Photos**: After signing in, click "Upload" to add new photos
4. **Tag Players**: Optionally tag players in photos using checkboxes

### For Administrators

- Monitor uploads in Firebase Console
- Manage user access through Firebase Authentication
- View storage usage in Firebase Storage
- Export data from Firestore if needed

## Security Features

- **Authentication Required**: Only signed-in users can upload photos
- **File Validation**: Only image files under 10MB accepted
- **Secure Storage**: Files stored in Firebase Storage with access controls
- **Magic Links**: Passwordless authentication via email

## Customization

### Player Names
Edit the player checkboxes in `upload.html` to match your team roster:

```html
<label class="checkbox-label">
    <input type="checkbox" name="players" value="John Smith">
    <span class="checkbox-custom"></span>
    John Smith
</label>
```

### Styling
Modify `css/styles.css` to change colors, fonts, or layout to match your team's branding.

### Date Range
Update the date range in `index.html` if your tournament dates change.

## Troubleshooting

### Common Issues

1. **Magic links not working**: Check authorized domains in Firebase Console
2. **Uploads failing**: Verify Storage rules allow authenticated users
3. **Photos not loading**: Check Firestore rules allow public reads
4. **Authentication errors**: Ensure Firebase config is correct

### Support

For technical issues, check:
- Browser console for JavaScript errors
- Firebase Console for service status
- Network tab for failed requests

## License

This project is for internal use by The Hawks baseball team. 