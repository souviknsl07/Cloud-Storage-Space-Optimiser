import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_z_W-nvf6_i3ji7lRpqgsqksJK6W1KD4",
  authDomain: "storage-optimizer-b4052.firebaseapp.com",
  projectId: "storage-optimizer-b4052",
  storageBucket: "storage-optimizer-b4052.appspot.com",
  messagingSenderId: "717151032132",
  appId: "1:717151032132:web:91df198b38faa0c9457d11",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
