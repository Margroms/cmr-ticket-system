"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5QrcodeScanner, Html5QrcodeScannerConfig, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface QRScannerProps {
  onScan: (data: string) => void;
  isActive: boolean;
  title?: string;
}

export default function QRScanner({ onScan, isActive, title }: QRScannerProps) {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const elementId = "qr-reader";

  const stopScanner = useCallback(() => {
    if (scanner) {
      scanner.clear()
        .then(() => {
          setScanner(null);
          setIsScanning(false);
        })
        .catch((clearError) => {
          console.error("Error clearing scanner:", clearError);
          setScanner(null);
          setIsScanning(false);
        });
    }
  }, [scanner]);

  const handleScanSuccess = useCallback((decodedText: string) => {
    console.log("QR Code scanned:", decodedText);
    onScan(decodedText);
    stopScanner();
  }, [onScan, stopScanner]);

  const handleScanError = useCallback((errorMessage: string) => {
    // Only log non-trivial errors
    if (!errorMessage.includes("NotFoundException") && !errorMessage.includes("No MultiFormat Readers")) {
      console.warn("QR Scan error:", errorMessage);
    }
  }, []);

  const startScanner = useCallback(() => {
    if (scanner || !scannerRef.current) return;

    try {
      const config: Html5QrcodeScannerConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeSupportedFormats.QR_CODE],
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 2,
      };

      const newScanner = new Html5QrcodeScanner(elementId, config, false);

      newScanner.render(handleScanSuccess, handleScanError);

      setScanner(newScanner);
      setIsScanning(true);
      setError(null);
    } catch (err) {
      console.error("Failed to initialize QR scanner:", err);
      setError("Failed to initialize camera. Please check permissions.");
    }
  }, [scanner, handleScanSuccess, handleScanError]);

  const handleManualInput = () => {
    const qrData = prompt("Enter QR code data manually:");
    if (qrData?.trim()) {
      onScan(qrData.trim());
    }
  };

  useEffect(() => {
    if (isActive && !isScanning) {
      startScanner();
    } else if (!isActive && isScanning) {
      stopScanner();
    }

    return () => {
      if (scanner) {
        stopScanner();
      }
    };
  }, [isActive, isScanning, startScanner, stopScanner, scanner]);

  if (!isActive) {
    return (
      <div className="text-center p-8">
        <div className="w-full max-w-md mx-auto h-64 rounded-lg bg-neutral-800 flex items-center justify-center">
          <p className="text-neutral-400">Scanner not active</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scanner Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center ring-2 ring-white/20">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white">
            {title || "QR Code Scanner"}
          </h3>
        </div>
        <p className="text-neutral-400 text-sm">
          Position the QR code within the scanning area
        </p>
      </div>

      {/* Scanner Area */}
      <div className="rounded-2xl bg-neutral-950 ring-1 ring-white/10 p-4 transition-colors">
        <div className="text-center">
          <div 
            id={elementId}
            ref={scannerRef}
            className="mx-auto w-full max-w-[320px] min-h-[320px] overflow-hidden rounded-xl border-2 border-white/20 bg-black"
          />
          
          {error && (
            <div className="mt-4 p-3 bg-red-400/10 ring-1 ring-red-400/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {isScanning && (
            <p className="text-green-400 text-sm mt-3 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Scanner active - point camera at QR code
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isScanning ? (
          <button
            onClick={startScanner}
            className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Stop Scanner
          </button>
        )}
        
        <button
          onClick={handleManualInput}
          className="px-6 h-12 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4" />
          </svg>
          Manual Input
        </button>
      </div>

      {/* Info Note */}
      <div className="p-4 bg-blue-400/10 ring-1 ring-blue-400/20 rounded-xl">
        <p className="text-blue-300 text-sm">
          <strong>Tip:</strong> Make sure the QR code is well-lit and clearly visible. 
          You can also use the manual input option if camera scanning isn&apos;t working.
        </p>
      </div>
    </div>
  );
}