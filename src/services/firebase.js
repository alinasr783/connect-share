import { initializeApp, getApp } from "firebase/app"

let app

const firebaseConfig = {
  apiKey: "AIzaSyC6AUUcaCjY1wn26UzdsRXM8KLrnwqxhwU",
  authDomain: "connect-share-9ed73.firebaseapp.com",
  projectId: "connect-share-9ed73",
  storageBucket: "connect-share-9ed73.firebasestorage.app",
  messagingSenderId: "102666938612",
  appId: "1:102666938612:web:4052f9aab1b0d6848dd6a1",
  measurementId: "G-9TRDFV000T",
}

export function initFirebase() {
  if (app) return app
  try {
    app = getApp()
  } catch {
    app = initializeApp(firebaseConfig)
  }
  return app
}

export function getFirebaseApp() {
  return app || initFirebase()
}