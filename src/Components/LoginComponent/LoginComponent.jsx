import React, { useState } from 'react';

export default function LoginComponent({ onLoginSuccess }) {
  const [username, setUsername] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter a name.');
      return;
    }
    onLoginSuccess(username.trim());
  };
  
  // The JSX for the login form remains unchanged...
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        { /* ... title and other elements ... */ }
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#25A55F]">Arogya Mitra</h1>
          <p className="mt-2 text-gray-600">Your AI Health Assistant</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 text-lg text-gray-700 placeholder-gray-500 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter Your Name"
          />
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-[#25A55F] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}