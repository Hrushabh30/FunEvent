document.getElementById('submitBtn').addEventListener('click', function() {


    const emailInput = document.getElementById('email').value;
    console.log(emailInput);
    
    // Validate if email ends with @workday.com
    if (!emailInput.endsWith('@workday.com')) {
        alert('Please enter a valid Workday email address.');
        return;  // Stop submission if email is invalid
    }

    const inputValues = [];
    for (let i = 1; i <= 88; i++) {
      const cellValue = document.getElementById(`cell${i}`).value.toLowerCase();
      inputValues.push(cellValue);
    }
  
    const inputString = inputValues.join('');  // Combine inputs
  
    // Send the data to the server
    fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: inputString,email: emailInput })
    })
    .then(response => response.text())
    .then(data => {
      alert(data); // Display success or error message from the server
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });
  