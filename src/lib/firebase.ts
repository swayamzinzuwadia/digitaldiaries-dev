import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIyCSp5bIccOXeZAxHhfu-c6K6rY2zLow",
  authDomain: "digitaldiaries-f95ec.firebaseapp.com",
  projectId: "digitaldiaries-f95ec",
  storageBucket: "digitaldiaries-f95ec.firebasestorage.app",
  messagingSenderId: "331608160202",
  appId: "1:331608160202:web:630bacfdc191487e504133",
  measurementId: "G-0EKVXFX5F9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
