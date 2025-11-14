import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD2FZQJEv-2JbyYrve9Odw6F_Y2YRYwpqQ",
  authDomain: "panelcentralweb.firebaseapp.com",
  projectId: "panelcentralweb",
  storageBucket: "panelcentralweb.firebasestorage.app",
  messagingSenderId: "1025406460370",
  appId: "1:1025406460370:web:b0e8f55f96d0b84097280b"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
