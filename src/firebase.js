import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbWty-f7FR6OXoZ9OAvM_z2XB-oeArRaI",
  authDomain: "connected-duo-app.firebaseapp.com",
  projectId: "connected-duo-app",
  storageBucket: "connected-duo-app.firebasestorage.app",
  messagingSenderId: "872066328370",
  appId: "1:872066328370:web:b32ba7e3100ab960ad192b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
