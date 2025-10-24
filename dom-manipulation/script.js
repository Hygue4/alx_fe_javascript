// Array of quote objects - load from local storage or use default
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  {
    text: 'The only way to do great work is to love what you do.',
    category: 'Motivation',
  },
  {
    text: 'Innovation distinguishes between a leader and a follower.',
    category: 'Leadership',
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    category: 'Life',
  },
  {
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    category: 'Dreams',
  },
];

// Save last viewed quote to session storage
function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Load last viewed quote from session storage
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  return lastQuote ? JSON.parse(lastQuote) : null;
}

// Function to save quotes to local storage
function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote using appendChild
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');

  // Clear previous content
  while (quoteDisplay.firstChild) {
    quoteDisplay.removeChild(quoteDisplay.firstChild);
  }

  if (quotes.length === 0) {
    const noQuoteMessage = document.createElement('p');
    noQuoteMessage.textContent = 'No quotes available. Please add some quotes.';
    quoteDisplay.appendChild(noQuoteMessage);
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Save to session storage
  saveLastViewedQuote(randomQuote);

  // Create quote container
  const quoteContainer = document.createElement('div');
  quoteContainer.className = 'quote';

  // Create quote text element
  const quoteText = document.createElement('p');
  quoteText.textContent = `"${randomQuote.text}"`;

  // Create category element
  const quoteCategory = document.createElement('small');
  quoteCategory.textContent = `Category: ${randomQuote.category}`;

  // Append elements using appendChild
  quoteContainer.appendChild(quoteText);
  quoteContainer.appendChild(quoteCategory);
  quoteDisplay.appendChild(quoteContainer);
}

// Function to add new quotes to array and update DOM
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText.trim() === '' || quoteCategory.trim() === '') {
    alert('Please enter both quote text and category');
    return;
  }

  // Add new quote to the array
  const newQuote = {
    text: quoteText,
    category: quoteCategory,
  };
  quotes.push(newQuote);

  // Save to local storage
  saveQuotesToLocalStorage();

  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  // Show confirmation using DOM manipulation
  const quoteDisplay = document.getElementById('quoteDisplay');

  // Clear previous content
  while (quoteDisplay.firstChild) {
    quoteDisplay.removeChild(quoteDisplay.firstChild);
  }

  // Create confirmation message using appendChild
  const confirmationMessage = document.createElement('div');
  confirmationMessage.className = 'confirmation';

  const messageText = document.createElement('p');
  messageText.textContent = 'Quote added successfully!';
  messageText.style.color = 'green';

  const newQuoteDisplay = document.createElement('div');
  newQuoteDisplay.className = 'quote';

  const addedQuoteText = document.createElement('p');
  addedQuoteText.textContent = `"${newQuote.text}"`;

  const addedQuoteCategory = document.createElement('small');
  addedQuoteCategory.textContent = `Category: ${newQuote.category}`;

  // Append using appendChild
  newQuoteDisplay.appendChild(addedQuoteText);
  newQuoteDisplay.appendChild(addedQuoteCategory);
  confirmationMessage.appendChild(messageText);
  confirmationMessage.appendChild(newQuoteDisplay);
  quoteDisplay.appendChild(confirmationMessage);
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = 'quotes.json';
  document.body.appendChild(link); // Using appendChild
  link.click();
  document.body.removeChild(link); // Clean up

  URL.revokeObjectURL(link.href);

  // Show export confirmation
  const quoteDisplay = document.getElementById('quoteDisplay');
  const exportMessage = document.createElement('p');
  exportMessage.textContent = 'Quotes exported successfully!';
  exportMessage.style.color = 'blue';

  // Clear and show message
  while (quoteDisplay.firstChild) {
    quoteDisplay.removeChild(quoteDisplay.firstChild);
  }
  quoteDisplay.appendChild(exportMessage);
}

// Import quotes from JSON file
function importFromJsonFile(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        saveQuotesToLocalStorage();

        // Show import confirmation
        const quoteDisplay = document.getElementById('quoteDisplay');
        const importMessage = document.createElement('p');
        importMessage.textContent = 'Quotes imported successfully!';
        importMessage.style.color = 'green';

        // Clear and show message
        while (quoteDisplay.firstChild) {
          quoteDisplay.removeChild(quoteDisplay.firstChild);
        }
        quoteDisplay.appendChild(importMessage);

        setTimeout(showRandomQuote, 2000); // Refresh display after 2 seconds
      } else {
        alert('Invalid JSON format. Please provide a valid quotes array.');
      }
    } catch (error) {
      alert('Error parsing JSON file: ' + error.message);
    }
  };
  reader.readAsText(file);

  // Reset file input
  input.value = '';
}

// Function to create the add quote form
function createAddQuoteForm() {
  // Form is already in HTML structure
}

// Event listener for the "Show New Quote" button
document.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById('newQuote')
    .addEventListener('click', showRandomQuote);

  // Display last viewed quote or random quote using appendChild
  const lastQuote = loadLastViewedQuote();
  const quoteDisplay = document.getElementById('quoteDisplay');

  // Clear any existing content
  while (quoteDisplay.firstChild) {
    quoteDisplay.removeChild(quoteDisplay.firstChild);
  }

  if (lastQuote) {
    const quoteContainer = document.createElement('div');
    quoteContainer.className = 'quote';

    const quoteText = document.createElement('p');
    quoteText.textContent = `"${lastQuote.text}"`;

    const quoteCategory = document.createElement('small');
    quoteCategory.textContent = `Category: ${lastQuote.category}`;

    const lastViewed = document.createElement('small');
    lastViewed.innerHTML = '<br><em>(Last viewed)</em>';

    // Append using appendChild
    quoteContainer.appendChild(quoteText);
    quoteContainer.appendChild(quoteCategory);
    quoteContainer.appendChild(lastViewed);
    quoteDisplay.appendChild(quoteContainer);
  } else {
    showRandomQuote();
  }
});
