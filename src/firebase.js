// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6j0F2yrDhI_pR7_5cOLZk-K4eUUK1gQY",
  authDomain: "tutorial-todo-app-ea18f.firebaseapp.com",
  projectId: "tutorial-todo-app-ea18f",
  storageBucket: "tutorial-todo-app-ea18f.firebasestorage.app",
  messagingSenderId: "324640908373",
  appId: "1:324640908373:web:3a06704617d902eebfa0dc",
  measurementId: "G-KXTFDJBZ3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };