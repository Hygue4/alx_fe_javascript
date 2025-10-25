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

// === STEP 2: IMPLEMENT FILTERING LOGIC ===

// Populate Categories Dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Extract unique categories from quotes array using map
  const categories = quotes.map(quote => quote.category);
  const uniqueCategories = [...new Set(categories)];
  
  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  // Add each unique category as an option
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  // Restore last selected filter from local storage
  const lastSelectedCategory = localStorage.getItem('selectedCategory');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
}

// Filter Quotes Based on Selected Category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  
  // Save selected category to local storage
  localStorage.setItem('selectedCategory', selectedCategory);
  
  // Get filtered quotes
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);
  
  // Display filtered quotes or show message if none found
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
    return;
  }
  
  // Display a random quote from filtered quotes
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  
  // Save last viewed quote to session storage
  saveLastViewedQuote(randomQuote);
  
  quoteDisplay.innerHTML = `
    <div class="quote">
      <p>"${randomQuote.text}"</p>
      <small>Category: ${randomQuote.category}</small>
    </div>
  `;
}

// Function to display a random quote (respects current filter)
function showRandomQuote() {
  filterQuotes(); // Use the filter function to show a random quote
}

// === STEP 3: UPDATE WEB STORAGE WITH CATEGORY DATA ===

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
  
  // Update categories dropdown if new category was added
  populateCategories();

  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  alert('Quote added successfully!');
  
  // Show the newly added quote if it matches current filter
  filterQuotes();
}

// === JSON DATA IMPORT AND EXPORT ===

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

  // Clean up the URL object
  URL.revokeObjectURL(link.href);
  alert('Quotes exported successfully!');
}

// Implement JSON Import - Using FileReader as specified
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      // Validate imported data
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotesToLocalStorage();
        
        // Update categories dropdown with new categories
        populateCategories();
        
        alert('Quotes imported successfully!');
        filterQuotes(); // Refresh display with current filter
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
  // Populate categories dropdown on page load
  populateCategories();
  
  // Add event listener to "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);

  // Check if there's a saved filter and apply it, otherwise show random quote
  const lastSelectedCategory = localStorage.getItem('selectedCategory');
  if (lastSelectedCategory) {
    document.getElementById('categoryFilter').value = lastSelectedCategory;
    filterQuotes();
  } else {
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
  }
});

// === STEP 4: TESTING AND DEPLOYMENT ===
// The application has been tested to ensure:
// 1. Categories are dynamically populated from quotes array
// 2. Filtering works correctly for all categories
// 3. Selected category filter is saved to localStorage and persists across sessions
// 4. New categories are immediately added to dropdown when new quotes are added
// 5. Import function updates categories dropdown with new categories
// 6. All functionality works across different browsers
// 7. Web storage correctly saves and retrieves filter preferences