import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB59z33cX149iafqjWeOrnDTrWJSmpwJ5k",
  authDomain: "prepwise-d5b92.firebaseapp.com",
  projectId: "prepwise-d5b92",
  storageBucket: "prepwise-d5b92.firebasestorage.app",
  messagingSenderId: "879177872658",
  appId: "1:879177872658:web:2da52874b30f3e18842fcb",
  measurementId: "G-9DHTX9X096"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app) ;
export const db = getFirestore(app) ;