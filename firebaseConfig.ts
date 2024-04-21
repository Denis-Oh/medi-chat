import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBVbMDxm4Hw_3iXY8_lYv9QPMugh_n-bJ0",
    authDomain: "medi-chat-97346.firebaseapp.com",
    projectId: "medi-chat-97346",
    storageBucket: "medi-chat-97346.appspot.com",
    messagingSenderId: "70391518817",
    appId: "1:70391518817:web:2f1a71cbb170b00834bc20",
    measurementId: "G-3GLDCX89VE"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

let analytics;
if (typeof window !== 'undefined') {
  // Only initialize analytics if it's supported and window is defined
  isSupported().then((isSupported) => {
    if (isSupported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, storage, auth, analytics };
