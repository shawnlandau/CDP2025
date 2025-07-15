// Firebase Configuration
// The Hawks Photo App - Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbH17q1a0ft5udGpkfPsWPYb4G5Lb1jEU",
  authDomain: "the-hawks-photo-app.firebaseapp.com",
  projectId: "the-hawks-photo-app",
  storageBucket: "the-hawks-photo-app.firebasestorage.app",
  messagingSenderId: "315176217689",
  appId: "1:315176217689:web:caa6f33189013a7fe5d548",
  measurementId: "G-428LKBHM36"
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
