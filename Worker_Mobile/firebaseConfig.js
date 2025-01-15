import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAqlAANcJhEjZv-NlqCujSz4rGIEaNt0IE',
  authDomain: 'sep490-mobile-pushnotification.firebaseapp.com',
  databaseURL: 'https://sep490-mobile-pushnotification.firebaseio.com',
  projectId: 'sep490-mobile-pushnotification',
  storageBucket: 'sep490-mobile-pushnotification.appspot.com',
  messagingSenderId: '1044784712307',
  appId: '1:1044784712307:android:7a4a9c79e96384beddf806',
  measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
