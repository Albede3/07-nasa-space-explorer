// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Get the "Get Space Images" button and the gallery element
const getImagesButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// NASA APOD API key
const apiKey = 'fI07V2XmqGfwEaGyHeVSqnohbMjbpYSa76VlVF6h';

// Array of fun space facts
const spaceFacts = [
  "Did you know? The Sun accounts for about 99.86% of the mass in our solar system.",
  "Did you know? One day on Venus is longer than its year.",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second.",
  "Did you know? There are more trees on Earth than stars in the Milky Way.",
  "Did you know? Jupiter has 92 known moons!",
  "Did you know? The footprints on the Moon will remain for millions of years.",
  "Did you know? Saturn could float in water because it is mostly made of gas.",
  "Did you know? Space is completely silent—sound needs a medium to travel.",
  "Did you know? A spoonful of a neutron star would weigh about a billion tons.",
  "Did you know? The largest volcano in the solar system is on Mars—Olympus Mons."
];

// Pick a random fact
const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

// Create the fact section and add it above the gallery
const factSection = document.createElement('div');
factSection.className = 'space-fact';
factSection.innerHTML = `<strong>${randomFact}</strong>`;

// Insert the fact section before the gallery
const container = document.querySelector('.container');
container.insertBefore(factSection, document.getElementById('gallery'));

// Function to create and show the modal for images
function showModal(item) {
  // Create the modal background
  const modalBg = document.createElement('div');
  modalBg.className = 'modal-bg';

  // Create the modal content
  const modal = document.createElement('div');
  modal.className = 'modal';

  // Fill the modal with image, title, date, and explanation
  modal.innerHTML = `
    <span class="modal-close">&times;</span>
    <img src="${item.url}" alt="${item.title}" class="modal-image" />
    <h2>${item.title}</h2>
    <p><strong>Date:</strong> ${item.date}</p>
    <p>${item.explanation}</p>
  `;

  // Add modal to modal background
  modalBg.appendChild(modal);

  // Add modal background to the body
  document.body.appendChild(modalBg);

  // Close modal when clicking the close button or background
  modalBg.addEventListener('click', (event) => {
    if (
      event.target === modalBg ||
      event.target.classList.contains('modal-close')
    ) {
      document.body.removeChild(modalBg);
    }
  });
}

// Listen for clicks on the "Get Space Images" button
getImagesButton.addEventListener('click', () => {
  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Build the API URL using template literals
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  // Show a loading message while fetching data
  gallery.innerHTML = `<p>🔄 Loading space photos…</p>`;

  // Fetch data from NASA's APOD API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Clear the gallery
      gallery.innerHTML = '';

      // Check if we got an array of images
      if (Array.isArray(data)) {
        // Loop through each item and add it to the gallery
        data.forEach(item => {
          // Create a div for each gallery item
          const itemDiv = document.createElement('div');
          itemDiv.className = 'apod-image';

          if (item.media_type === 'image') {
            // Show image, title, and date
            itemDiv.innerHTML = `
              <img src="${item.url}" alt="${item.title}" />
              <h3>${item.title}</h3>
              <p>${item.date}</p>
            `;
            // Show modal on click for images
            itemDiv.addEventListener('click', () => {
              showModal(item);
            });
          } else if (item.media_type === 'video') {
            // Show video link, title, and date
            itemDiv.innerHTML = `
              <a href="${item.url}" target="_blank" rel="noopener" style="display:block;margin-bottom:10px;color:#105bd8;font-weight:bold;text-decoration:underline;">
                ▶️ View Video
              </a>
              <h3>${item.title}</h3>
              <p>${item.date}</p>
            `;
            // No modal for videos, just link
          }

          gallery.appendChild(itemDiv);
        });

        // If no items found, show a message
        if (gallery.innerHTML === '') {
          gallery.innerHTML = `<p>No images or videos found for this date range.</p>`;
        }
      } else if (data.media_type === 'image') {
        // If only one image is returned (not an array)
        const imageDiv = document.createElement('div');
        imageDiv.className = 'apod-image';
        imageDiv.innerHTML = `
          <img src="${data.url}" alt="${data.title}" />
          <h3>${data.title}</h3>
          <p>${data.date}</p>
        `;
        imageDiv.addEventListener('click', () => {
          showModal(data);
        });
        gallery.appendChild(imageDiv);
      } else if (data.media_type === 'video') {
        // If only one video is returned
        const videoDiv = document.createElement('div');
        videoDiv.className = 'apod-image';
        videoDiv.innerHTML = `
          <a href="${data.url}" target="_blank" rel="noopener" style="display:block;margin-bottom:10px;color:#105bd8;font-weight:bold;text-decoration:underline;">
            ▶️ View Video
          </a>
          <h3>${data.title}</h3>
          <p>${data.date}</p>
        `;
        gallery.appendChild(videoDiv);
      } else {
        gallery.innerHTML = `<p>No images or videos found for this date range.</p>`;
      }
    })
    .catch(error => {
      // Show an error message if something goes wrong
      gallery.innerHTML = `<p>Sorry, something went wrong. Please try again later.</p>`;
      // Log the error for debugging
      console.error(error);
    });
});
