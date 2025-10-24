// Array of quote objects
let quotes = [
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

  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  // Show confirmation
  alert('Quote added successfully!');
}

// Event listener for the "Show New Quote" button
document.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById('newQuote')
    .addEventListener('click', showRandomQuote);

  // Display initial quote
  showRandomQuote();
});
