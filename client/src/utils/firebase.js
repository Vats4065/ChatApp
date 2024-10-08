
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB5L9WQoB-9prWZVlvyQI8VrmuQQEnwpeg",
    authDomain: "chat-app-2e2e3.firebaseapp.com",
    projectId: "chat-app-2e2e3",
    storageBucket: "chat-app-2e2e3.appspot.com",
    messagingSenderId: "323820508128",
    appId: "1:323820508128:web:8a1678d398b398fcecd185",
    measurementId: "G-DPXRFRT1MG"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider()
