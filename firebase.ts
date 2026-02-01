import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD_hDpsNq60hwsEYGIAWFkn7LgLYPoD2D8",
  authDomain: "apiwada.firebaseapp.com",
  projectId: "apiwada",
  storageBucket: "apiwada.firebasestorage.app",
  messagingSenderId: "1077007378629",
  appId: "1:1077007378629:web:c1f9be4b951770b29ee8ac",
  measurementId: "G-71ZETYBFM0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
