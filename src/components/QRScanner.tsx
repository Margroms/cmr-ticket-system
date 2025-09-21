"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScannerConfig, Html5QrcodeSupportedFormats } from "html5-qrcode";

interface QRScannerProps {
  onScan: (data: string) => void;
  onError: (error: string) => void;
  isActive: boolean;
}

export default function QRScanner({ onScan, onError, isActive }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const elementId = "qr-reader";

  useEffect(() => {
    if (isActive && !isScanning) {
      startScanner();
    } else if (!isActive && isScanning) {
      stopScanner();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [isActive, isScanning]);

  const startScanner = () => {
    if (scannerRef.current) {
      return; // Scanner already running
    }

    const config: Html5QrcodeScannerConfig = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeSupportedFormats.QR_CODE],
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
      defaultZoomValueIfSupported: 2,
    };

    scannerRef.current = new Html5QrcodeScanner(elementId, config, false);

    scannerRef.current.render(
      (decodedText: string, decodedResult) => {
        console.log("QR Code scanned:", decodedText);
        onScan(decodedText);
        stopScanner();
      },
      (errorMessage) => {
        // Handle scan errors silently in most cases
        // Only show critical errors
        if (errorMessage.includes("NotFoundException")) {
          // This is normal when no QR code is in view
          return;
        }
        console.warn("QR Scan error:", errorMessage);
      }
    );

    setIsScanning(true);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear()
        .then(() => {
          scannerRef.current = null;
          setIsScanning(false);
        })
        .catch((error) => {
          console.error("Error stopping scanner:", error);
          scannerRef.current = null;
          setIsScanning(false);
        });
    }
  };

  return (
    <div className="space-y-4">
      <div id={elementId} className="w-full max-w-md mx-auto" />
      
      {isActive && !isScanning && (
        <div className="text-center">
          <button
            onClick={startScanner}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Start QR Scanner
          </button>
        </div>
      )}

      {isScanning && (
        <div className="text-center">
          <button
            onClick={stopScanner}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          >
            Stop Scanner
          </button>
        </div>
      )}

      {isActive && (
        <div className="text-center text-sm text-neutral-400">
          <p>Position the QR code within the scanning area</p>
          <p>The scanner will automatically detect and process the code</p>
        </div>
      )}
    </div>
  );
}