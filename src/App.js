import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="app-container">
      <div className="content">
        <h1>جلسات الهولنس وورك</h1>
        <p className="subtitle">برنامج علاجي تفاعلي للتأمل والتطور الشخصي</p>
        
        <div className="welcome-section">
          <h2>مرحباً بك</h2>
          <p>يجاري إعداد التطبيق. تحقق قريباً من المحتوى الكامل.</p>
        </div>

        <div className="status">
          <p>✓ الموقع نشط وجاهز</p>
          <p>⏳ تحميل البيانات...</p>
        </div>
      </div>
    </div>
  );
}

export default App;
