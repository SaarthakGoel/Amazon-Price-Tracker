import { Children, useState } from 'react'
import { createContext } from 'react';
import './App.css'
import React from "react";
import { Link, useNavigate } from 'react-router';
import SelectedProduct from './components/selectedProduct';

export default function App() {

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [pop, setPop] = useState({
    bool: false,
    name: null,
    price: null,
    image: null,
    link: null
  });

  console.log(pop)

  async function handleFindProduct() {
    if (!query) return alert("Please enter a product name");
    setLoading(true)
    setError("");
    try {
      console.log(query)
      const res = await fetch(`https://pt-cheerio-back.onrender.com/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      console.log("data", data)

      if (res.ok) {
        console.log(data.products)
        setProducts(data.products);
      } else {
        setError(data.error || "Failed to get the products");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }

  }

  function handleSelect(index) {
    const newPop = {
      bool: true,
      name: products[index].name,
      price: products[index].price,
      image: products[index].image,
      link: products[index].link
    }
    setPop(newPop);
  }

  return (
    <>
      {
        pop.bool ?
          <SelectedProduct setPop={setPop} name={pop.name} price={pop.price} image={pop.image} link={pop.link} />
          : <div className="bg-gray-900 text-white min-h-screen">

            {/* Hero Section */}
            <header className="text-center px-4 py-20">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Track Prices, Save Money!
              </h1>
              <p className="mt-4 text-lg text-gray-400">
                Get real-time price drop alerts for your favorite products.
              </p>

              {/* Search Bar */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Product Name..."
                  className="px-4 py-3 rounded-lg border-none w-full sm:w-96 text-gray-900"
                />
                <button onClick={handleFindProduct} className="bg-emerald-500 px-6 py-3 rounded-lg hover:bg-emerald-600 w-full sm:w-auto">
                  Find product
                </button>
              </div>
            </header>

            {loading && (
              <div className="mt-4 mx-24 space-y-2">
                <div className="h-6 bg-gray-200 animate-pulse rounded-md w-3/4"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/2"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded-md w-3/4"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/2"></div>
              </div>
            )}


            {error && <p className="text-red-500 mt-4">{error}</p>}

            {
              products.length === 0 ? null : <div className='text-gray-200 text-3xl mx-10'>Select Product From Below</div>
            }


            <div className="mt-6 mx-10 grid lg:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border p-4 rounded flex gap-4 hover:bg-emerald-400 bg-slate-200"
                >
                  <img src={product.image} alt={product.name} className="w-40 h-40 object-cover rounded-sm" />
                  <div className='flex flex-col items-center w-full'>
                    <h3 className="font-semibold text-xs md:text-base text-gray-800">{product.name}</h3>
                    <p className="text-gray-800 font-bold text-xl">₹{product.price}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Features Section */}
            <section className="py-16 px-6">
              <h2 className="text-3xl font-bold text-center">Why Use Our Tracker?</h2>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard title="📢 Real-Time Alerts" description="Get instant price drop notifications via email." />
                <FeatureCard title="🛍️ Multi-Store Support" description="Track prices from Amazon and more." />
                <FeatureCard title="💰 Completely Free" description="No hidden fees. Start saving today!" />
              </div>
            </section>

            {/* Footer */}
            <footer className="text-center text-gray-400 py-6">
              © 2025 PriceTracker | Built with ❤️ by Saarthak
            </footer>
          </div>
      }
    </>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-400">{description}</p>
    </div>
  );
}

