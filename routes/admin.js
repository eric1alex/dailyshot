// public/js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('new-challenge-form');
    const messageElement = document.getElementById('response-message');

    if (!form) {
        console.error('Error: Could not find the form with ID "new-challenge-form".');
        return; // Stop if the form doesn't exist
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the form from reloading the page

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Clear previous messages
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

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.msg || 'An unknown error occurred.');
            }

            messageElement.textContent = 'Success! New challenge is now active.';
            messageElement.style.color = 'green';
            form.reset(); // Clear the form

        } catch (error) {
            messageElement.textContent = `Error: ${error.message}`;
            messageElement.style.color = 'red';
        }
    });
});