import React, { useState, useEffect, useRef } from 'react';

/**
 * Updates the session state with the context extracted from the PDF.
 * @param {string} appName
 * @param {string} userId
 * @param {string} sessionId
 * @param {object} newContext
 */
async function updateSessionState(appName, userId, sessionId, newContext) {
  try {
    // The ADK API server uses a PUT request to replace the state.
    const response = await fetch(`http://localhost:8000/apps/${appName}/users/${userId}/sessions/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error("Failed to update session state.");
    }
    console.log("Session state successfully updated with PDF context.");
  } catch (error) {
    console.error("Error updating session state:", error);
    alert("Could not update the session with your report details. The chat may not be personalized.");
  }
}


export default function ChatComponent({ userId, sessionId, initialContext }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const APP_NAME = 'orchestrator_agent';

  // This effect runs only once when the component mounts
  useEffect(() => {
    if (initialContext) {
      // Update the session on the backend with the new context
      // updateSessionState(APP_NAME, userId, sessionId, initialContext);

      // Create a personalized welcome message
      const welcomeMessage = {
        role: 'agent',
        author: 'Arogya Mitra',
        content: `Hello, ${initialContext.user_name}. I have reviewed your report. How can I help you today regarding your health?`
      };
      setMessages([welcomeMessage]);
    }
  }, [userId, sessionId, initialContext]); // Dependencies for the effect

  // The rest of the ChatComponent (handleSendMessage, JSX, etc.) remains unchanged...
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isAgentTyping) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsAgentTyping(true);

    try {
      const response = await fetch('http://localhost:8001/run_sse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_name: APP_NAME,
          user_id: userId,
          session_id: sessionId,
          new_message: { role: 'user', parts: [{ text: currentInput }] },
          stream: true,
        }),
      });

      if (!response.body) throw new Error("Response body is missing.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let agentResponse = '';
      let agentAuthor = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const events = chunk.split('\n\n').filter(Boolean);

        for (const eventString of events) {
          if (eventString.startsWith('data:')) {
            const jsonString = eventString.substring(5);
            try {
              const eventData = JSON.parse(jsonString);
              
              if (eventData.author !== 'arogya_mitra_orchestrator' && eventData.content?.parts?.[0]?.text) {
                agentResponse += eventData.content.parts[0].text;
                if (!agentAuthor) {
                  agentAuthor = eventData.author;
                }
              }
            } catch (jsonError) {
              console.error("Failed to parse JSON chunk:", jsonString);
            }
          }
        }
      }

      if (agentResponse) {
        setMessages(prev => [...prev, { role: 'agent', content: agentResponse, author: agentAuthor || 'Agent' }]);
      }

    } catch (error) {
      console.error("Failed to fetch or process stream:", error);
      setMessages(prev => [...prev, { role: 'agent', content: 'Sorry, a connection error occurred.' }]);
    } finally {
      setIsAgentTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Arogya Mitra Chat</h1>
        <p className="text-sm text-gray-500">Logged in as: {userId}</p>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 w-[80vw] max-w-420:w-full m-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'agent' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm mr-3 flex-shrink-0">
                    AI
                </div>
            )}
            <div className={`max-w-lg ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                {msg.author && (
                    <p className="text-xs text-gray-500 mb-1 ml-2">{msg.author}</p>
                )}
                <div className={`px-4 py-2 rounded-xl shadow ${msg.role === 'user' ? 'bg-gradient-to-r from-[#25A55F] to-[#56ab2f] text-white' : 'bg-white text-gray-800'}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
            </div>
          </div>
        ))}
        {isAgentTyping && (
          <div className="flex justify-start">
             <div className="max-w-lg px-4 py-2 rounded-xl shadow bg-white text-gray-800">
               <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                   <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                   <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="bg-white p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask a health question..." className="flex-1 w-full px-4 py-3 text-lg text-gray-700 bg-gray-200 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isAgentTyping} />
          <button
            type="submit"
            disabled={isAgentTyping || !inputValue.trim()}
            className="px-6 py-3 font-semibold text-white bg-[#25A55F] rounded-md hover:bg-[#208a4e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25A55F] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}