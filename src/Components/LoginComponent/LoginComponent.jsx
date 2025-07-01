import React, { useState, useEffect, useRef } from 'react';

// --- Helper Functions for API Communication ---

/**
 * Creates a new session with the ADK API server.
 * @param {string} appName - The name of the agent application.
 * @param {string} userId - The ID for the user.
 * @returns {Promise<string|null>} The new session ID, or null on error.
 */
async function createSession(appName, userId) {
  try {
    const response = await fetch(`http://localhost:8000/apps/${appName}/users/${userId}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // This is the initial state for the Arogya Mitra agent
      body: JSON.stringify({
        user_context: {
          user_name: userId, // Use the login name as the user_name
          personalInfo: { age: 45, sex: 'Male' }, // Default values
          diagnosedConditions: ['Hypertension'],
          currentMedications: [{}],
        },
        interaction_history: [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`Failed to create session. Status: ${response.status}`);
    }

    const sessionData = await response.json();
    return sessionData.id;
  } catch (error) {
    console.error('Error creating session:', error);
    alert('Failed to connect to the agent. Make sure the "adk api_server" is running and accessible.');
    return null;
  }
}

export default function LoginComponent({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const APP_NAME = 'orchestrator_agent'; // Your ADK application name

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter a name.');
      return;
    }
    setIsLoading(true);

    const sessionId = await createSession(APP_NAME, username.trim());

    setIsLoading(false);
    if (sessionId) {
      onLoginSuccess(username.trim(), sessionId);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#25A55F]">Arogya Mitra</h1>
          <p className="mt-2 text-gray-600">Your AI Health Assistant</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="sr-only">Your Name</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-lg text-gray-700 placeholder-gray-500 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter Your Name"
              disabled={isLoading}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-[#25A55F] hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connecting...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
