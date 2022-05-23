import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  // authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SEND_ID,
  // appId: process.env.FIREBASE_APP_ID,
  // measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

export const firebase = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebase);
export const dbFirestore = getFirestore(firebase);

firebaseAuth.languageCode = 'pt';