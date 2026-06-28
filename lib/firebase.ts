import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkYs2wek-9ZrlB8WRb6mankJrmpGwWfx8",
  authDomain: "f1-project-9b1c7.firebaseapp.com",
  projectId: "f1-project-9b1c7",
  storageBucket: "f1-project-9b1c7.firebasestorage.app",
  messagingSenderId: "222745094621",
  appId: "1:222745094621:web:73ff9d787e30ffb7f5ae34",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
