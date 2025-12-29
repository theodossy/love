importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDH8rZPpwtVzsBJSl_TM2oLJhR22Bwpb0I",
  authDomain: "love-2-697ee.firebaseapp.com",
  projectId: "love-2-697ee",
  messagingSenderId: "557984264400",
  appId: "1:557984264400:web:aa4b1f5cfde5fa757c2ed5"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log("[SW] Background message", payload);

  const title = payload.notification?.title || "💖 Love";
  const options = {
    body: payload.notification?.body || "Your partner is thinking of you",
    icon: "/love/icon-192.png"
  };

  self.registration.showNotification(title, options);
});
