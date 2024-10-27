import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Payments() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
  const [payments, setPayments] = useState([]); // State to hold payment records
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch existing payments when the component mounts
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the JWT token from localStorage
        const response = await axios.get('http://localhost:5000/api/payments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(response.data); // Set payments state with fetched data
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to fetch payments. Please try again later.');
      }
    };

    fetchPayments(); // Call fetch function
  }, []); // Run once on component mount

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    try {
      await axios.post('http://localhost:5000/api/payments', {
        amount,
        currency,
        swiftCode,
        recipientAccountNumber,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      setSuccess('Payment created successfully!'); // Display success message
      alert('Payment successful');
  
      // Optionally reset the form fields
      setAmount('');
      setCurrency('');
      setSwiftCode('');
      setRecipientAccountNumber('');
  
      // Re-fetch payments to include the new one
      const paymentsResponse = await axios.get('http://localhost:5000/api/payments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPayments(paymentsResponse.data); // Update the payments list
    } catch (error) {
      console.error('Error making payment:', error.response.data);
      setError(error.response?.data?.message || 'Payment failed. Please try again.');
    }
  };  

  return (
    <div>
      <h1>Create Payment</h1>
      <form onSubmit={handlePayment}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Currency (e.g., USD)"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="SWIFT Code"
          value={swiftCode}
          onChange={(e) => setSwiftCode(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Recipient Account Number"
          value={recipientAccountNumber}
          onChange={(e) => setRecipientAccountNumber(e.target.value)}
          required
        />
        <button type="submit">Create Payment</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      {success && <p style={{ color: 'green' }}>{success}</p>} {/* Display success message */}

      <h2>Your Payments</h2>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <ul>
          {payments.map(payment => (
            <li key={payment._id}>
              Amount: {payment.amount} {payment.currency} <br />
              SWIFT Code: {payment.swiftCode} <br />
              Recipient Account: {payment.recipientAccountNumber} <br />
              Date: {new Date(payment.createdAt).toLocaleString()} {/* Formatting the date */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Payments;
