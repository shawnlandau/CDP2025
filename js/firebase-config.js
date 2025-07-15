// Firebase Configuration
// TODO: Replace the empty config below with your actual Firebase config from console
// Go to: https://console.firebase.google.com/ → Your Project → Project Settings → Your Apps → Add App → Web
// Then copy the firebaseConfig object and paste it here:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable Firestore offline persistence
db.enablePersistence()
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Persistence failed - multiple tabs open');
    } else if (err.code == 'unimplemented') {
      // Browser doesn't support persistence
      console.log('Persistence not supported');
    }
  });

// Export for use in other files
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;
