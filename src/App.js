import React, { useState } from 'react'; // ไม่ใช้ useEffect แล้วจึงเอาออก
import axios from 'axios';
import './App.css';
import ReactMarkdown from 'react-markdown'; // <--- เพิ่ม: นำเข้า ReactMarkdown
import remarkGfm from 'remark-gfm';       // <--- เพิ่ม: นำเข้า remarkGfm

function App() {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [aiName] = useState('swchat.kru');

    // *** สำคัญมาก: เปลี่ยน URL นี้ให้เป็น Backend ของคุณบน Render ***
    // ตัวอย่าง: 'https://ai-8mi3.onrender.com'
    const BACKEND_BASE_URL = 'https://ai-8mi3.onrender.com';

    const BACKEND_URL = process.env.NODE_ENV === 'production'
        ? `${BACKEND_BASE_URL}/chat`
        : `http://localhost:3001/chat`;

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = { sender: 'user', text: message };
        setChatHistory(prev => [...prev, userMessage]);

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axios.post(BACKEND_URL, { message: userMessage.text });
            const aiReply = response.data.reply;
            const aiMessage = { sender: aiName, text: aiReply };
            setChatHistory(prev => [...prev, aiMessage]);

        } catch (err) {
            console.error('Error sending message:', err);
            let errorMessage = 'Failed to get response from AI. Please check server or API key.';
            if (err.response) {
                // พยายามดึง error message จาก response.data
                errorMessage = `Error from server: ${err.response.status} - ${JSON.stringify(err.response.data.error || err.response.data)}`;
            } else if (err.request) {
                errorMessage = `No response from server. Backend might be down or URL is incorrect. (${err.message})`;
            } else {
                errorMessage = `An unexpected error occurred: ${err.message}`;
            }
            setError(errorMessage);
            setChatHistory(prev => [...prev, { sender: 'system', text: `Error: ${errorMessage}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="chat-window">
                    <div className="chat-header">
                        <h1>{aiName} Chat</h1>
                    </div>
                    <div className="chat-messages">
                        {chatHistory.length === 0 && !loading && !error && (
                            <div className="welcome-message">
                                <p>สวัสดีครับ! ผมคือ {aiName}. คุณมีอะไรให้ผมช่วยไหมครับ?</p>
                            </div>
                        )}
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`message-bubble ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                                <span className="sender-name">{msg.sender === 'user' ? 'คุณ' : aiName}: </span>
                                {/* *** เปลี่ยน: ใช้ ReactMarkdown เพื่อแสดงข้อความ *** */}
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                        ))}
                        {loading && (
                            <div className="message-bubble ai loading">
                                <span className="sender-name">{aiName}: </span> กำลังคิด...
                            </div>
                        )}
                        {error && (
                            <div className="message-bubble system error">
                                <span className="sender-name">System Error: </span> {error}
                            </div>
                        )}
                    </div>
                    <div className="chat-input-area">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="พิมพ์ข้อความ..."
                            rows="1"
                            className="message-input"
                            disabled={loading}
                        />
                        <button onClick={handleSendMessage} disabled={loading || !message.trim()}>
                            ส่ง
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
