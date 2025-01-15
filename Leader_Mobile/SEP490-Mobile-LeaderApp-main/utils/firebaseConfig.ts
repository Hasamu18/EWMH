import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const LEADER_TO_WORKER_COLLECTION = "leaderToWorkerNoti"
export const CUSTOMER_TO_LEADER_COLLECTION = "customerToLeaderNoti"
