import React, { useState } from 'react';
import { FileUp, LoaderCircle, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Creates a new session with the ADK API server using a pre-defined initial state.
 * @param {string} appName
 * @param {string} userId
 * @param {object} initialState - The full state object from the report parser.
 * @returns {Promise<string|null>} The new session ID, or null on error.
 */
async function createSessionWithState(appName, userId, initialState) {
  try {
    const response = await fetch(`http://localhost:8001/apps/${appName}/users/${userId}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(initialState), // Send the JSON from the parser as the initial state
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create session. Server says: ${errorText}`);
    }
    const sessionData = await response.json();
    return sessionData.id;
  } catch (error) {
    console.error('Error creating session:', error);
    alert('Failed to create a personalized session. Please check the server logs.');
    return null;
  }
}

export default function PdfUploadComponent({ userId, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
  const [error, setError] = useState('');
  const APP_NAME = 'orchestrator_agent';

  const handleFileChange = (event) => {
    // ... (This function remains the same)
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setStatus('idle');
      setError('');
    } else {
      setSelectedFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  const handleUploadAndCreateSession = async () => {
    if (!selectedFile) {
      setError('No file selected.');
      return;
    }

    setStatus('uploading');
    setError('');

    try {
      // Step 1: Get the state from our FastAPI server
      const formData = new FormData();
      formData.append('file', selectedFile);
      const extractResponse = await fetch('http://localhost:8000/extract/', {
        method: 'POST',
        body: formData,
      });

      if (!extractResponse.ok) {
        throw new Error('Failed to extract data from the report.');
      }
      const initialState = await extractResponse.json();
      console.log("Received initial state from parser:", initialState);

      // Step 2: Use that state to create a session with the ADK server
      const sessionId = await createSessionWithState(APP_NAME, userId, initialState);

      if (!sessionId) {
        throw new Error('Could not create a session with the extracted data.');
      }
      
      setStatus('success');
      // Pass both the new sessionID and the context to the parent
      onUploadSuccess(sessionId, initialState.user_context);

    } catch (err) {
      console.error('Process failed:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  // The JSX for this component remains the same, but the main button's onClick is updated
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-[#25A55F]">Upload Medical Report</h1>
        <p className="text-gray-600">
          Welcome, <strong>{userId}</strong>. Please upload your report to begin.
        </p>

        <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
          {/* ... input and label ... */}
          <input
            type="file"
            id="pdf-upload"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={status === 'uploading'}
          />
          <label
            htmlFor="pdf-upload"
            className={`cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 ${status === 'uploading' ? 'opacity-50' : ''}`}
          >
            <FileUp className="w-5 h-5 mr-2" />
            <span>{selectedFile ? selectedFile.name : 'Select a PDF file'}</span>
          </label>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <button
          onClick={handleUploadAndCreateSession} // Use the new handler
          disabled={!selectedFile || status === 'uploading'}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-[#25A55F] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {status === 'uploading' && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
          {status === 'uploading' ? 'Analyzing and Connecting...' : 'Upload and Start Session'}
        </button>

        {/* ... status messages ... */}
      </div>
    </div>
  );
}