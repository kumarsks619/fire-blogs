import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: 'AIzaSyAFd5z92EHsjmkXB8eRSLhMUxScDGk-7Ho',
    authDomain: 'fireblogs-sks.firebaseapp.com',
    projectId: 'fireblogs-sks',
    storageBucket: 'fireblogs-sks.appspot.com',
    messagingSenderId: '54811026980',
    appId: '1:54811026980:web:f286ab31b792c0cdfc1ab1',
}

const firebaseApp = firebase.initializeApp(firebaseConfig)
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { timestamp }
export default firebaseApp.firestore()
