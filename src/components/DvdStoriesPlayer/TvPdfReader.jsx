/**
 * components/DvdStoriesPlayer/TvPdfReader.jsx
 * Renders a single PDF page at A4 aspect ratio inside the TV screen with download support.
 */

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js?url";
import styles from "./DvdStoriesPlayer.module.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function TvPdfReader({ src, page, onPageCount }) {
  const canvasRef = useRef(null);
  const paperRef = useRef(null);
  const pdfRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paperSize, setPaperSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    pdfRef.current = null;

    pdfjsLib
      .getDocument(src)
      .promise.then((pdf) => {
        if (cancelled) return;
        pdfRef.current = pdf;
        onPageCount?.(pdf.numPages);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err?.message || "Unable to load PDF";
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
    };
  }, [src, onPageCount]);

  useEffect(() => {
    const paper = paperRef.current;
    if (!paper) return;

    const updateSize = () => {
      setPaperSize({
        width: paper.clientWidth,
        height: paper.clientHeight,
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(paper);
    return () => observer.disconnect();
  }, [loading, error]);

  useEffect(() => {
    const pdf = pdfRef.current;
    const canvas = canvasRef.current;
    const paper = paperRef.current;
    if (!pdf || !canvas || !paper || loading || error) return;

    let cancelled = false;

    const renderPage = async () => {
      renderTaskRef.current?.cancel();

      try {
        const pdfPage = await pdf.getPage(page);
        if (cancelled) return;

        const baseViewport = pdfPage.getViewport({ scale: 1 });
        const paperWidth = paper.clientWidth;
        const paperHeight = paper.clientHeight;
        const scale = Math.min(
          paperWidth / baseViewport.width,
          paperHeight / baseViewport.height,
        );
        const viewport = pdfPage.getViewport({ scale });
        const context = canvas.getContext("2d");

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const renderTask = pdfPage.render({
          canvasContext: context,
          viewport,
        });
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err) {
        if (cancelled || err?.name === "RenderingCancelledException") return;
        setError(err?.message || "Unable to render PDF page");
      }
    };

    renderPage();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
    };
  }, [page, loading, error, paperSize.width, paperSize.height]);

  // Extract filename safely from the source path
  const getFilename = (url) => {
    if (!url) return "story.pdf";
    return url.substring(url.lastIndexOf("/") + 1) || "story.pdf";
  };

  if (error) {
    return (
      <div className={styles.pdfReader}>
        <div className={styles.pdfError}>
          <p>Could not open this story PDF.</p>
          <p className={styles.pdfErrorDetail}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pdfReader}>
      {loading && (
        <div className={styles.pdfLoadingOverlay}>
          <div className={styles.spinner} />
          <span>Opening PDF...</span>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.pdfActionOverlay}>
          <a
            href={src}
            download={getFilename(src)}
            className={styles.pdfDownloadBtn}
            title="Download PDF Document"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="16"
              height="16"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download PDF</span>
          </a>
        </div>
      )}

      <div className={styles.pdfPaper} ref={paperRef}>
        <canvas ref={canvasRef} className={styles.pdfCanvas} />
      </div>
    </div>
  );
}
