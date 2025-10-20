import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDmcRYCkcdQqb4eeH15QhcSrXT2C74EcjE",
  authDomain: "wirebazar-c1322.firebaseapp.com",
  projectId: "wirebazar-c1322",
  storageBucket: "wirebazar-c1322.firebasestorage.app",
  messagingSenderId: "995482331483",
  appId: "1:995482331483:web:d432b29fc0ab3adf94527e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
