import React, { useState } from 'react';

export default function SelectedProduct({setPop , name , price , image , link}) {

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(null);

  function handleClosePop(){
    const newPop = {
      bool : false,
      name : null,
      price : null,
      image : null,
      link : null
     }
     setPop(newPop)
  }

  if (!name || !price || !image) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-2xl">Product not found.</p>
        <button onClick={handleClosePop} className="mt-4 bg-emerald-500 px-6 py-3 rounded-lg hover:bg-emerald-600">Go Home</button>
      </div>
    );
  }

  const match = link.match(/\/dp\/(B[A-Z0-9]+)/);
  if (!match) return "Invalid Amazon URL";

  const productId = match[1];
  const affiliateLink = `https://www.amazon.in/dp/${productId}?tag=pricetrack0e3-21`;

  const handleSubscribe = async () => {
    setSubscriptionError(null);

    if (!email) {
      setSubscriptionError("Please enter your email.");
      return;
    }

    try {
      const response = await fetch('https://pt-cheerio-back.onrender.com/track', { // Replace with your API endpoint
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
    <div className="bg-gray-900 text-white min-h-screen z-20 p-6 md:p-10 flex flex-col">
      <div className="container mx-auto">
      <button onClick={handleClosePop} className="mb-4 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600">
        Go Back
      </button>
        <div className="bg-gray-800 p-8 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-6">
          <img src={image} alt={name} className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-sm" />
          <div className="md:flex-grow text-center md:text-left">
            <h2 className="text-xl md:text-3xl font-bold mb-2">{name}</h2>
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
              <div>
              <p className="text-emerald-500 text-xl md:text-2xl">Tracking Started 😊. Don't Worry , We will send you an email on {email} if the price drops.</p>
              <a className='text-4xl text-blue-700 font-bold' href={affiliateLink}>Check Now!</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}