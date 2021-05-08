const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');


const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!<h3> <img src="${user.photoURL}">`;
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

const db = firebase.firestore();

const updateScore = document.getElementById('updateScore');
const thingsList = document.getElementById('thingsList');
const scoreLoc = document.getElementById('score');

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
    
    if (user) {
        
        thingsRef = db.collection('things');

        updateScore.onclick = () => {

            const { serverTimestamp } = firebase.firestore.FieldValue;

            thingsRef.add({
                uid: user.uid,
                name: user.displayName,
                createdAt: serverTimestamp(),
                score: parseInt(scoreLoc.innerHTML),
                type: "score"
            })

        }

        // clearScore.onclick = () => {

        //     db.collection("things").doc("score").delete().then(() => {
        //         console.log("Document successfully deleted!");
        //     }).catch((error) => {
        //         console.error("Error removing document: ", error);
        //     });

        // }

        unsubscribe = thingsRef
            .where('uid', '==', user.uid)
            .orderBy('createdAt')
            .onSnapshot(querySnapshot => {

                const items = querySnapshot.docs.map(doc => {

                    return `<li>${ doc.data().name } - ${ doc.data().score }</li>` 

                });

                thingsList.innerHTML = items.join('');

            });

    } else {
        unsubscribe && unsubscribe();
    }

})


// game js

window.addEventListener('load', init);

// Different Levels
const levels = {
  easy: 5,
  medium: 3,
  hard: 1
};

// To change level
let currentLevel = levels.easy;

let time = currentLevel;
let score = 0;
let isPlaying;

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');

// Initialize Game
function init() {

  // Show number of seconds in UI
  seconds.innerHTML = currentLevel;

  // Load word from array
  showWord();

  // Start matching on word input
  wordInput.addEventListener('input', startMatch);

  // Call countdown every second
  setInterval(countdown, 1000);

  // Check game status
  setInterval(checkStatus, 50);
}

// Start match
function startMatch() {
  if (matchWords()) {
    isPlaying = true;
    time = currentLevel + 1;
    showWord();
    wordInput.value = '';
    score++;
  }

  // If score is -1, display 0
  if (score === -1) {
    scoreDisplay.innerHTML = 0;
  } else {
    scoreDisplay.innerHTML = score;
  }
}

// Match currentWord to wordInput
function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    message.innerHTML = 'Correct!';
    message.setAttribute('class', 'mt-3 text-center text-success');
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

// Pick & show random word
function showWord() {

  // Generate random array index
  // const randIndex = Math.floor(Math.random() * words.length);

  // Output random word
  currentWord.innerHTML = faker.commerce.productAdjective();
}

// Countdown timer
function countdown() {
  // Make sure time is not run out

  if (time > 0) {
    // Decrement
    isPlaying = true;
    time--;
  } else if (time === 0) {
    // Game is over
    isPlaying = false;
  }
  // Show time
  timeDisplay.innerHTML = time;
}

// Check game status
function checkStatus() {
    if (!isPlaying && time === 0) {
        message.innerHTML = 'Game Over!';
        message.setAttribute('class', 'mt-3 text-center text-danger');
        score = -1;
        currentLevel = levels.easy;
        seconds.innerHTML = currentLevel;
        seconds.setAttribute('class', 'text-success');
    }

    if (score === 20) {
        currentLevel = levels.medium;
        seconds.innerHTML = currentLevel;
        seconds.setAttribute('class', 'text-warning');
    } else if (score === 50) {
        currentLevel = levels.hard;
        seconds.innerHTML = currentLevel;
        seconds.setAttribute('class', 'text-danger');
    }
}


// axios for nasa

const nasaImg = document.getElementById('nasaImg');

axios.all([
    axios.get('https://api.nasa.gov/planetary/apod?api_key=wBckPrK71COASFJndVpT75rLcN8EfrH3bbTefKH0')
])
.then(responseArr => {
    nasaImg.src = responseArr[0].data.url;
})

// axios for joke

const jokeQuestion = document.getElementById('jokeQuestion');
const jokeAnswer = document.getElementById('jokeAnswer');

axios.all([
    axios.get('https://official-joke-api.appspot.com/random_joke')
])
.then(responseArr => {
    jokeQuestion.innerHTML = responseArr[0].data.setup;
    jokeAnswer.innerHTML = responseArr[0].data.punchline;
})

function showhide(id) {
    var e = document.getElementById(id);
    e.style.display = (e.style.display == 'block') ? 'none' : 'block';
}
