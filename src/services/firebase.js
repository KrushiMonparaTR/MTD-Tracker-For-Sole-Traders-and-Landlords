import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig, DEMO_MODE } from '../config/firebase';

// Initialize Firebase only if not in demo mode
let app = null;
let auth = null;
let db = null;
let storage = null;

if (!DEMO_MODE) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

export { auth, db, storage };
export default app;
