import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBUqPuWx68XR5UQOAEYO6fOwxP2_OzdYoU",
  authDomain: "maisdocuras-8747a.firebaseapp.com",
  projectId: "maisdocuras-8747a",
  storageBucket: "maisdocuras-8747a.appspot.com",
  messagingSenderId: "202824958756",
  appId: "1:202824958756:web:6afd0f5e7cba3af6bbe9b1",
  measurementId: "G-4T0E4P9V0Y"
};

export const firebase = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebase);
export const dbFirestore = getFirestore(firebase);

firebaseAuth.languageCode = 'pt';