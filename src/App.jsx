import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginComponent from './Components/LoginComponent/LoginComponent.jsx'
import ChatComponent from './Components/ChatComponent/ChatComponent.jsx'
import LoadingScreen from './Components/LoadingScreen.jsx'

function App() {
  const [appState, setAppState] = useState('loading'); // 'loading', 'login', 'chat'
  const [session, setSession] = useState({ userId: null, sessionId: null });

  // Effect to handle the initial loading screen duration
  useEffect(() => {
    if (appState === 'loading') {
      const timer = setTimeout(() => {
        setAppState('login');
      }, 3000); // Show loading screen for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleLoginSuccess = (userId, sessionId) => {
    setSession({ userId, sessionId });
    setAppState('chat');
  };
  
  // Render component based on the current app state
  switch (appState) {
    case 'loading':
      return <LoadingScreen />;
    case 'login':
      return <LoginComponent onLoginSuccess={handleLoginSuccess} />;
    case 'chat':
      return <ChatComponent userId={session.userId} sessionId={session.sessionId} />;
    default:
      return <LoginComponent onLoginSuccess={handleLoginSuccess} />;
  }
}

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//      <div className="w-screen h-screen mt-28 flex items-center justify-center">
//      <h1 className="text-9xl font-bold underline text-blue-500">
//       Hello world!
//     </h1>
//      </div>
//     </>
//   )
// }

export default App
