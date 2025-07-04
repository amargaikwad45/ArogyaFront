import React, { useState } from 'react';
import { FileUp, LoaderCircle, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * A component for uploading a medical report PDF and getting structured JSON back.
 * @param {object} props
 * @param {string} props.userId - The name of the user who is logged in.
 * @param {(context: object) => void} props.onUploadSuccess - Callback function to pass the extracted user context to the parent.
 */
export default function PdfUploadComponent({ userId, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
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

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('No file selected.');
      return;
    }

    setStatus('uploading');
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Call the FastAPI endpoint we created
      const response = await fetch('http://localhost:8000/extract/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to extract data from the report.');
      }

      const extractedData = await response.json();
      setStatus('success');
      // Pass the fully-formed user_context object to the parent
      onUploadSuccess(extractedData.user_context);

    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-[#25A55F]">Upload Medical Report</h1>
        <p className="text-gray-600">
          Welcome, <strong>{userId}</strong>. Please upload your latest medical report to personalize your session.
        </p>

        <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
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
          onClick={handleUpload}
          disabled={!selectedFile || status === 'uploading'}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-[#25A55F] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {status === 'uploading' && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
          {status === 'uploading' ? 'Analyzing Report...' : 'Upload and Proceed'}
        </button>

        {status === 'success' && (
          <div className="mt-4 flex items-center justify-center text-green-600">
            <CheckCircle className="mr-2 h-5 w-5" />
            <span>Success! Proceeding to chat...</span>
          </div>
        )}
        {status === 'error' && (
           <div className="mt-4 flex items-center justify-center text-red-600">
            <AlertCircle className="mr-2 h-5 w-5" />
            <span>Upload failed. Please try again.</span>
          </div>
        )}
      </div>
    </div>
  );
}