import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  src: string;
  alt: string;
  onClose: () => void;
}

// Click-to-zoom lightbox for service deliverable screenshots. Portaled to body so
// it sits above the BackgroundProvider canvas and nav. ESC + backdrop click close.
export const ImageLightbox = ({ src, alt, onClose }: Props) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // lock page scroll while the modal is up
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-text transition-colors hover:bg-white/10"
      >
        ✕
      </button>

      <img
        src={src}
        alt={alt}
        // stopPropagation so clicking the image itself doesn't dismiss
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-[92vw] rounded-xl border border-white/10 object-contain shadow-2xl"
      />

      <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted/80">
        click anywhere / press esc to close
      </p>
    </div>,
    document.body
  );
};
