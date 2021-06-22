// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyAfLKLLe2dNaPVKKbXFBcxijG5ZyFywiW0",
  authDomain: "jackhabbitjournal.firebaseapp.com",
  projectId: "jackhabbitjournal",
  storageBucket: "jackhabbitjournal.appspot.com",
  messagingSenderId: "240014016778",
  appId: "1:240014016778:web:7a04641b8c26f4ccd0baf3",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});
