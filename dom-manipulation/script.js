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

// === STEP 1: WEB STORAGE INTEGRATION ===

// Save quotes to local storage
function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Using Session Storage (Optional) - Store last viewed quote
function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  return lastQuote ? JSON.parse(lastQuote) : null;
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');

  // Clear previous content
  quoteDisplay.innerHTML = '';

  if (quotes.length === 0) {
    quoteDisplay.innerHTML =
      '<p>No quotes available. Please add some quotes.</p>';
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Save last viewed quote to session storage
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

  // Save to local storage (REQUIRED)
  saveQuotesToLocalStorage();

  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  alert('Quote added successfully!');
}

// === STEP 2: JSON DATA IMPORT AND EXPORT ===

// Implement JSON Export - Using Blob and URL.createObjectURL
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });

  // Create download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = 'quotes.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(link.href);
  alert('Quotes exported successfully!');
}

// Implement JSON Import - Using FileReader as specified
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      // Validate imported data
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
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
  fileReader.readAsText(event.target.files[0]);
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById('newQuote')
    .addEventListener('click', showRandomQuote);

  // Display last viewed quote from session storage or random quote
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
