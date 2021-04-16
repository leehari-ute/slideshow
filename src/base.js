import firebase from "firebase/app"
import "firebase/storage"
import "firebase/firestore"
const firebaseConfig = {
    apiKey: "AIzaSyBoGZiELZtBaznfL3mdFF3m7vSTKAd_eMU",
    authDomain: "demohosting-3ae0c.firebaseapp.com",
    projectId: "demohosting-3ae0c",
    storageBucket: "demohosting-3ae0c.appspot.com",
    messagingSenderId: "577399692354",
    appId: "1:577399692354:web:3bd04e3174037b864961db",
    measurementId: "G-1J326DWH78"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage= firebase.storage()
export {storage,firebase as fire }