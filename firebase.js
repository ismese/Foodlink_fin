import firebase from "firebase/compat/app"; // Firebase Compat 방식
import "firebase/compat/auth"; // Firebase Auth
import "firebase/compat/database"; // Firebase Realtime Database
import "firebase/compat/firestore"; // Firebase Firestore (Compat)
import "firebase/compat/storage"; // Firebase Storage
import { initializeApp } from "firebase/app"; // Firebase Modern 방식
import { getFirestore } from "firebase/firestore"; // Firestore (Modern)

// 첫 번째 Firebase 설정 (Compat 방식)
const firebaseConfig1 = {
  apiKey: "AIzaSyDAe4Vp0vpG0j6qWKqfhBLKe_X7tLfScjM",
  authDomain: "foodlink-2b531.firebaseapp.com",
  databaseURL: "https://foodlink-2b531-default-rtdb.firebaseio.com",
  projectId: "foodlink-2b531",
  storageBucket: "foodlink-2b531.firebasestorage.app",
  messagingSenderId: "247328439601",
  appId: "1:247328439601:web:855b1ac29ec44e105b8410",
  measurementId: "G-89B7DRZXEC",
};

// 두 번째 Firebase 설정 (Modern 방식)
const firebaseConfig2 = {
  apiKey: "AIzaSyAE59hzZv9hupjsicHKUf_7uW_5rLl9cmw",
  authDomain: "notice-board-830ca.firebaseapp.com",
  projectId: "notice-board-830ca",
  storageBucket: "notice-board-830ca.firebasestorage.app",
  messagingSenderId: "90778277268",
  appId: "1:90778277268:web:f9224d2c3d5ab160b0ab81",
  measurementId: "G-B7974PE1PC",
};

// 첫 번째 Firebase 초기화 (Compat 방식)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig1);
}

// 두 번째 Firebase 초기화 (Modern 방식)
const app2 = initializeApp(firebaseConfig2, "SecondaryApp");

// 첫 번째 Firebase 객체 (Compat 방식)
const auth = firebase.auth();
const firestore1 = firebase.firestore();
const realtimeDb = firebase.database();
const storage = firebase.storage();
const FieldValue = firebase.firestore.FieldValue;

// 두 번째 Firebase 객체 (Modern 방식)
const firestore2 = getFirestore(app2);

// Firestore 초기화 상태 검증
if (!firestore1) {
  throw new Error("Firestore1 (Compat) is not initialized properly.");
}

if (!firestore2) {
  throw new Error("Firestore2 (Modern) is not initialized properly.");
}

export {
  firebase,
  auth,
  firestore1,
  firestore2,
  realtimeDb,
  storage,
  FieldValue,
  app2,
};
