import { useState, useEffect } from 'react';
import './App.css';
import LoginComponent from './Components/LoginComponent/LoginComponent.jsx';
import PdfUploadComponent from './Components/PdfUploadComponent/PdfUploadComponent.jsx'; // New import
import ChatComponent from './Components/ChatComponent/ChatComponent.jsx';
import LoadingScreen from './Components/LoadingScreen.jsx';

function App() {
  // Add 'upload' to the possible states
  const [appState, setAppState] = useState('loading'); // 'loading', 'login', 'upload', 'chat'
  const [session, setSession] = useState({ userId: null, sessionId: null });
  const [userContext, setUserContext] = useState(null); // State to hold the extracted context

  useEffect(() => {
    if (appState === 'loading') {
      const timer = setTimeout(() => {
        setAppState('login');
      }, 2000); // Shorter loading time
      return () => clearTimeout(timer);
    }
  }, [appState]);

  // Called from LoginComponent on successful login
  const handleLoginSuccess = (userId, sessionId) => {
    setSession({ userId, sessionId });
    setAppState('upload'); // <-- Go to the upload screen next
  };

  // Called from PdfUploadComponent on successful upload
  const handleUploadSuccess = (extractedContext) => {
    setUserContext(extractedContext); // Save the context from the PDF
    setAppState('chat'); // <-- Proceed to chat
  };

  // Render component based on the current app state
  switch (appState) {
    case 'loading':
      return <LoadingScreen />;
    case 'login':
      return <LoginComponent onLoginSuccess={handleLoginSuccess} />;
    case 'upload':
      return <PdfUploadComponent userId={session.userId} onUploadSuccess={handleUploadSuccess} />;
    case 'chat':
      return <ChatComponent userId={session.userId} sessionId={session.sessionId} initialContext={userContext} />;
    default:
      return <LoginComponent onLoginSuccess={handleLoginSuccess} />;
  }
}

export default App;