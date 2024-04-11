// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "homesn-82d03.firebaseapp.com",
	projectId: "homesn-82d03",
	storageBucket: "homesn-82d03.appspot.com",
	messagingSenderId: "841965431954",
	appId: "1:841965431954:web:5c808f358d3e6dfbcb8a4b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
