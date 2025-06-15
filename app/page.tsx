'use client';

import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export default function Home() {
  const [fileId, setFileId] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Initialize Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }

    // Get file_id from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const fileIdParam = urlParams.get('file_id');
    
    if (fileIdParam) {
      setFileId(fileIdParam);
      setLoading(true);
      
      // Get file path from Telegram API
      fetch(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/getFile?file_id=${fileIdParam}`)
        .then(response => response.json())
        .then(data => {
          console.log('Telegram API response:', data);
          
          if (data.ok && data.result && data.result.file_path) {
            const filePath = data.result.file_path;
            const fileUrl = `https://api.telegram.org/file/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/${filePath}`;
            console.log('Generated file URL:', fileUrl);
            setPdfUrl(fileUrl);
          } else {
            console.error('Invalid API response:', data);
            setError('Помилка отримання файлу: ' + (data.description || 'Невідома помилка'));
          }
        })
        .catch(err => {
          console.error('Error fetching file:', err);
          setError('Помилка при спробі отримати файл: ' + err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    console.log('PDF loaded successfully, pages:', numPages);
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setError('Помилка завантаження PDF файлу: ' + error.message);
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">PDF Viewer</h1>
        
        {loading ? (
          <div className="text-center p-4">
            Завантаження...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4 border border-red-500 rounded">
            {error}
          </div>
        ) : pdfUrl ? (
          <div className="border rounded-lg p-4">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="flex justify-center"
              loading={
                <div className="text-center p-4">
                  Завантаження PDF...
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber} 
                width={Math.min(window.innerWidth - 32, 800)}
                className="shadow-lg"
                loading={
                  <div className="text-center p-4">
                    Завантаження сторінки...
                  </div>
                }
              />
            </Document>
            
            {numPages && (
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => setPageNumber(page => Math.max(1, page - 1))}
                  disabled={pageNumber <= 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  Previous
                </button>
                <span className="py-2">
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={() => setPageNumber(page => Math.min(numPages, page + 1))}
                  disabled={pageNumber >= numPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No PDF file selected
          </div>
        )}
      </div>
    </main>
  );
}
