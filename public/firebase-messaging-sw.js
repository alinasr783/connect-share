importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyC6AUUcaCjY1wn26UzdsRXM8KLrnwqxhwU',
  authDomain: 'connect-share-9ed73.firebaseapp.com',
  projectId: 'connect-share-9ed73',
  storageBucket: 'connect-share-9ed73.firebasestorage.app',
  messagingSenderId: '102666938612',
  appId: '1:102666938612:web:4052f9aab1b0d6848dd6a1',
  measurementId: 'G-9TRDFV000T',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || ''
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/vite.svg',
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow('/'))
})

