import firebase from 'firebase';


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAT3-wr9HZdNUuvGPhYE6RpwJ1QsMQKsoM",
    authDomain: "instagram-clone-bf736.firebaseapp.com",
    databaseURL: "https://instagram-clone-bf736.firebaseio.com",
    projectId: "instagram-clone-bf736",
    storageBucket: "instagram-clone-bf736.appspot.com",
    messagingSenderId: "499152441110",
    appId: "1:499152441110:web:7fe4a7434e7b5059d78a37"
  });


  export const db=firebaseApp.firestore();
  export const auth=firebase.auth();
  export const storage=firebase.storage();