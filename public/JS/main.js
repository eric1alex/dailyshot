// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  // Select the elements we want to update
  const titleElement = document.getElementById('challenge-title');
  const descriptionElement = document.getElementById('challenge-description');
  const hashtagElement = document.getElementById('challenge-hashtag');

  // Fetch the active challenge from our API
  fetch('/api/challenge/active')
    .then(response => {
      if (!response.ok) {
        // If the server responds with an error (like 404), throw an error
        throw new Error('No active challenge found');
      }
      return response.json();
    })
    .then(data => {
      // Update the HTML with the data from the API
      titleElement.textContent = data.title;
      descriptionElement.textContent = data.description;
      hashtagElement.textContent = data.submissionHashtag;
    })
    .catch(error => {
      // If there's an error (e.g., no active challenge, network issue)
      console.error('Error fetching challenge:', error);
      titleElement.textContent = 'No Active Challenge';
      descriptionElement.textContent = 'A new challenge will be posted soon. Please check back later!';
      hashtagElement.textContent = 'N/A';
    });
});