import firebase from "firebase/app";
import "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCjrYYw9bEcoQ9DeeRS42x6fnVVyVx5yc4",
  authDomain: "data-d08b6.firebaseapp.com",
  databaseURL: "https://data-d08b6.firebaseio.com",
  projectId: "data-d08b6",
  storageBucket: "data-d08b6.appspot.com",
  messagingSenderId: "701526392812",
  appId: "1:701526392812:web:ef825388503fa8e9660ac9",
  measurementId: "G-XH0807XN26"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();