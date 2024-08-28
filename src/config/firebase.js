// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7AmwPoZ3RtAbQYzeP-wAI21HQo5PiPKs",
  authDomain: "revisaoexpo.firebaseapp.com",
  projectId: "revisaoexpo",
  storageBucket: "revisaoexpo.appspot.com",
  messagingSenderId: "133314740799",
  appId: "1:133314740799:web:9f56b96e9bb76fd30b2e8a",
  measurementId: "G-FT7PRPP06T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);