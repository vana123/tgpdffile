'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
      };
    };
  }
}

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    // Ініціалізація Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
    
    // Отримання file_id з URL параметрів
    const urlParams = new URLSearchParams(window.location.search);
    const fileId = urlParams.get('file_id');
    
    if (fileId) {
      // Формуємо URL для отримання файлу з Telegram
      const fileUrl = `https://api.telegram.org/file/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/${fileId}`;
      setPdfUrl(fileUrl);
    }
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">PDF Viewer</h1>
        
        {pdfUrl ? (
          <div className="w-full h-[800px] border border-gray-200 rounded-lg overflow-hidden">
            <object
              data={`${pdfUrl}#toolbar=0&navpanes=0`}
              type="application/pdf"
              className="w-full h-full"
            >
              <p>Unable to display PDF file. <a href={pdfUrl}>Download</a> instead.</p>
            </object>
          </div>
        ) : (
          <div className="w-full h-[800px] border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Очікування PDF файлу...
          </div>
        )}
      </div>
    </div>
  );
}
