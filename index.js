const express = require('express');
const firebaseAdmin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://gtmfuncrossword-default-rtdb.firebaseio.com' // Update with your database URL
});

const db = firebaseAdmin.database();
const app = express();

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Handle crossword submission
app.use(express.json()); // For parsing JSON in requests
app.post('/submit', (req, res) => {
  const { input,email } = req.body;


  // Fetch the correct solution from Firebase
  db.ref('crossword_solution').once('value')
    .then((snapshot) => {
      const correctSolution = snapshot.val();  // Assuming the solution is stored as a string
      var ans = '';
      // Compare user input with the correct solution
      if (input === correctSolution) {
        res.status(200).send('Your Responses have been saved!!');
        ans = 'Correct';
      } else {
        res.status(400).send('Your Responses have been saved!!');
        ans = 'Incorrect';
      }

      // Save the user response to Firebase (optional)
      saveUserResponse(input, email, ans);
    })
    .catch((error) => {
      console.error('Error fetching solution:', error);
    });
});

// Function to save user input to Firebase
function saveUserResponse(userInputString, email, ans) {
  const userResponseRef = db.ref('crossword_responses').push();
  userResponseRef.set({
    input: userInputString,
    timestamp: new Date().toISOString(),
    emailId: email,
    answer: ans 
  })
  .then(() => {
    console.log('User response saved successfully!' + email);
  })
  .catch((error) => {
    console.error('Error saving user response:', error);
  });
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
