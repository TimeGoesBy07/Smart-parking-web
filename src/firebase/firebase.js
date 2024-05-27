import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDHvymtZYto_5ShBhQKNpnBen1vPrHOo_0",
  authDomain: "smart-parking-369015.firebaseapp.com",
  databaseURL: "https://smart-parking-369015-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-parking-369015",
  storageBucket: "smart-parking-369015.appspot.com",
  messagingSenderId: "331957411787",
  appId: "1:331957411787:web:1911fbdd736b713dd4204e",
  measurementId: "G-XBC0F1EQDY"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)