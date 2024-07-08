import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim() === '') return;

    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setQuery('');
    setLoading(true);

    try {
      const result = await axios.post('http://127.0.0.1:8000/app/rag/', { question: query });
      setMessages([...newMessages, { sender: 'bot', text: result.data.answer }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'bot', text: 'Error fetching response' }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="app-container">
      <div className="chat-header">
        <img src="chatbot-icon.png" alt="Chatbot Icon" className="chat-icon" />
        <div className="chat-info">
          <h2 className='name-class'>Chatbot</h2>
          <p className='status-class'>We’re online</p>
        </div>
      </div>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <p className={`${msg.sender}-message`}>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="query-form">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Enter your message..."
          className="query-input"
        />
        {!loading ?
          <button type="submit" className="send-button" disabled={loading}>
            {'➤'}
          </button> :
          <div className="spinner"></div>}
      </form>
    </div>
  );
};

export default App;
