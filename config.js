import firebase from 'firebase';
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyDPbkVspRv9h9HhPsky50njYPEQQ1chcPc",
    authDomain: "booksanta-e7875.firebaseapp.com",
    databaseURL: "https://booksanta-e7875.firebaseio.com",
    projectId: "booksanta-e7875",
    storageBucket: "booksanta-e7875.appspot.com",
    messagingSenderId: "91840925824",
    appId: "1:91840925824:web:75b18d9cc8505798165665",
    measurementId: "G-JQBNGLBLK6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();