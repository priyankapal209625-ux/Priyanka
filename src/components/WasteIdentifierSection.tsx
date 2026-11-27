import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, FormEvent } from 'react';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  HelpCircle,
  Info,
  Leaf,
  Loader2,
  Recycle,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  SwitchCamera,
  Upload,
  X,
} from 'lucide-react';
import {
  QUICK_TEXT_EXAMPLES,
  SAMPLE_SCAN_PHOTOS,
} from '../data/wasteContent';
import type {
  IndianLocation,
  ScanHistoryEntry,
  WasteAnalysisResult,
  WasteCategoryType,
} from '../types/waste';
import { LocalGuidanceSelector } from './LocalGuidanceSelector';
import { SafeImage } from './SafeImage';

interface WasteIdentifierSectionProps {
  history: ScanHistoryEntry[];
  location: IndianLocation;
  onChangeLocation: (next: IndianLocation) => void;
  onAddHistory: (entry: ScanHistoryEntry) => void;
  onClearHistory: () => void;
  pendingTextQuery: string | null;
  onClearPendingQuery: () => void;
  openCameraSignal?: number;
}

const MAX_DIMENSION = 1280;

async function compressImageBlobToBase64(
  blob: Blob
): Promise<{ base64: string; mimeType: string; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      try {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Could not initialize image processor.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        URL.revokeObjectURL(objectUrl);
        resolve({
          base64: dataUrl,
          mimeType: 'image/jpeg',
          previewUrl: dataUrl,
        });
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(
        new Error(
          'Unable to read the selected image file. Please try a JPG, PNG, or WebP photo.'
        )
      );
    };
    img.src = objectUrl;
  });
}

function getCategoryMeta(category: WasteCategoryType) {
  switch (category) {
    case 'Wet Waste':
      return {
        label: 'Wet Waste · Biodegradable / Compostable (SWM Rules, 2026)',
        bgClass: 'bg-[#EBF7F0]',
        borderClass: 'border-[#B9E2CA]',
        textClass: 'text-[#0B5D38]',
        Icon: Leaf,
      };
    case 'Dry Waste':
      return {
        label: 'Dry Waste · Recyclable / Non-Biodegradable (SWM Rules, 2026)',
        bgClass: 'bg-[#EFF7FC]',
        borderClass: 'border-[#BAE0F5]',
        textClass: 'text-[#075985]',
        Icon: Recycle,
      };
    case 'Sanitary Waste':
      return {
        label: 'Sanitary Waste · Wrap Securely & Keep Separate (SWM Rules, 2026)',
        bgClass: 'bg-[#FEF6EC]',
        borderClass: 'border-[#F8D8B0]',
        textClass: 'text-[#9A3412]',
        Icon: ShieldAlert,
      };
    case 'Special Care Waste':
      return {
        label: 'Special Care Waste · Authorised Collection Only (SWM Rules, 2026)',
        bgClass: 'bg-[#FEF2F2]',
        borderClass: 'border-[#FECACA]',
        textClass: 'text-[#991B1B]',
        Icon: AlertTriangle,
      };
    case 'Unclear':
    default:
      return {
        label: 'Unclear Item · More Details Needed Before Disposal',
        bgClass: 'bg-[#F8FAFC]',
        borderClass: 'border-[#CBD5E1]',
        textClass: 'text-[#334155]',
        Icon: HelpCircle,
      };
  }
}

