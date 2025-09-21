declare module 'html5-qrcode' {
  export interface Html5QrcodeScannerConfig {
    fps?: number;
    qrbox?: { width: number; height: number } | number;
    aspectRatio?: number;
    disableFlip?: boolean;
    verbose?: boolean;
    colorScheme?: string;
    supportedScanTypes?: Html5QrcodeSupportedFormats[];
    experimentalFeatures?: {
      useBarCodeDetectorIfSupported?: boolean;
    };
    rememberLastUsedCamera?: boolean;
    showTorchButtonIfSupported?: boolean;
    showZoomSliderIfSupported?: boolean;
    defaultZoomValueIfSupported?: number;
  }

  export enum Html5QrcodeSupportedFormats {
    QR_CODE = 0,
    AZTEC = 1,
    CODABAR = 2,
    CODE_39 = 3,
    CODE_93 = 4,
    CODE_128 = 5,
    DATA_MATRIX = 6,
    MAXICODE = 7,
    ITF = 8,
    EAN_13 = 9,
    EAN_8 = 10,
    PDF_417 = 11,
    RSS_14 = 12,
    RSS_EXPANDED = 13,
    UPC_A = 14,
    UPC_E = 15,
    UPC_EAN_EXTENSION = 16,
  }

  export interface QrcodeResult {
    text: string;
    format?: string;
  }

  export type QrcodeSuccessCallback = (decodedText: string, decodedResult: QrcodeResult) => void;
  export type QrcodeErrorCallback = (errorMessage: string, error?: Error) => void;

  export class Html5QrcodeScanner {
    constructor(elementId: string, config: Html5QrcodeScannerConfig, verbose?: boolean);
    render(successCallback: QrcodeSuccessCallback, errorCallback?: QrcodeErrorCallback): void;
    clear(): Promise<void>;
    getState(): number;
  }

  export class Html5Qrcode {
    constructor(elementId: string, verbose?: boolean);
    start(
      cameraIdOrConfig: string | MediaTrackConstraints,
      configuration: Html5QrcodeScannerConfig,
      successCallback: QrcodeSuccessCallback,
      errorCallback?: QrcodeErrorCallback
    ): Promise<void>;
    stop(): Promise<void>;
    clear(): Promise<void>;
    getState(): number;
    static getCameras(): Promise<MediaDeviceInfo[]>;
  }
}