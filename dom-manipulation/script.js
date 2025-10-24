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

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');

  if (quotes.length === 0) {
    quoteDisplay.innerHTML =
      '<p>No quotes available. Please add some quotes.</p>';
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Save to session storage
  saveLastViewedQuote(randomQuote);

  quoteDisplay.innerHTML = `
        <div class="quote">
            <p>"${randomQuote.text}"</p>
            <small>Category: ${randomQuote.category}</small>
        </div>
    `;
}

// Function to add new quotes
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;

  if (quoteText.trim() === '' || quoteCategory.trim() === '') {
    alert('Please enter both quote text and category');
    return;
  }

  // Add new quote to the array
  quotes.push({
    text: quoteText,
    category: quoteCategory,
  });

  // Save to local storage
  saveQuotesToLocalStorage();

  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  // Show confirmation
  alert('Quote added successfully!');
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = 'quotes.json';
  link.click();

  URL.revokeObjectURL(link.href);
  alert('Quotes exported successfully!');
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
        alert('Quotes imported successfully!');
        showRandomQuote(); // Refresh display
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

  // Display last viewed quote or random quote
  const lastQuote = loadLastViewedQuote();
  if (lastQuote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
            <div class="quote">
                <p>"${lastQuote.text}"</p>
                <small>Category: ${lastQuote.category}</small>
                <br><small><em>(Last viewed)</em></small>
            </div>
        `;
  } else {
    showRandomQuote();
  }
});
