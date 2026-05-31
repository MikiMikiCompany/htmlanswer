import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVVtEiSAQSiVeW3yao0y9kBxCqPqv12tU",
  authDomain: "chankokostudy.firebaseapp.com",
  projectId: "chankokostudy",
  storageBucket: "chankokostudy.firebasestorage.app",
  messagingSenderId: "308995714479",
  appId: "1:308995714479:web:f2d7418329efffd83c135a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
