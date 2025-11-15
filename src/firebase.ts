import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDH9sAkWdQHbPWjR27Hlh_ZvVjCoP8LEUc",
  authDomain: "panelweb-76d15.firebaseapp.com",
  projectId: "panelweb-76d15",
  storageBucket: "panelweb-76d15.firebasestorage.app",
  messagingSenderId: "456618044374",
  appId: "1:456618044374:web:e5a1e5c084cc165d695277"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
