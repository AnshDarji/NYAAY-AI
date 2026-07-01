import React from 'react';
import { WATERMARK_OPTIONS, LETTERHEAD_TEMPLATES } from './templates/index';

/**
 * DocumentToolbar — sticky PDF-viewer-style toolbar.
 * Modelled on Adobe Reader / Microsoft Word top bar.
 *
 * Layout:
 *   [ ← Back ] | [ Template ▾ ] [ Watermark ▾ ] [ ⚙ ] | [ − ] XX% [ + ] [ ⛶ ] | [ 🖨 ] [ PDF ] [ DOCX ] | [ ✂ Copy ] [ ✎ Edit ] [ ↩ Over ]
 */
export default function DocumentToolbar({
  draftResult,
  zoom,           onZoomChange,
  watermark,      onWatermarkChange,
  template,       onTemplateChange,
  onLetterheadOpen,
  onPrint,
  onDownloadPdf,
  onDownloadDocx,
  onCopyText,
  onEditToggle,   isEditing,
  onStartOver,
  onFullscreen,
}) {
  const zoomPct = Math.round(zoom * 100);

  return (
    <div className="no-print sticky top-0 z-20 bg-[#404040] text-white px-4 py-2 flex flex-wrap items-center gap-2 shadow-lg select-none">

      {/* ── Back ──────────────────────────── */}
      <button onClick={onStartOver} className="toolbar-btn toolbar-btn--text" title="Start Over">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span className="hidden sm:inline text-xs">Back</span>
      </button>

      <div className="toolbar-divider" />

      {/* ── Document info ─────────────────── */}
      <span className="text-xs text-zinc-300 hidden md:block truncate max-w-[200px]">
        {draftResult?.document_type?.replace(/_/g, ' ')} · v{draftResult?.metadata?.version || 1}
      </span>

      <div className="toolbar-divider" />

      {/* ── Template ──────────────────────── */}
      <label className="text-xs text-zinc-400 hidden sm:block">Template</label>
      <select
        value={template}
        onChange={e => onTemplateChange(e.target.value)}
        className="toolbar-select"
        title="Select letterhead template"
      >
        {LETTERHEAD_TEMPLATES.map(t => (
          <option key={t.id} value={t.id}>{t.label}</option>
        ))}
      </select>

      {/* ── Watermark ─────────────────────── */}
      <label className="text-xs text-zinc-400 hidden sm:block">Watermark</label>
      <select
        value={watermark}
        onChange={e => onWatermarkChange(e.target.value)}
        className="toolbar-select"
        title="Select watermark"
      >
        {WATERMARK_OPTIONS.map(w => (
          <option key={w.id} value={w.id}>{w.label}</option>
        ))}
      </select>

      {/* ── Letterhead Settings ───────────── */}
      <button onClick={onLetterheadOpen} className="toolbar-btn" title="Letterhead Settings">
        <span className="material-symbols-outlined text-[18px]">settings</span>
      </button>

      <div className="toolbar-divider" />

      {/* ── Zoom ──────────────────────────── */}
      <button onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))} className="toolbar-btn" title="Zoom out">
        <span className="material-symbols-outlined text-[18px]">remove</span>
      </button>
      <span className="text-xs w-10 text-center tabular-nums">{zoomPct}%</span>
      <button onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))} className="toolbar-btn" title="Zoom in">
        <span className="material-symbols-outlined text-[18px]">add</span>
      </button>

      {/* ── Fullscreen ────────────────────── */}
      <button onClick={onFullscreen} className="toolbar-btn" title="Fullscreen">
        <span className="material-symbols-outlined text-[18px]">fullscreen</span>
      </button>

      <div className="toolbar-divider" />

      {/* ── Print ─────────────────────────── */}
      <button onClick={onPrint} className="toolbar-btn" title="Print">
        <span className="material-symbols-outlined text-[18px]">print</span>
        <span className="hidden sm:inline text-xs">Print</span>
      </button>

      {/* ── PDF ───────────────────────────── */}
      <button onClick={onDownloadPdf} className="toolbar-btn toolbar-btn--pdf" title="Download PDF">
        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
        <span className="hidden sm:inline text-xs">PDF</span>
      </button>

      {/* ── DOCX ──────────────────────────── */}
      <button onClick={onDownloadDocx} className="toolbar-btn toolbar-btn--docx" title="Download DOCX">
        <span className="material-symbols-outlined text-[18px]">description</span>
        <span className="hidden sm:inline text-xs">DOCX</span>
      </button>

      <div className="toolbar-divider" />

      {/* ── Copy ──────────────────────────── */}
      <button onClick={onCopyText} className="toolbar-btn" title="Copy text">
        <span className="material-symbols-outlined text-[18px]">content_copy</span>
        <span className="hidden sm:inline text-xs">Copy</span>
      </button>

      {/* ── Edit ──────────────────────────── */}
      <button
        onClick={onEditToggle}
        className={`toolbar-btn ${isEditing ? 'toolbar-btn--active' : ''}`}
        title="Edit draft"
      >
        <span className="material-symbols-outlined text-[18px]">edit</span>
        <span className="hidden sm:inline text-xs">Edit</span>
      </button>
    </div>
  );
}
