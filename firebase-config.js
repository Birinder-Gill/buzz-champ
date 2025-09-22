// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAH-GOwjKXVGlFmB5MuYhltEK2SxeWVYcc",
  authDomain: "buzzer-champions.firebaseapp.com",
  projectId: "buzzer-champions",
  storageBucket: "buzzer-champions.firebasestorage.app",
  messagingSenderId: "370871207806",
  appId: "1:370871207806:web:aae69f597004c3c043d52f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };