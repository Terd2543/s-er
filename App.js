import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [aiName, setAiName] = useState('swchat.kru');

    // *** เปลี่ยนตรงนี้เป็น URL ของ Backend ของคุณบน Render.com ***
    const BACKEND_URL = 'https://ai-backend-service.onrender.com/api/chat'; // <-- ตัวอย่าง: เปลี่ยนเป็น URL จริงของคุณ

    // ... (โค้ดส่วนอื่น ๆ เหมือนเดิม) ...

    const handleSendMessage = async () => {
        setLoading(true);
        setError('');
        setReply('');

        try {
            // ส่งข้อความไปยัง Backend ที่ Deploy บน Render
            const response = await axios.post(BACKEND_URL, { message });
            setReply(response.data.reply);
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to get response from AI. Please check server or API key.');
            if (err.response && err.response.data && err.response.data.error) {
                setError(`Error: ${JSON.stringify(err.response.data.error)}`);
            } else if (err.message) {
                setError(`Network Error: ${err.message}. Make sure the backend is running and the URL is correct.`);
            }
        } finally {
            setLoading(false);
        }
    };

    // ... (โค้ดส่วนอื่น ๆ เหมือนเดิม) ...
}

export default App;
