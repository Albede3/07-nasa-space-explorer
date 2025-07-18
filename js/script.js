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
        // Loop through each image and add it to the gallery
        data.forEach(item => {
          if (item.media_type === 'image') {
            // Create a div for each image
            const imageDiv = document.createElement('div');
            imageDiv.className = 'apod-image';

            // Display image, title, and date
            imageDiv.innerHTML = `
              <img src="${item.url}" alt="${item.title}" />
              <h3>${item.title}</h3>
              <p>${item.date}</p>
            `;

            gallery.appendChild(imageDiv);
          }
        });

        // If no images found, show a message
        if (gallery.innerHTML === '') {
          gallery.innerHTML = `<p>No images found for this date range.</p>`;
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
        gallery.appendChild(imageDiv);
      } else {
        gallery.innerHTML = `<p>No images found for this date range.</p>`;
      }
    })
    .catch(error => {
      // Show an error message if something goes wrong
      gallery.innerHTML = `<p>Sorry, something went wrong. Please try again later.</p>`;
      // Log the error for debugging
      console.error(error);
    });
});
