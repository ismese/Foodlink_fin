import firebase from 'firebase/compat/app'; // firebase/compat 방식으로 임포트
import 'firebase/compat/auth';  // Firebase 인증 관련 임포트
import 'firebase/compat/database';  // Realtime Database 임포트
import 'firebase/compat/firestore';  // Firestore 임포트
import 'firebase/compat/storage';  // Firebase Storage 임포트

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDAe4Vp0vpG0j6qWKqfhBLKe_X7tLfScjM",
  authDomain: "foodlink-2b531.firebaseapp.com",
  databaseURL: "https://foodlink-2b531-default-rtdb.firebaseio.com",  // Realtime DB URL
  projectId: "foodlink-2b531",
  storageBucket: "foodlink-2b531.firebasestorage.app",
  messagingSenderId: "247328439601",
  appId: "1:247328439601:web:855b1ac29ec44e105b8410",
  measurementId: "G-89B7DRZXEC"
};

// Firebase 초기화
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();  // 이미 초기화된 앱을 사용
}

// Firebase 객체 내보내기
const db = firebase.database();  // Realtime Database 객체
const firestore = firebase.firestore();  // Firestore 객체
const storage = firebase.storage();  // Firebase Storage 객체
const FieldValue = firebase.firestore.FieldValue;  // Firestore의 FieldValue 객체
const auth = firebase.auth();  // Firebase 인증 객체

export { firebase, db, firestore, storage, FieldValue, auth };  // 필요한 객체들 내보내기
