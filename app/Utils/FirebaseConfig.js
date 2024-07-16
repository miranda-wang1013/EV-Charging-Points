import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  // apiKey: "",
  authDomain: "ev-charging-point-426308.firebaseapp.com",
  projectId: "ev-charging-point-426308",
  storageBucket: "ev-charging-point-426308.appspot.com",
  messagingSenderId: "278269166876",
  appId: "1:278269166876:web:3f4f6521993e88ce2ca6d9",
  measurementId: "G-CYCDWBEJWK",
};

// Initialize Firebase
export default app = initializeApp(firebaseConfig);
// const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));
