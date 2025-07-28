import React from 'react';
import ReactDOM from 'react-dom/client'; // สำหรับ React 18
import './index.css'; // ถ้ามีไฟล์ CSS ของ index
import App from './App'; // นำเข้า App Component ของคุณ
import reportWebVitals from './reportWebVitals'; // สำหรับวัดประสิทธิภาพ (ถ้ามี)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* คอมโพเนนต์ App ของคุณจะถูก Render ที่นี่ */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
