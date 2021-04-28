import firebase from '@react-native-firebase/app';
import '@react-native-firebase/storage';
 
export const uploadVideo = path => {
  return new Promise((resolve, reject) => {
    const sessionId = new Date().getTime();
    const videoRef = firebase
      .storage()
      .ref('videos')
      .child(sessionId.toString());
    videoRef
      .putFile(path)
 
      .then(() => {
        resolve(videoRef.getDownloadURL());
      })
 
      .catch(error => {
        alert(`Rejected : ${error}`);
        reject(error);
      });
  });
};


// let config = {

//     apiKey: "AIzaSyB45pyppvvGr14AF0HZsqZw7ZnTvdFag0M",

//     authDomain: "react-native-social-dc216.firebaseapp.com",

//     databaseURL: "https://react-native-social-dc216.firebaseio.com",

//     projectId: "react-native-social-dc216",

//     storageBucket: "react-native-social-dc216.appspot.com",

//     messagingSenderId: "1018540424794"

//   };

// firebase.initializeApp(config);
