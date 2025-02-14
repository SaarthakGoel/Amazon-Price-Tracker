import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function SelectedProduct() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const name = searchParams.get('name');
  const price = searchParams.get('price');
  const image = searchParams.get('image');
  const link = searchParams.get('link');

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(null);

  if (!name || !price || !image) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-2xl">Product not found.</p>
        <button onClick={() => navigate('/')} className="mt-4 bg-emerald-500 px-6 py-3 rounded-lg hover:bg-emerald-600">Go Home</button>
      </div>
    );
  }

  const handleSubscribe = async () => {
    setSubscriptionError(null);

    if (!email) {
      setSubscriptionError("Please enter your email.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3500/track', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name , price , link , email}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Subscription failed.");
      }

      setSubscribed(true);
    } catch (error) {
      console.error("Subscription error:", error);
      setSubscriptionError(error.message);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 md:p-10 flex flex-col">
      <div className="container mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600">
        Go Back
      </button>
        <div className="bg-gray-800 p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-6">
          <img src={image} alt={name} className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-sm" />
          <div className="md:flex-grow text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{name}</h2>
            <p className="text-2xl font-bold text-emerald-500 mb-4">₹{price}</p>

            {!subscribed ? (
              <div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="px-4 py-3 rounded-lg border-none w-full md:w-80 text-gray-900 bg-gray-100"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="bg-emerald-500 px-6 py-3 rounded-lg hover:bg-emerald-600 w-full md:w-auto"
                  >
                    Track Price
                  </button>
                </div>
                {subscriptionError && <p className="text-red-500 mt-2">{subscriptionError}</p>}
              </div>
            ) : (
              <p className="text-emerald-500">You are now tracking the price of this product!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}