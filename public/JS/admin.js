// public/js/admin.js

console.log('1. admin.js script loaded.');

document.addEventListener('DOMContentLoaded', () => {
    console.log('2. DOM fully loaded. The page is ready.');

    const form = document.getElementById('new-challenge-form');
    const messageElement = document.getElementById('response-message');

    if (!form) {
        console.error('3. FATAL ERROR: Script could not find the form with ID "new-challenge-form".');
        return; // Stop execution if the form doesn't exist
    }

    console.log('3. Successfully found the form element.');

    form.addEventListener('submit', async (e) => {
        console.log('4. Submit button clicked. Event listener is working.');
        e.preventDefault(); // Prevent the form from reloading the page

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('5. Form data captured. Preparing to send fetch request...');

        messageElement.textContent = 'Submitting...';
        messageElement.style.color = 'gray';

        try {
            const response = await fetch('/api/admin/challenge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('6. Fetch request sent. Waiting for response...');
            const result = await response.json();
            console.log('7. Response received from server.');

            if (!response.ok) {
                throw new Error(result.msg || 'An unknown error occurred.');
            }

            messageElement.textContent = 'Success! New challenge is now active.';
            messageElement.style.color = 'green';
            form.reset();

        } catch (error) {
            console.error('8. An error occurred in the fetch process:', error);
            messageElement.textContent = `Error: ${error.message}`;
            messageElement.style.color = 'red';
        }
    });
});