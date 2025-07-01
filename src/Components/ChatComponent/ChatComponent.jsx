import React, { useState, useEffect, useRef } from 'react';


export default function ChatComponent({ userId, sessionId }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const APP_NAME = 'orchestrator_agent';

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
      // **FIXED LOGIC**: Use a single POST request and read its streaming response.
      const response = await fetch('http://localhost:8000/run_sse', {
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

      if (!response.body) {
        throw new Error("Response body is missing.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let agentResponse = '';

      // Read the stream chunk by chunk
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break; // Exit loop when stream is finished
        }
        
        // SSE can send multiple events in one chunk, separated by `\n\n`
        const chunk = decoder.decode(value, { stream: true });
        const events = chunk.split('\n\n').filter(Boolean);

        for (const eventString of events) {
          if (eventString.startsWith('data:')) {
            const jsonString = eventString.substring(5);
            const eventData = JSON.parse(jsonString);
            
            // Look for text from sub-agents
            if (eventData.author !== 'arogya_mitra_orchestrator' && eventData.content?.parts?.[0]?.text) {
              agentResponse += eventData.content.parts[0].text;
            }
          }
        }
      }

      if (agentResponse) {
        setMessages(prev => [...prev, { role: 'agent', content: agentResponse }]);
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
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg px-4 py-2 rounded-xl shadow ${msg.role === 'user' ? 'bg-gradient-to-r from-[#25A55F] to-[#56ab2f] text-white' : 'bg-white text-gray-800'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
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
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a health question..."
            className="flex-1 w-full px-4 py-3 text-lg text-gray-700 bg-gray-200 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isAgentTyping}
          />
          <button
            type="submit"
            disabled={isAgentTyping || !inputValue.trim()}
            className="px-6 py-3 font-semibold text-white bg-[#25A55F] rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25A55F] disabled:bg-[#25A55F] disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
