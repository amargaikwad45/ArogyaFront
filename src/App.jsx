import { useState, useEffect } from 'react';
import './App.css';
import LoginComponent from './Components/LoginComponent/LoginComponent.jsx';
import PdfUploadComponent from './Components/PdfUploadComponent/PdfUploadComponent.jsx';
import ChatComponent from './Components/ChatComponent/ChatComponent.jsx';
import LoadingScreen from './Components/LoadingScreen.jsx';

function App() {
  const [appState, setAppState] = useState('loading'); // 'loading', 'login', 'upload', 'chat'
  const [session, setSession] = useState({ userId: null, sessionId: null });
  const [userContext, setUserContext] = useState(null);

  useEffect(() => {
    if (appState === 'loading') {
      const timer = setTimeout(() => {
        setAppState('login');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  // Called from LoginComponent
  const handleLoginSuccess = (userId) => {
    setSession({ ...session, userId });
    setAppState('upload');
  };

  // Called from PdfUploadComponent
  const handleUploadSuccess = (newSessionId, extractedContext) => {
    setSession({ ...session, sessionId: newSessionId });
    setUserContext(extractedContext);
    setAppState('chat');
  };

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