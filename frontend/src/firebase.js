import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

//firebase 2: spq-smartgrow-mock-v2
const firebaseConfig = {
  apiKey: "AIzaSyBNyaFsF2INFppfVr2jqCobOKe_tNlN1YM",
  authDomain: "spq-smartgrow-mock-v2.firebaseapp.com",
  projectId: "spq-smartgrow-mock-v2",
  storageBucket: "spq-smartgrow-mock-v2.firebasestorage.app",
  messagingSenderId: "870376323231",
  appId: "1:870376323231:web:c16b34f7cee4f73cf28aaa",
  measurementId: "G-QZBY48BJ63",
 };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };