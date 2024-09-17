// stripe.js

// Initialize Stripe
var stripe = Stripe('YOUR_PUBLISHABLE_KEY');

// Create an instance of Elements
var elements = stripe.elements();

// Custom styling
var style = {
    base: {
        color: '#32325d',
        fontFamily: '"Arial", sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
    }
};

// Create an instance of the card Element
var card = elements.create('card', {style: style});

// Add card Element to the form
card.mount('#card-element');

// Handle real-time validation errors
card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

// Handle form submission
var form = document.getElementById('payment-form');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    stripe.createToken(card).then(function(result) {
        if (result.error) {
            // Inform the user if there was an error
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        } else {
            // Send the token to your server
            stripeTokenHandler(result.token);
        }
    });
});

// Submit the form with the token ID
function stripeTokenHandler(token) {
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');

    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);

    form.appendChild(hiddenInput);

    // Submit the form
    form.submit();
}
