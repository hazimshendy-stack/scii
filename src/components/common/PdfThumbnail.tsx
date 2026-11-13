import React, { useEffect, useRef, useState } from 'react';

// Use web-standard PDF.js worker via CDN or local module
const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

interface PdfThumbnailProps {
  url: string;
  className?: string;
  onLoaded?: () => void;
}

export const PdfThumbnail: React.FC<PdfThumbnailProps> = ({ url, className = '', onLoaded }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const renderPage = async () => {
      try {
        setLoading(true);
        setError(false);

        // Dynamically import PDF.js
        const pdfjsLib = await import(/* @vite-ignore */ PDFJS_CDN);
        pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;

        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/cmaps/',
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        if (isCancelled) return;

        const page = await pdf.getPage(1);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Render at crisp resolution
        const desiredWidth = 400;
        const scale = desiredWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        await page.render(renderContext).promise;
        if (!isCancelled) {
          setLoading(false);
          onLoaded?.();
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error rendering PDF thumbnail:', url, err);
          setError(true);
          setLoading(false);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-gray-50 overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse text-xs text-gray-400 font-medium">
          PDF...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
          <span className="text-xs font-semibold text-gray-600">PDF Document</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};
