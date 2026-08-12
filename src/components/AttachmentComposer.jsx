import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, FileText, ImagePlus } from "lucide-react";
import AttachmentPanel from "./AttachmentPanel";
import ChatInput from "./ChatInput";
import { generateId } from "../utils/generateId";

const MAX_FILES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SUPPORTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

function createAttachment(file) {
  return {
    id: generateId("att"),
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
  };
}

export default function AttachmentComposer({
  onSend,
  disabled,
  isBotBusy,
}) {
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [attachmentError, setAttachmentError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(false);

  const menuRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const browseInputRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCameraSupported(
      !!(
        navigator.mediaDevices?.getUserMedia ||
        "capture" in document.createElement("input") ||
        "mozInputSource" in document.createElement("input")
      )
    );

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isComposerBusy = isBotBusy || isUploading || isListening;
  const hasAttachments = pendingAttachments.length > 0;

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      addFiles(files);
    }
    event.target.value = null;
    setMenuOpen(false);
  };

  const addButton = (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((current) => !current)}
        disabled={isComposerBusy}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-clinical-200 bg-clinical-50 text-clinical-700 transition hover:bg-clinical-100 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Add attachment"
      >
        <span className="text-lg font-bold">+</span>
      </button>

      {menuOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-64 overflow-hidden rounded-3xl border border-clinical-200 bg-white p-3 shadow-lg">
          <button
            type="button"
            onClick={() => browseInputRef.current?.click()}
            className="flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left text-sm text-ink-700 transition hover:bg-clinical-50"
          >
            <FileText size={18} />
            <div>
              <div className="font-medium">Document</div>
              <div className="text-xs text-ink-500">PDF or image</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="mt-2 flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left text-sm text-ink-700 transition hover:bg-clinical-50"
          >
            <ImagePlus size={18} />
            <div>
              <div className="font-medium">Photos</div>
              <div className="text-xs text-ink-500">JPG, PNG, WEBP</div>
            </div>
          </button>
          {cameraSupported && (
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="mt-2 flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left text-sm text-ink-700 transition hover:bg-clinical-50"
            >
              <Camera size={18} />
              <div>
                <div className="font-medium">Camera</div>
                <div className="text-xs text-ink-500">Capture image</div>
              </div>
            </button>
          )}
        </div>
      )}

      <input
        ref={browseInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        multiple
        className="hidden"
        onChange={handleFileSelection}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelection}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={handleFileSelection}
      />
    </div>
  );

  const validateFiles = useCallback(
    (files) => {
      const valid = [];
      let error = "";

      const existingCount = pendingAttachments.length;
      if (existingCount + files.length > MAX_FILES) {
        error = "You can attach up to 4 files per message.";
      }

      files.forEach((file) => {
        if (valid.length + existingCount >= MAX_FILES) return;
        if (!SUPPORTED_TYPES.includes(file.type)) {
          error = "This file type isn't supported. Please choose an image or PDF.";
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          error = "This file is too large. Please choose a file that is 5 MB or smaller.";
          return;
        }
        valid.push(createAttachment(file));
      });

      return { valid, error };
    },
    [pendingAttachments.length]
  );

  const addFiles = useCallback(
    (files) => {
      setAttachmentError("");
      setUploadError("");
      const { valid, error } = validateFiles(files);
      if (error) {
        setAttachmentError(error);
      }
      if (valid.length > 0) {
        setPendingAttachments((current) => [...current, ...valid].slice(0, MAX_FILES));
      }
    },
    [validateFiles]
  );

  const removeAttachment = (id) => {
    setPendingAttachments((current) => {
      const next = current.filter((attachment) => attachment.id !== id);
      const removed = current.find((attachment) => attachment.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
    setUploadProgress((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const clearAttachments = () => {
    pendingAttachments.forEach((attachment) => {
      if (attachment.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    });
    setPendingAttachments([]);
    setUploadProgress({});
    setUploadError("");
    setAttachmentError("");
  };

  const handleRetryUpload = () => {
    setUploadError("");
  };

  const handleSend = async (text) => {
    if (isComposerBusy) return;
    if (!text.trim() && pendingAttachments.length === 0) return;

    setUploadError("");
    setAttachmentError("");
    setIsUploading(true);
    setUploadProgress({});

    try {
      const success = await onSend(text, pendingAttachments, (id, loaded, total) => {
        setUploadProgress((prev) => ({
          ...prev,
          [id]: { loaded, total },
        }));
      });
      if (success) {
        clearAttachments();
        setTextValue("");
      } else {
        setUploadError("We couldn't upload your attachment right now. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setUploadError("We couldn't upload your file right now. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <AttachmentPanel
        attachments={pendingAttachments}
        onRemoveAttachment={removeAttachment}
        onClearAttachments={clearAttachments}
        onRetryUpload={handleRetryUpload}
        disabled={isComposerBusy}
        uploadProgress={uploadProgress}
        uploadError={uploadError}
        attachmentError={attachmentError}
        maxFiles={MAX_FILES}
      />
      <ChatInput
        onSend={handleSend}
        onValueChange={setTextValue}
        value={textValue}
        disabled={isBotBusy || isUploading}
        hasAttachments={hasAttachments}
        onListeningChange={setIsListening}
        addButton={addButton}
      />
    </div>
  );
}
