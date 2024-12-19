import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDkO9T2C-c8LGo311mmYfX7kiRDakkT6lY",
  authDomain: "fin2024-61607.firebaseapp.com",
  projectId: "fin2024-61607",
  storageBucket: "fin2024-61607.firebasestorage.app",
  messagingSenderId: "783774345251",
  appId: "1:783774345251:web:f80d3b923cb5e0359e2996"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios que vamos a utilizar
export const storage = getStorage(app);
export const db = getFirestore(app); 