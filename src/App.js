import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // ตรวจสอบว่ามีไฟล์ App.css อยู่ในโฟลเดอร์ src

function App() {
    const [message, setMessage] = useState('');
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [aiName] = useState('swchat.kru'); // กำหนดชื่อ AI ตรงนี้

    // *** สำคัญมาก: เปลี่ยนตรงนี้เป็น URL ของ Backend ของคุณบน Render.com ***
    // ตัวอย่าง: const BACKEND_URL = 'https://your-backend-service-name.onrender.com/api/chat';
    // หากรันบน Local ให้ใช้: http://localhost:3001/api/chat
    const BACKEND_URL = process.env.NODE_ENV === 'production'
        ? 'https://s-er.onrender.com' // <-- *** เปลี่ยน URL นี้ให้เป็น URL จริงของ Backend บน Render ของคุณ ***
        : 'http://localhost:3001/api/chat';

    const handleSendMessage = async () => {
        setLoading(true); // เริ่ม loading state
        setError(''); // ล้าง error เก่า
        setReply(''); // ล้าง reply เก่า

        try {
            // ส่งข้อความไปยัง Backend ที่ Deploy บน Render หรือรันบน Local
            const response = await axios.post(BACKEND_URL, { message });
            setReply(response.data.reply);
        } catch (err) {
            console.error('Error sending message:', err);
            // แสดงข้อความ error ที่เข้าใจง่ายขึ้น
            let errorMessage = 'Failed to get response from AI. Please check server or API key.';
            if (err.response) {
                // ถ้ามี response จาก server (เช่น 400, 500 error)
                errorMessage = `Error from server: ${err.response.status} - ${JSON.stringify(err.response.data.error || err.response.data)}`;
            } else if (err.request) {
                // ถ้าไม่มี response จาก server (เช่น server ไม่ทำงาน, CORS blocking)
                errorMessage = `No response from server. Backend might be down or URL is incorrect. (${err.message})`;
            } else {
                // Error อื่นๆ
                errorMessage = `An unexpected error occurred: ${err.message}`;
            }
            setError(errorMessage);
        } finally {
            setLoading(false); // หยุด loading state ไม่ว่าสำเร็จหรือเกิด error
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>{aiName}</h1> {/* แสดงชื่อ AI */}
                <div className="chat-container">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows="5"
                        cols="50"
                        disabled={loading} // ปิดการใช้งานเมื่อ loading
                    />
                    <br />
                    <button onClick={handleSendMessage} disabled={loading || !message.trim()}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                    {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>} {/* แสดง error */}
                    {reply && (
                        <div className="ai-reply">
                            <h2>{aiName}'s Reply:</h2>
                            <p>{reply}</p>
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
}

export default App;