export function WasteIdentifierSection({
  history,
  location,
  onChangeLocation,
  onAddHistory,
  onClearHistory,
  pendingTextQuery,
  onClearPendingQuery,
  openCameraSignal = 0,
}: WasteIdentifierSectionProps) {
  const [mode, setMode] = useState<'photo' | 'text'>('photo');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imagePayload, setImagePayload] = useState<{
    base64: string;
    mimeType: string;
    label: string;
  } | null>(null);
  const [photoNotes, setPhotoNotes] = useState('');
  const [textQuery, setTextQuery] = useState('');
  const [clarificationReply, setClarificationReply] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Live Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<WasteAnalysisResult | null>(null);
  const [activeResultSource, setActiveResultSource] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsStartingCamera(false);
  }, []);

  // Ensure camera stream stops cleanly on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Attach active MediaStream to the <video> element once mounted
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      void videoRef.current.play().catch(() => {
        // Autoplay may resolve asynchronously once metadata loads
      });
    }
  }, [isCameraActive]);

  const startLiveCamera = async (preferredFacing: 'environment' | 'user' = facingMode) => {
    setMode('photo');
    setErrorMessage(null);
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        'Live camera preview is not supported in this browser. Opening your device camera picker instead.'
      );
      cameraInputRef.current?.click();
      return;
    }

    // Stop any previous stream before opening a new one
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsStartingCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: preferredFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setFacingMode(preferredFacing);
      setIsCameraActive(true);
    } catch (err) {
      const errName = err instanceof Error ? err.name : '';
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setCameraError(
          'Camera permission was denied. Please allow camera access in your browser settings, or use "Upload Image" / "Device Camera".'
        );
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        setCameraError(
          'No camera was detected on this device. You can upload an image or test one of the sample photos below.'
        );
      } else {
        setCameraError(
          'Could not open the live camera directly. You can try your device camera picker or upload a photo.'
        );
      }
      setIsCameraActive(false);
    } finally {
      setIsStartingCamera(false);
    }
  };

  const runTextLookup = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (trimmed.length < 2) {
      setErrorMessage(
        'Please enter an item name (for example, "empty milk packet" or "expired medicine strip").'
      );
      return;
    }

    stopCameraStream();
    setMode('text');
    setTextQuery(trimmed);
    setIsAnalyzing(true);
    setErrorMessage(null);
    setClarificationReply('');

    try {
      const response = await fetch('/api/ask-disposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: trimmed,
          location,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not analyze that waste item right now.');
      }

      const analysis: WasteAnalysisResult = data.result;
      setResult(analysis);
      setActiveResultSource(`Text lookup · "${trimmed}" · ${location.city}`);

      onAddHistory({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        source: 'text',
        queryLabel: trimmed,
        locationLabel: `${location.city}, ${location.state}`,
        result: analysis,
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to reach the AI assistant. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (pendingTextQuery) {
      void runTextLookup(pendingTextQuery);
      onClearPendingQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTextQuery]);

  useEffect(() => {
    if (openCameraSignal > 0) {
      void startLiveCamera('environment');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCameraSignal]);

  const runPhotoAnalysis = async (
    payloadOverride?: { base64: string; mimeType: string; label: string },
    previewOverride?: string,
    notesOverride?: string
  ) => {
    const payload = payloadOverride ?? imagePayload;
    if (!payload) {
      setErrorMessage('Please capture a camera photo, upload an image, or choose a sample photo first.');
      return;
    }

    const effectiveNotes = (notesOverride ?? photoNotes).trim();

    setIsAnalyzing(true);
    setErrorMessage(null);
    setClarificationReply('');

    try {
      const response = await fetch('/api/identify-waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: payload.base64,
          mimeType: payload.mimeType,
          notes: effectiveNotes || undefined,
          location,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'AI photo analysis failed. Please try again.');
      }

      const analysis: WasteAnalysisResult = data.result;
      setResult(analysis);
      setActiveResultSource(`${payload.label} · ${location.city}`);

      onAddHistory({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        source: 'photo',
        queryLabel: analysis.itemName,
        thumbnailUrl: previewOverride ?? previewUrl ?? undefined,
        locationLabel: `${location.city}, ${location.state}`,
        result: analysis,
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to analyze the image right now. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCaptureFromLiveCamera = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError('Camera is still focusing. Please wait a second and try again.');
      return;
    }

    let width = video.videoWidth;
    let height = video.videoHeight;
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setCameraError('Could not capture image from camera.');
      return;
    }

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    const payload = {
      base64: dataUrl,
      mimeType: 'image/jpeg',
      label: 'Live camera capture',
    };

    // Stop camera, show snapshot, and immediately ask AI about the captured picture
    stopCameraStream();
    setPreviewUrl(dataUrl);
    setImagePayload(payload);
    void runPhotoAnalysis(payload, dataUrl);
  };

  const handleFileSelected = async (file: File, autoAnalyze = true) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file (JPG, PNG, WebP, or GIF).');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setErrorMessage('Image is too large (max 12 MB). Please select a smaller photo.');
      return;
    }

    stopCameraStream();
    setErrorMessage(null);
    setCameraError(null);
    try {
      const compressed = await compressImageBlobToBase64(file);
      const payload = {
        base64: compressed.base64,
        mimeType: compressed.mimeType,
        label: `Photo scan · ${file.name || 'Camera photo'}`,
      };
      setPreviewUrl(compressed.previewUrl);
      setImagePayload(payload);
      if (autoAnalyze) {
        void runPhotoAnalysis(payload, compressed.previewUrl);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to process selected image.'
      );
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFileSelected(file, true);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFileSelected(file, true);
    }
  };

  const handleSamplePhotoClick = async (
    sample: (typeof SAMPLE_SCAN_PHOTOS)[number]
  ) => {
    stopCameraStream();
    setMode('photo');
    setErrorMessage(null);
    setCameraError(null);
    setIsAnalyzing(true);
    try {
      const res = await fetch(sample.imageUrl);
      if (!res.ok) {
        throw new Error('Could not load the sample image.');
      }
      const blob = await res.blob();
      const compressed = await compressImageBlobToBase64(blob);
      const payload = {
        base64: compressed.base64,
        mimeType: compressed.mimeType,
        label: `Sample photo · ${sample.label}`,
      };
      setPreviewUrl(sample.imageUrl);
      setImagePayload(payload);
      await runPhotoAnalysis(payload, sample.imageUrl, '');
    } catch (err) {
      setIsAnalyzing(false);
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to run sample photo analysis.'
      );
    }
  };

  const handleClearPhoto = () => {
    stopCameraStream();
    setPreviewUrl(null);
    setImagePayload(null);
    setPhotoNotes('');
    setErrorMessage(null);
    setCameraError(null);
  };

  const handleTextFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    void runTextLookup(textQuery);
  };

  const handleClarificationSubmit = (e: FormEvent) => {
    e.preventDefault();
    const extra = clarificationReply.trim();
    if (!extra) return;

    if (mode === 'photo' && imagePayload) {
      const combinedNotes = [photoNotes.trim(), extra].filter(Boolean).join('. ');
      setPhotoNotes(combinedNotes);
      void runPhotoAnalysis(imagePayload, previewUrl ?? undefined, combinedNotes);
    } else {
      const combinedQuery = [textQuery.trim(), extra].filter(Boolean).join(' — ');
      void runTextLookup(combinedQuery);
    }
  };

  const categoryMeta = result ? getCategoryMeta(result.category) : null;

  return (
    <section
      id="identify"
      className="py-16 lg:py-20 bg-[#F7FAF8] scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#0F7A4A] mb-2">
              01. AI Waste Identification (India)
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2419]">
              Capture with camera or upload to identify waste instantly
            </h2>
            <p className="mt-3 text-base text-[#3E5448] leading-relaxed">
              Open your live camera to snap any Indian household, school, or
              market waste item—EcoSmart AI immediately analyzes the photo and
              tells you its SWM Rules, 2026 category and safe disposal steps.
            </p>
          </div>

          {/* Interactive Mode Switcher */}
          <div
            role="tablist"
            aria-label="Waste identification method"
            className="inline-flex items-center p-1 bg-[#E7F0EA] rounded-lg self-start md:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'photo'}
              onClick={() => {
                setMode('photo');
                setErrorMessage(null);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 min-h-[40px] text-sm font-semibold rounded-md transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                mode === 'photo'
                  ? 'bg-white text-[#0F2419] shadow-xs'
                  : 'text-[#3E5448] hover:text-[#0F2419]'
              }`}
            >
              <Camera className="w-4 h-4" aria-hidden="true" />
              <span>Camera &amp; Photo</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'text'}
              onClick={() => {
                stopCameraStream();
                setMode('text');
                setErrorMessage(null);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 min-h-[40px] text-sm font-semibold rounded-md transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                mode === 'text'
                  ? 'bg-white text-[#0F2419] shadow-xs'
                  : 'text-[#3E5448] hover:text-[#0F2419]'
              }`}
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>Text Lookup</span>
            </button>
          </div>
        </div>

        {/* Two-Zone Interactive AI Workbench */}
        <div className="bg-white border border-[#E2EBE5] rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E2EBE5]">
            {/* Left Zone: Input Stage */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Compact Indian State & City Selector synced across app */}
                <LocalGuidanceSelector
                  location={location}
                  onChangeLocation={onChangeLocation}
                  compact
                />

                {mode === 'photo' ? (
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <h3 className="text-lg font-semibold text-[#0F2419]">
                        {isCameraActive
                          ? 'Live Camera Scanner'
                          : previewUrl
                          ? 'Captured Waste Photo'
                          : 'Scan with camera or upload photo'}
                      </h3>
                      {(previewUrl || isCameraActive) && (
                        <button
                          type="button"
                          onClick={handleClearPhoto}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#62786C] hover:text-[#0F2419] transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{isCameraActive ? 'Close camera' : 'Clear'}</span>
                        </button>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={onFileInputChange}
                      className="hidden"
                    />
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={onFileInputChange}
                      className="hidden"
                    />

                    {cameraError && (
                      <div
                        role="alert"
                        className="mb-4 p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] flex items-start justify-between gap-2"
                      >
                        <span>{cameraError}</span>
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="font-semibold underline whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Device Camera
                        </button>
                      </div>
                    )}

                    {/* State 1: Active Live Camera Viewfinder */}
                    {isCameraActive ? (
                      <div className="space-y-4">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#0F7A4A] bg-[#0F2419]">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <p className="text-xs text-[#62786C]">
                          Hold the waste item clearly in good lighting and click
                          below to capture and identify immediately.
                        </p>

                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            disabled={isAnalyzing}
                            onClick={handleCaptureFromLiveCamera}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-[#0F7A4A] rounded-lg hover:bg-[#0B613B] disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <Camera className="w-4 h-4" aria-hidden="true" />
                            <span>Capture &amp; Identify Now</span>
                          </button>

                          <button
                            type="button"
                            aria-label="Switch front or rear camera"
                            onClick={() =>
                              void startLiveCamera(
                                facingMode === 'environment' ? 'user' : 'environment'
                              )
                            }
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[44px] text-sm font-medium text-[#0F2419] bg-[#F7FAF8] border border-[#D4E2D9] rounded-lg hover:bg-[#EFF6F1] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <SwitchCamera className="w-4 h-4" aria-hidden="true" />
                            <span>Flip</span>
                          </button>
                        </div>
                      </div>
                    ) : !previewUrl ? (
                      /* State 2: Initial Dropzone + Instant Live Camera Button */
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`rounded-lg border-2 border-dashed p-7 text-center transition-colors duration-150 ${
                          isDragging
                            ? 'border-[#0F7A4A] bg-[#EBF7F0]'
                            : 'border-[#C8DACF] bg-[#F7FAF8] hover:border-[#0F7A4A]/60'
                        }`}
                      >
                        <div className="mx-auto w-12 h-12 rounded-full bg-white border border-[#E2EBE5] flex items-center justify-center text-[#0F7A4A] mb-3">
                          <Camera className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-semibold text-[#0F2419]">
                          Point your camera or drop a waste photo here
                        </p>
                        <p className="mt-1 text-xs text-[#62786C]">
                          Photos are analyzed automatically right after capture
                          or selection
                        </p>

                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                          <button
                            type="button"
                            disabled={isStartingCamera || isAnalyzing}
                            onClick={() => void startLiveCamera('environment')}
                            className="inline-flex items-center gap-2 px-4 py-2 min-h-[42px] text-sm font-semibold text-white bg-[#0F7A4A] rounded-lg hover:bg-[#0B613B] disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            {isStartingCamera ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                                <span>Opening Camera...</span>
                              </>
                            ) : (
                              <>
                                <Camera className="w-4 h-4" aria-hidden="true" />
                                <span>Open Live Camera</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            disabled={isAnalyzing}
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-2 px-4 py-2 min-h-[42px] text-sm font-medium text-[#0F2419] bg-white border border-[#D4E2D9] rounded-lg hover:bg-[#EFF6F1] disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <Upload className="w-4 h-4" aria-hidden="true" />
                            <span>Upload Image</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* State 3: Captured/Uploaded Preview + Retake or Optional Note Re-Analysis */
                      <div className="space-y-4">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E2EBE5] bg-[#EFF6F1]">
                          <img
                            src={previewUrl}
                            alt="Selected waste item preview for AI analysis"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="photo-context-note"
                            className="block text-xs font-medium text-[#3E5448] mb-1.5"
                          >
                            Add an optional note &amp; re-check (e.g., &ldquo;contains leftover paint&rdquo; or &ldquo;rinsed milk packet&rdquo;)
                          </label>
                          <input
                            id="photo-context-note"
                            type="text"
                            value={photoNotes}
                            onChange={(e) => setPhotoNotes(e.target.value)}
                            placeholder="Add helpful context if you want to refine the result..."
                            maxLength={200}
                            className="w-full px-3.5 py-2.5 text-sm text-[#0F2419] bg-[#F7FAF8] border border-[#D4E2D9] rounded-lg placeholder:text-[#7E9488] focus:bg-white focus:border-[#0F7A4A] focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            disabled={isAnalyzing}
                            onClick={() => void startLiveCamera(facingMode)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-[#0F7A4A] rounded-lg hover:bg-[#0B613B] disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <Camera className="w-4 h-4" aria-hidden="true" />
                            <span>Scan New Photo</span>
                          </button>

                          <button
                            type="button"
                            disabled={isAnalyzing}
                            onClick={() => void runPhotoAnalysis()}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] text-sm font-medium text-[#0F2419] bg-[#F7FAF8] border border-[#D4E2D9] rounded-lg hover:bg-[#EFF6F1] disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                                <span>Analyzing...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4" aria-hidden="true" />
                                <span>Re-Analyze</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            disabled={isAnalyzing}
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3.5 py-2.5 min-h-[44px] text-sm font-medium text-[#0F2419] bg-[#F7FAF8] border border-[#D4E2D9] rounded-lg hover:bg-[#EFF6F1] disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Sample Photos */}
                    <div className="mt-7 pt-6 border-t border-[#E2EBE5]">
                      <p className="text-xs font-semibold text-[#3E5448] mb-3">
                        Test live AI detection with a sample image:
                      </p>
                      <div className="grid grid-cols-3 gap-2.5">
                        {SAMPLE_SCAN_PHOTOS.map((sample) => (
                          <button
                            key={sample.id}
                            type="button"
                            disabled={isAnalyzing}
                            onClick={() => void handleSamplePhotoClick(sample)}
                            className="group text-left rounded-lg border border-[#E2EBE5] overflow-hidden bg-[#F7FAF8] hover:border-[#0F7A4A] disabled:opacity-60 transition-colors cursor-pointer"
                          >
                            <div className="aspect-[4/3] overflow-hidden bg-[#EFF6F1]">
                              <SafeImage
                                src={sample.imageUrl}
                                alt={sample.label}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-semibold text-[#0F2419] truncate">
                                {sample.label}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F2419] mb-2">
                      Describe an Indian household or school waste item
                    </h3>
                    <p className="text-sm text-[#62786C] mb-5">
                      Type any everyday item—such as milk pouches, puja flowers,
                      used diapers, CFL bulbs, or batteries—to check its SWM
                      Rules, 2026 category.
                    </p>

                    <form onSubmit={handleTextFormSubmit} className="space-y-3">
                      <div>
                        <label htmlFor="waste-text-query" className="sr-only">
                          Waste item description
                        </label>
                        <input
                          id="waste-text-query"
                          type="text"
                          value={textQuery}
                          onChange={(e) => setTextQuery(e.target.value)}
                          placeholder="e.g., empty milk packet, expired medicine strip, CFL bulb"
                          maxLength={260}
                          className="w-full px-4 py-3 text-sm text-[#0F2419] bg-[#F7FAF8] border border-[#D4E2D9] rounded-lg placeholder:text-[#7E9488] focus:bg-white focus:border-[#0F7A4A] focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isAnalyzing}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] text-sm font-semibold text-white bg-[#0F7A4A] rounded-lg hover:bg-[#0B613B] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                            <span>Checking with AI...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4" aria-hidden="true" />
                            <span>Check Disposal Method</span>
                          </>
                        )}
                      </button>
                    </form>

                    <div className="mt-7 pt-6 border-t border-[#E2EBE5]">
                      <p className="text-xs font-semibold text-[#3E5448] mb-3">
                        Common Indian household &amp; campus items:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {QUICK_TEXT_EXAMPLES.map((example) => (
                          <button
                            key={example}
                            type="button"
                            disabled={isAnalyzing}
                            onClick={() => void runTextLookup(example)}
                            className="text-left px-3 py-2.5 min-h-[40px] text-xs font-medium text-[#2A4235] bg-[#F7FAF8] border border-[#E2EBE5] rounded-lg hover:border-[#0F7A4A] hover:text-[#0F7A4A] disabled:opacity-60 transition-colors truncate cursor-pointer"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Zone: Structured AI Result Stage */}
            <div
              className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white"
              aria-live="polite"
            >
              {errorMessage && (
                <div
                  role="alert"
                  className="mb-6 p-4 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold">Analysis could not be completed</p>
                      <p className="mt-1 text-sm text-[#7F1D1D]">{errorMessage}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (mode === 'photo' && imagePayload) {
                        void runPhotoAnalysis();
                      } else if (mode === 'text' && textQuery.trim()) {
                        void runTextLookup(textQuery);
                      } else {
                        setErrorMessage(null);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#991B1B] bg-white border border-[#FECACA] rounded-md hover:bg-[#FEE2E2] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <div className="w-12 h-12 rounded-full bg-[#EBF7F0] flex items-center justify-center text-[#0F7A4A] mb-4">
                    <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0F2419]">
                    Identifying item under India’s SWM Rules, 2026...
                  </h3>
                  <p className="mt-2 text-sm text-[#62786C] max-w-md">
                    Checking material type, safety requirements, appropriate
                    segregation stream, and recycling or reuse options.
                  </p>
                </div>
              ) : result && categoryMeta ? (
                <div className="space-y-6">
                  {/* Category Header Banner */}
                  <div
                    className={`p-4 rounded-lg border ${categoryMeta.bgClass} ${categoryMeta.borderClass} flex flex-wrap items-center justify-between gap-3`}
                  >
                    <div className="flex items-center gap-2.5">
                      <categoryMeta.Icon
                        className={`w-5 h-5 shrink-0 ${categoryMeta.textClass}`}
                        aria-hidden="true"
                      />
                      <span className={`text-sm font-semibold ${categoryMeta.textClass}`}>
                        {categoryMeta.label}
                      </span>
                    </div>
                    <div className="text-xs font-mono tabular-nums text-[#3E5448]">
                      AI Confidence: {result.confidence}%
                    </div>
                  </div>

                  {/* Clarification Request if Image/Input is Unclear */}
                  {result.needsClarification && (
                    <div className="p-4 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] space-y-3">
                      <div className="flex items-start gap-2.5 text-[#92400E]">
                        <HelpCircle
                          className="w-5 h-5 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <div className="text-sm">
                          <p className="font-semibold">
                            More details needed for a safe classification
                          </p>
                          <p className="mt-1 text-[#78350F]">
                            {result.clarificationQuestion}
                          </p>
                        </div>
                      </div>

                      <form
                        onSubmit={handleClarificationSubmit}
                        className="flex flex-col sm:flex-row gap-2"
                      >
                        <label htmlFor="clarification-input" className="sr-only">
                          Add clarification details
                        </label>
                        <input
                          id="clarification-input"
                          type="text"
                          value={clarificationReply}
                          onChange={(e) => setClarificationReply(e.target.value)}
                          placeholder="Describe the material, contents, or condition..."
                          className="flex-1 px-3.5 py-2 text-sm text-[#0F2419] bg-white border border-[#F59E0B]/50 rounded-lg focus:border-[#0F7A4A] focus:outline-none"
                        />
                        <button
                          type="submit"
                          disabled={isAnalyzing}
                          className="px-4 py-2 min-h-[40px] text-xs font-semibold text-white bg-[#0F7A4A] rounded-lg hover:bg-[#0B613B] whitespace-nowrap cursor-pointer"
                        >
                          Update &amp; Re-Check
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Item Name & Unboxed Metadata */}
                  <div>
                    {activeResultSource && (
                      <p className="text-xs text-[#62786C] mb-1">
                        {activeResultSource}
                      </p>
                    )}
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#0F2419]">
                      {result.itemName}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#3E5448]">
                      <span>Material: {result.material}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#0F2419]">
                        Stream: {result.category}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-[#3E5448]">
                      <strong className="text-[#0F2419]">Recommended channel: </strong>
                      {result.recommendedHandling}
                    </p>
                  </div>

                  {/* Special Safety / Authorised Channel Callout */}
                  {(result.requiresSpecialSafetyHandling ||
                    result.authorizedChannelRequired) && (
                    <div className="p-4 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3">
                      <AlertTriangle
                        className="w-5 h-5 text-[#B91C1C] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div className="text-sm text-[#7F1D1D] space-y-1">
                        <p className="font-semibold">
                          {result.category === 'Sanitary Waste'
                            ? 'Sanitary Waste Safety Guidance'
                            : 'Special Care Waste — Authorised Collection Only'}
                        </p>
                        <p>
                          {result.category === 'Sanitary Waste'
                            ? 'Do not place sanitary waste in ordinary Dry recyclable or Wet compost bins. Wrap securely in newspaper or manufacturer pouch to protect sanitation workers.'
                            : 'Never throw batteries, e-waste, expired medicines, CFL bulbs, paint tins, or pesticide containers in ordinary household bins. Use CPCB/SPCB-authorised collection centres or producer EPR take-back channels.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Two-Column Action Guidance */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E2EBE5]">
                    <div>
                      <h4 className="text-sm font-semibold text-[#0F2419] mb-3">
                        Safe Disposal Steps
                      </h4>
                      <ol className="space-y-2.5 text-sm text-[#3E5448]">
                        {result.disposalSteps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="font-mono text-xs font-semibold text-[#0F7A4A] mt-0.5 shrink-0 tabular-nums">
                              0{idx + 1}.
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[#0F2419] mb-3">
                        {result.category === 'Sanitary Waste' ||
                        result.category === 'Special Care Waste'
                          ? 'Safer Alternatives & Reduction Tips'
                          : 'Recycling & Reuse Ideas'}
                      </h4>
                      {result.reuseAndUpcycleIdeas.length > 0 ? (
                        <ul className="space-y-2.5 text-sm text-[#3E5448]">
                          {result.reuseAndUpcycleIdeas.map((idea, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2
                                className="w-4 h-4 text-[#0F7A4A] shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{idea}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-[#62786C]">
                          For health and environmental safety, this item should
                          not be reused at home. Focus on safe segregated
                          handover through the proper channel.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Environmental Impact, Common Mistake, Uncertainty & Local Variation */}
                  <div className="pt-5 border-t border-[#E2EBE5] space-y-3 text-sm">
                    <p className="text-[#3E5448]">
                      <strong className="text-[#0F2419]">Environmental impact: </strong>
                      {result.environmentalImpact}
                    </p>
                    <p className="text-[#3E5448]">
                      <strong className="text-[#9A3412]">Common mistake to avoid: </strong>
                      {result.commonMistake}
                    </p>
                    <div className="pt-3 border-t border-[#E2EBE5] space-y-2 text-xs text-[#62786C]">
                      <p className="flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 text-[#0F7A4A] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>
                          <strong className="text-[#3E5448]">AI uncertainty note: </strong>
                          {result.uncertaintyNote}
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 text-[#0F7A4A] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>
                          <strong className="text-[#3E5448]">Local municipal note: </strong>
                          {result.localVariationNote}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center py-6">
                  <p className="text-xs font-semibold text-[#0F7A4A] mb-2">
                    Instant Camera &amp; AI Scanner · SWM Rules, 2026
                  </p>
                  <h3 className="text-2xl font-bold text-[#0F2419]">
                    Snap a picture to identify waste immediately
                  </h3>
                  <p className="mt-2.5 text-sm text-[#3E5448] leading-relaxed max-w-lg">
                    Click <strong>Open Live Camera</strong> on the left to take
                    a photo—EcoSmart AI immediately identifies the waste type
                    and shows safe Indian disposal steps. If a photo is unclear,
                    it will ask for details instead of guessing.
                  </p>

                  <div className="mt-8 pt-6 border-t border-[#E2EBE5] grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="font-mono text-xs font-semibold text-[#0F7A4A]">
                        01. Capture
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#0F2419]">
                        Live camera or upload
                      </p>
                      <p className="mt-1 text-xs text-[#62786C]">
                        Snapshots are sent straight to AI with zero extra steps.
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-xs font-semibold text-[#0F7A4A]">
                        02. Segregate
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#0F2419]">
                        4 Indian waste streams
                      </p>
                      <p className="mt-1 text-xs text-[#62786C]">
                        Wet, Dry, Sanitary, or Special Care Waste—with clear safety checks.
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-xs font-semibold text-[#0F7A4A]">
                        03. Dispose Safely
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#0F2419]">
                        Practical next steps
                      </p>
                      <p className="mt-1 text-xs text-[#62786C]">
                        Guidance for home composting, kabadiwala/MRF recycling, and authorised e-waste drop-offs.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Identification History Bar */}
        {history.length > 0 && (
          <div className="mt-6 bg-white border border-[#E2EBE5] rounded-xl p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0F2419]">
                <Clock className="w-4 h-4 text-[#0F7A4A]" aria-hidden="true" />
                <span>Recent Identifications ({history.length})</span>
              </div>
              <button
                type="button"
                onClick={onClearHistory}
                className="text-xs font-medium text-[#62786C] hover:text-[#991B1B] transition-colors cursor-pointer"
              >
                Clear history
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {history.slice(0, 4).map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => {
                    setResult(entry.result);
                    setActiveResultSource(
                      `Saved ${entry.source === 'photo' ? 'photo scan' : 'text lookup'} · ${entry.timestamp}${entry.locationLabel ? ` · ${entry.locationLabel}` : ''}`
                    );
                    setErrorMessage(null);
                  }}
                  className="text-left p-3 rounded-lg bg-[#F7FAF8] border border-[#E2EBE5] hover:border-[#0F7A4A] transition-colors cursor-pointer"
                >
                  <p className="text-sm font-semibold text-[#0F2419] truncate">
                    {entry.result.itemName}
                  </p>
                  <p className="mt-1 text-xs text-[#62786C] truncate">
                    {entry.result.category} · {entry.result.confidence}% confidence
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
