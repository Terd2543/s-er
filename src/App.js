import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // ตรวจสอบว่ามีไฟล์ App.css อยู่ในโฟลเดอร์ src

function App() {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]); // เก็บประวัติการสนทนา
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [aiName] = useState('swchat.kru');

    // ตรวจสอบให้แน่ใจว่า URL นี้ถูกต้องสำหรับ Backend ของคุณบน Render
    // เช่น 'https://ai-8mi3.onrender.com/chat' หรือชื่อที่คุณตั้งไว้
    const BACKEND_BASE_URL = 'https://ai-8mi3.onrender.com'; // <--- เปลี่ยน URL นี้ให้เป็น Backend จริงของคุณ!

    const BACKEND_URL = process.env.NODE_ENV === 'production'
        ? `${BACKEND_BASE_URL}/chat`
        : `http://localhost:3001/chat`;

    const handleSendMessage = async () => {
        if (!message.trim()) return; // ไม่ส่งข้อความว่างเปล่า

        const userMessage = { sender: 'user', text: message };
        setChatHistory(prev => [...prev, userMessage]); // เพิ่มข้อความผู้ใช้เข้าประวัติ

        setLoading(true); // เริ่ม loading state
        setError(''); // ล้าง error เก่า
        setMessage(''); // ล้าง input box

        try {
            const response = await axios.post(BACKEND_URL, { message: userMessage.text });
            const aiReply = response.data.reply;
            const aiMessage = { sender: aiName, text: aiReply };
            setChatHistory(prev => [...prev, aiMessage]); // เพิ่มข้อความ AI เข้าประวัติ

        } catch (err) {
            console.error('Error sending message:', err);
            let errorMessage = 'Failed to get response from AI. Please check server or API key.';
            if (err.response) {
                errorMessage = `Error from server: ${err.response.status} - ${JSON.stringify(err.response.data.error || err.response.data)}`;
            } else if (err.request) {
                errorMessage = `No response from server. Backend might be down or URL is incorrect. (${err.message})`;
            } else {
                errorMessage = `An unexpected error occurred: ${err.message}`;
            }
            setError(errorMessage);
            // ถ้ามี error, อาจจะเพิ่มข้อความ error เข้าไปใน chat history ด้วย (optionally)
            setChatHistory(prev => [...prev, { sender: 'system', text: `Error: ${errorMessage}` }]);
        } finally {
            setLoading(false); // หยุด loading state
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // กด Enter โดยไม่กด Shift
            e.preventDefault(); // ป้องกันการขึ้นบรรทัดใหม่
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
                                {msg.text}
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
                            rows="1" // เริ่มต้นที่ 1 บรรทัด และขยายได้
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
