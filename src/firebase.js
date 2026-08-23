// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYKhaF6RXwQ9IkgsrGrrmpLlZcynas-Kg",
  authDomain: "focusgo.firebaseapp.com",
  projectId: "focusgo",
  storageBucket: "focusgo.firebasestorage.app",
  messagingSenderId: "448849450957",
  appId: "1:448849450957:web:4526b78915368821299684",
  measurementId: "G-X82G1K5W0Y",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    // একসাথে একাধিক ট্যাব খোলা থাকলে এটা হতে পারে — শুধু একটা ট্যাবেই persistence চলবে, সমস্যা না
  }
});

export const googleProvider = new GoogleAuthProvider();
// প্রতিবার Google sign-in-এ account picker force করে দেখানোর জন্য —
// নাহলে browser-এ আগে থেকে লগইন থাকা account দিয়ে auto sign-in হয়ে যায়।
googleProvider.setCustomParameters({ prompt: "select_account" });
