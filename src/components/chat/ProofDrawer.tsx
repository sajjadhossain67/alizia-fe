'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  X,
  ExternalLink,
  Terminal,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  ChevronDown,
  ChevronRight,
  Clock,
  Sparkles,
  Search,
  Check,
  Copy
} from 'lucide-react';
import { ProofObject } from '../../types';

interface ProofDrawerProps {
  proof: ProofObject | null;
  onClose: () => void;
}

export const ProofDrawer: React.FC<ProofDrawerProps> = ({ proof, onClose }) => {
  const [activeTab, setActiveTab] = useState<'claims' | 'sources' | 'tests'>('claims');
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!proof) return null;

  const toggleClaim = (id: string) => {
    setExpandedClaimId((prev) => (prev === id ? null : id));
  };

  const handleCopyProofId = () => {
    navigator.clipboard.writeText(proof.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(proof, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `alizia_proof_${proof.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrintCertificate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Alizia AI — Verifiable Answer Certificate (${proof.id})</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
            .header { border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 13px; text-transform: uppercase; }
            .pass { background: #dcfce7; color: #15803d; }
            .partial { background: #fef3c7; color: #b45309; }
            .fail { background: #fee2e2; color: #b91c1c; }
            .claim { margin-bottom: 16px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; }
            .code { background: #f8fafc; padding: 8px; border-radius: 6px; font-family: monospace; font-size: 12px; }
            .meta { color: #64748b; font-size: 13px; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Alizia AI Verifiable Answer Certificate</h2>
            <div class="meta">Certificate ID: <strong>${proof.id}</strong> | Timestamp: ${new Date().toISOString()}</div>
            <div style="margin-top: 12px;">
              Verdict: <span class="badge ${proof.verifier_verdict.toLowerCase()}">${proof.verifier_verdict}</span>
              &nbsp;&nbsp;Grounding Confidence: <strong>${(proof.confidence * 100).toFixed(1)}%</strong>
              &nbsp;&nbsp;Verification Overhead: <strong>${proof.verification_latency_ms}ms</strong>
            </div>
          </div>
          <h3>Atomic Claims (${proof.claims.length})</h3>
          ${proof.claims.map((c, i) => `
            <div class="claim">
              <div><strong>Claim #${i + 1}:</strong> ${c.claim_text}</div>
              <div class="meta">Status: <strong>${c.status.toUpperCase()}</strong> | Confidence: ${(c.confidence * 100).toFixed(0)}%</div>
              ${c.reasoning ? `<div style="font-size:12px; color:#475569; margin-top:4px;">${c.reasoning}</div>` : ''}
            </div>
          `).join('')}
          <h3>Ephemeral Sandbox Assertions (${proof.tests.length})</h3>
          ${proof.tests.map(t => `
            <div class="claim">
              <div class="code">${t.code_or_assertion}</div>
              <div class="meta">Passed: ${t.passed ? 'YES' : 'NO'} | Runtime: ${t.execution_time_ms}ms</div>
              <div class="code" style="margin-top:4px;">Output: ${t.output}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const filteredClaims = proof.claims.filter(
    (c) =>
      c.claim_text.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.status.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside backdrop dismissal */}
      <div className="flex-1 cursor-pointer" onClick={onClose} aria-hidden="true" />

      {/* Main Glassmorphic Slide-Over Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Verifiable Proof Inspection"
        className="relative flex h-full w-full max-w-xl md:max-w-2xl flex-col bg-[var(--color-surface)]/95 backdrop-blur-2xl border-l border-[var(--color-outline)] shadow-[var(--shadow-floating)] animate-in slide-in-from-right duration-250 select-none overflow-hidden"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[var(--color-outline)] bg-[var(--color-surface-container)]/80 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs border ${
                  proof.verifier_verdict === 'PASS'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : proof.verifier_verdict === 'PARTIAL'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}
              >
                {proof.verifier_verdict === 'PASS' ? (
                  <ShieldCheck size={22} />
                ) : (
                  <ShieldAlert size={22} />
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-bold text-[var(--color-on-surface)]">
                    Verifiable Proof Inspection
                  </h2>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      proof.verifier_verdict === 'PASS'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs shadow-emerald-500/10'
                        : proof.verifier_verdict === 'PARTIAL'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {proof.verifier_verdict}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-muted)]">
                  <span>Proof ID:</span>
                  <button
                    onClick={handleCopyProofId}
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors cursor-pointer"
                    title="Click to copy ID"
                  >
                    <span>{proof.id}</span>
                    {copiedId ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
              title="Close drawer"
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-outline)] text-center">
            <div className="border-r border-[var(--color-outline)] pr-2">
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-[var(--color-on-surface-muted)]">
                Confidence
              </span>
              <span className="text-base font-bold text-emerald-400">
                {(proof.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="border-r border-[var(--color-outline)] px-2">
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-[var(--color-on-surface-muted)]">
                Latency
              </span>
              <span className="flex items-center justify-center gap-1 text-base font-bold text-sky-400 font-mono">
                <Clock size={13} />
                {proof.verification_latency_ms}ms
              </span>
            </div>
            <div className="pl-2">
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-[var(--color-on-surface-muted)]">
                Unsupported
              </span>
              <span
                className={`text-base font-bold ${
                  proof.unsupported_claims_count === 0 ? 'text-[var(--color-on-surface)]' : 'text-amber-400'
                }`}
              >
                {proof.unsupported_claims_count} claims
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--color-outline)] bg-[var(--color-surface)] px-4">
          <button
            onClick={() => setActiveTab('claims')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'claims'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            <CheckCircle2 size={14} />
            <span>Atomic Claims ({proof.claims.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sources'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            <FileText size={14} />
            <span>Sources ({proof.sources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'tests'
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            <Terminal size={14} />
            <span>Sandbox Tests ({proof.tests.length})</span>
          </button>
        </div>

        {/* Drawer Body Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {/* TAB 1: CLAIMS */}
          {activeTab === 'claims' && (
            <div className="space-y-3">
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-2.5 text-[var(--color-on-surface-muted)]" />
                <input
                  type="text"
                  placeholder="Filter claims by keyword or status..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface-container)] py-2 pl-9 pr-3 text-xs text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-muted)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {filteredClaims.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--color-on-surface-muted)] rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface-container)]/40">
                  No claims found matching "{filterQuery}"
                </div>
              ) : (
                filteredClaims.map((claim, idx) => {
                  const isExpanded = expandedClaimId === claim.id;
                  const isVerified = claim.status === 'verified';
                  const isPartially = claim.status === 'partially_supported';

                  return (
                    <div
                      key={claim.id}
                      className="rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface-container)]/50 hover:bg-[var(--color-surface-container)] transition-all overflow-hidden"
                    >
                      <div
                        onClick={() => toggleClaim(claim.id)}
                        className="flex cursor-pointer items-start justify-between gap-3 p-3.5"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-outline)] text-[10px] font-bold text-[var(--color-on-surface-muted)]">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs md:text-sm font-medium leading-relaxed text-[var(--color-on-surface)]">
                              {claim.claim_text}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                  isVerified
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                    : isPartially
                                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                }`}
                              >
                                {claim.status.replace('_', ' ')}
                              </span>
                              <span className="text-[11px] font-mono text-[var(--color-on-surface-muted)]">
                                Confidence: {(claim.confidence * 100).toFixed(0)}%
                              </span>
                              {claim.source_spans.length > 0 && (
                                <span className="text-[11px] text-sky-400">
                                  {claim.source_spans.length} source span{claim.source_spans.length > 1 ? 's' : ''}
                                </span>
                              )}
                              {claim.tests.length > 0 && (
                                <span className="text-[11px] text-purple-400">
                                  {claim.tests.length} test verified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button className="text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] shrink-0 mt-1">
                          {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        </button>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-[var(--color-outline)] bg-[var(--color-surface)] p-3.5 text-xs space-y-3">
                          {claim.reasoning && (
                            <div>
                              <span className="font-semibold text-[10px] uppercase tracking-wider text-[var(--color-on-surface-muted)]">
                                Verification Rationale
                              </span>
                              <p className="mt-1 text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                                {claim.reasoning}
                              </p>
                            </div>
                          )}

                          {claim.source_spans.length > 0 && (
                            <div>
                              <span className="font-semibold text-[10px] uppercase tracking-wider text-[var(--color-on-surface-muted)]">
                                Grounded Source Spans
                              </span>
                              <div className="mt-1.5 space-y-2">
                                {claim.source_spans.map((span, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="rounded-lg border border-[var(--color-outline)] bg-[var(--color-surface-container)] p-2.5"
                                  >
                                    <div className="flex items-center justify-between text-[11px] text-[var(--color-on-surface-muted)] mb-1">
                                      <span className="font-medium text-[var(--color-on-surface)]">{span.title}</span>
                                      <span className="text-emerald-400 font-mono">
                                        Match: {(span.relevance_score * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                    <p className="italic text-xs text-[var(--color-on-surface-variant)]">"{span.span_text}"</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: SOURCES */}
          {activeTab === 'sources' && (
            <div className="space-y-3">
              {proof.sources.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--color-on-surface-muted)] rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface-container)]/40">
                  No external citations attached.
                </div>
              ) : (
                proof.sources.map((src) => (
                  <div
                    key={src.id}
                    className="rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface-container)]/50 p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--color-on-surface)]">{src.title}</h4>
                        {src.domain && (
                          <span className="text-[11px] text-sky-400 font-mono">{src.domain}</span>
                        )}
                      </div>
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--color-outline)] px-2.5 py-1 text-[11px] text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-hover)] transition-colors"
                        >
                          <span>Visit</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <div className="rounded-lg bg-[var(--color-surface)] p-2.5 text-xs text-[var(--color-on-surface-variant)] border border-[var(--color-outline)] leading-relaxed">
                      "{src.snippet}"
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: TESTS */}
          {activeTab === 'tests' && (
            <div className="space-y-3">
              {proof.tests.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--color-on-surface-muted)] rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface-container)]/40">
                  No automated test assertions generated for this answer.
                </div>
              ) : (
                proof.tests.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-[var(--color-outline)] bg-[var(--color-surface-container)]/50 p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-purple-400" />
                        <span className="font-mono text-xs font-semibold text-[var(--color-on-surface)]">
                          {t.test_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[var(--color-on-surface-muted)]">
                          {t.execution_time_ms}ms
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            t.passed
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {t.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg bg-[var(--color-surface)] p-3 border border-[var(--color-outline)] font-mono text-xs text-emerald-400 overflow-x-auto custom-scrollbar">
                      <code>{t.code_or_assertion}</code>
                    </div>

                    <div className="text-[11px] text-[var(--color-on-surface-muted)]">
                      Output: <span className="font-mono text-[var(--color-on-surface-variant)]">{t.output}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--color-outline)] bg-[var(--color-surface-container)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--color-on-surface-muted)]">
            <Sparkles size={14} className="text-[#9B72CB]" />
            <span>Alizia Verifiable Runtime Protocol</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-outline)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-on-surface)] transition-colors cursor-pointer"
            >
              <Download size={13} />
              <span>JSON</span>
            </button>
            <button
              onClick={handlePrintCertificate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm shadow-emerald-600/20"
            >
              <Printer size={13} />
              <span>Print Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
