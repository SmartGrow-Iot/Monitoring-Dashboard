import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDX-gNchplUV1oC2W9AEb1D0A3TDbkNrCU",
  authDomain: "spq-smartgrow-mock.firebaseapp.com",
  projectId: "spq-smartgrow-mock",
  storageBucket: "spq-smartgrow-mock.firebasestorage.app",
  messagingSenderId: "784340191510",
  appId: "1:784340191510:web:12af7b1a229b09b5922837",
  measurementId: "G-QZBY48BJ63"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };