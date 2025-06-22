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
  const [manualFileId, setManualFileId] = useState('');

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
      fetchFilePathAndSetUrl(fileId);
    }
  }, []);

  const fetchFilePathAndSetUrl = async (fileId: string) => {
    try {
      const fileRes = await fetch(`/api/proxy-pdf?file_id=${fileId}`);
      if (fileRes.ok) {
        const blob = await fileRes.blob();
        const blobUrl = URL.createObjectURL(blob);
        setPdfUrl(blobUrl);
      } else {
        setPdfUrl('');
      }
    } catch {
      setPdfUrl('');
    }
  };

  const handleManualFileId = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualFileId) {
      fetchFilePathAndSetUrl(manualFileId);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">PDF Viewer</h1>
        <form onSubmit={handleManualFileId} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Введіть file_id..."
            value={manualFileId}
            onChange={e => setManualFileId(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Показати</button>
        </form>
        
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
