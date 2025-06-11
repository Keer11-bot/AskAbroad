// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFReODWtbyghcbdkbRQJmYj7LTCWiwUvE",
  authDomain: "askabroad-2117f.firebaseapp.com",
  databaseURL: "https://askabroad-2117f-default-rtdb.firebaseio.com",
  projectId: "askabroad-2117f",
  storageBucket: "askabroad-2117f.firebasestorage.app",
  messagingSenderId: "998245554629",
  appId: "1:998245554629:web:9b994e5f39601ba3ee53ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;