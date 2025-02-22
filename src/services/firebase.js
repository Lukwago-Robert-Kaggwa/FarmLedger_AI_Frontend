// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPRDBbO0ro9G6XAH40h4UsEiKn_a2jwKE",
    authDomain: "masters-9c51f.firebaseapp.com",
    databaseURL: "https://masters-9c51f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "masters-9c51f",
    storageBucket: "masters-9c51f.appspot.com",
    messagingSenderId: "735263000482",
    appId: "1:735263000482:web:260fff061e886eb943d4fb"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
