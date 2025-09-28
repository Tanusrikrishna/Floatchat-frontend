import React, { useState } from 'react';

const Chatbot = ({ onNewChartRequest, isDashboard }) => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: isDashboard ? 'Ask me to generate a chart.' : 'Hello! Ask me about the floats.' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        const userMessage = { sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        
        if (isDashboard) {
            const botMessage = { sender: 'bot', text: `Generating chart for: "${inputValue}"...` };
            setMessages(prev => [...prev, botMessage]);
            onNewChartRequest({ id: Date.now(), title: `Analysis for "${inputValue}"` });
        } else {
            const botMessage = { sender: 'bot', text: `Searching for: "${inputValue}"... (Backend not connected)` };
            setMessages(prev => [...prev, botMessage]);
        }
        setInputValue('');
    };

    return (
        <>
            <div className="chatbot-header">FloatChat AI</div>
            <div className="messages-list">
                {messages.map((msg, index) => <div key={index} className={`message ${msg.sender}`}>{msg.text}</div>)}
            </div>
            <form className="message-form" onSubmit={handleSendMessage}>
                <input type="text" placeholder={isDashboard ? "Request a chart..." : "Ask about a float..."} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <button type="submit">{isDashboard ? "Generate" : "Send"}</button>
            </form>
        </>
    );
};

export default Chatbot;
