import { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentPanel({
  attachments,
  onRemoveAttachment,
  onClearAttachments,
  onRetryUpload,
  disabled,
  uploadProgress = {},
  uploadError,
  attachmentError,
  maxFiles = 4,
}) {
  const { t } = useLanguage();
  const [cameraSupported, setCameraSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCameraSupported(
      !!(
        navigator.mediaDevices?.getUserMedia ||
        "capture" in document.createElement("input") ||
        "mozInputSource" in document.createElement("input")
      )
    );
  }, []);

  const progressItems = attachments.map((attachment) => {
    const progress = uploadProgress[attachment.id];
    const percentage = progress?.total ? Math.min(100, Math.round((progress.loaded / progress.total) * 100)) : 0;
    return {
      ...attachment,
      percentage,
    };
  });

  if (attachments.length === 0 && !attachmentError && !uploadError) {
    return null;
  }

  return (
    <div className="space-y-3 border-t border-clinical-100 bg-white px-3 py-3">
      {attachments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 text-sm text-ink-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-ink-900">Attachments</span>
              <span>{attachments.length} of {maxFiles} files</span>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="group relative overflow-hidden rounded-3xl border border-clinical-200 bg-clinical-50 p-3"
              >
                {attachment.previewUrl ? (
                  <img
                    src={attachment.previewUrl}
                    alt={attachment.name}
                    className="h-24 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-24 items-center justify-center rounded-2xl bg-white text-clinical-700">
                    <FileText size={28} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(attachment.id)}
                  disabled={disabled}
                  className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink-500 shadow-sm transition hover:bg-clinical-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X size={14} />
                </button>
                <div className="mt-2 space-y-1 text-xs text-ink-700">
                  <p className="truncate font-medium">{attachment.name}</p>
                  <p className="text-ink-500">{formatBytes(attachment.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {attachmentError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {attachmentError}
        </div>
      )}

      {uploadError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <p className="font-semibold">Upload failed</p>
          <p className="mt-1">{uploadError}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRetryUpload}
              disabled={disabled}
              className="rounded-full bg-clinical-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-clinical-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={onClearAttachments}
              className="rounded-full border border-clinical-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:bg-clinical-50"
            >
              Remove files
            </button>
          </div>
        </div>
      ) : null}

      {disabled && !uploadError && progressItems.length > 0 ? (
        <div className="rounded-2xl border border-clinical-200 bg-white p-3 text-sm text-ink-600">
          <p className="font-medium text-ink-900">Uploading files...</p>
          <div className="space-y-3 pt-3">
            {progressItems.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-ink-500">
                  <span className="truncate">{item.name}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-clinical-100">
                  <div
                    className="h-full rounded-full bg-clinical-700 transition-all duration-200"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
