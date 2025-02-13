// Bind the event listener to all the pay buttons
document.querySelectorAll('.pay-btn').forEach(function(button) {
  button.addEventListener('click', function () {
    // Get order ID and amount from the button's data attributes
    const orderId = this.getAttribute('data-order-id');
    const amount = this.getAttribute('data-amount');

    // Make a POST request to your backend to create a Razorpay order
    fetch('/create-payment-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 100,  // Amount from the button
        orderId: orderId, // Pass the orderId from the button
      }),
    })
    .then(response => response.json())
    .then(orderData => {
      var options = {
        key: 'rzp_test_KBJq9jgg10W0QL',  // Replace with your Razorpay key ID
        amount: orderData.amount,  //10000  Amount in paise (100 INR = 10000 paise)
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Payment for pending order',
        order_id: orderData.id,  // The order ID received from the backend
        handler: function (response) {
          // Handle payment success here
          console.log('Payment Successful', response);
          // You can send `response` to the backend to verify the payment and update the order status
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '1234567890',
        },
        notes: {
          orderId: orderId,  // Pass your order ID here dynamically
        },
        theme: {
          color: '#F37254',  // Set the color of the Razorpay button
        },
      };

      // Open Razorpay payment gateway
      var rzp1 = new Razorpay(options);
      rzp1.open();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
});
