'use client';

import React, { useState } from 'react';
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
  Search
} from 'lucide-react';
import { ProofObject, ClaimItem, ProofSource, TestExecutionEvidence } from '../../types';

interface ProofDrawerProps {
  proof: ProofObject | null;
  onClose: () => void;
}

export const ProofDrawer: React.FC<ProofDrawerProps> = ({ proof, onClose }) => {
  const [activeTab, setActiveTab] = useState<'claims' | 'sources' | 'tests' | 'tools'>('claims');
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  if (!proof) return null;

  const toggleClaim = (id: string) => {
    setExpandedClaimId(prev => (prev === id ? null : id));
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

  const filteredClaims = proof.claims.filter(c =>
    c.claim_text.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.status.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
      {/* Drawer Overlay backdrop dismissal */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Main Drawer Panel */}
      <div className="relative flex h-full w-full max-w-2xl flex-col border-l border-white/10 bg-[#0d0f17] text-white shadow-2xl transition-transform duration-300">
        
        {/* Top Header */}
        <div className="border-b border-white/10 bg-[#121522] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-lg ${
                proof.verifier_verdict === 'PASS' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : proof.verifier_verdict === 'PARTIAL'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {proof.verifier_verdict === 'PASS' ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <ShieldAlert className="h-5 w-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight text-white">
                    Verifiable Proof Inspection
                  </h2>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                    proof.verifier_verdict === 'PASS'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : proof.verifier_verdict === 'PARTIAL'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {proof.verifier_verdict}
                  </span>
                </div>
                <p className="text-xs text-white/50">
                  Proof ID: <span className="font-mono text-white/70">{proof.id}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              title="Close Drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-black/30 p-2.5 border border-white/5 text-center">
            <div className="border-r border-white/5 pr-2">
              <span className="block text-[11px] uppercase tracking-wider text-white/40">Confidence</span>
              <span className="text-base font-bold text-emerald-400">
                {(proof.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="border-r border-white/5 px-2">
              <span className="block text-[11px] uppercase tracking-wider text-white/40">Latency</span>
              <span className="flex items-center justify-center gap-1 text-base font-bold text-sky-400">
                <Clock className="h-3.5 w-3.5" />
                {proof.verification_latency_ms}ms
              </span>
            </div>
            <div className="pl-2">
              <span className="block text-[11px] uppercase tracking-wider text-white/40">Unsupported</span>
              <span className={`text-base font-bold ${
                proof.unsupported_claims_count === 0 ? 'text-white/80' : 'text-amber-400'
              }`}>
                {proof.unsupported_claims_count} claims
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#0d0f17] px-4">
          <button
            onClick={() => setActiveTab('claims')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold transition-colors ${
              activeTab === 'claims'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            Atomic Claims ({proof.claims.length})
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold transition-colors ${
              activeTab === 'sources'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            Sources ({proof.sources.length})
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold transition-colors ${
              activeTab === 'tests'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Terminal className="h-4 w-4" />
            Sandbox Tests ({proof.tests.length})
          </button>
        </div>

        {/* Drawer Body Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* TAB 1: CLAIMS */}
          {activeTab === 'claims' && (
            <div className="space-y-3">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Filter claims by keyword or status..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-xs text-white placeholder-white/40 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {filteredClaims.length === 0 ? (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center text-white/40 text-sm">
                  No claims found matching "{filterQuery}"
                </div>
              ) : (
                filteredClaims.map((claim, idx) => {
                  const isExpanded = expandedClaimId === claim.id;
                  const isVerified = claim.status === 'verified';
                  const isUnsupported = claim.status === 'unsupported';
                  const isPartially = claim.status === 'partially_supported';

                  return (
                    <div
                      key={claim.id}
                      className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden"
                    >
                      <div
                        onClick={() => toggleClaim(claim.id)}
                        className="flex cursor-pointer items-start justify-between gap-3 p-3.5"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/70">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium leading-relaxed text-white/90">
                              {claim.claim_text}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  isVerified
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : isPartially
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                }`}
                              >
                                {claim.status.replace('_', ' ')}
                              </span>
                              <span className="text-[11px] text-white/50">
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

                        <button className="text-white/40 hover:text-white">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Expanded Claim Details */}
                      {isExpanded && (
                        <div className="border-t border-white/5 bg-black/30 p-3.5 text-xs space-y-3">
                          {claim.reasoning && (
                            <div>
                              <span className="font-semibold text-white/40 uppercase tracking-wider text-[10px]">
                                Verification Rationale
                              </span>
                              <p className="mt-1 text-white/80 leading-relaxed">
                                {claim.reasoning}
                              </p>
                            </div>
                          )}

                          {claim.source_spans.length > 0 && (
                            <div>
                              <span className="font-semibold text-white/40 uppercase tracking-wider text-[10px]">
                                Grounded Source Spans
                              </span>
                              <div className="mt-1.5 space-y-2">
                                {claim.source_spans.map((span, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5 text-white/70"
                                  >
                                    <div className="flex items-center justify-between text-[11px] text-white/50 mb-1">
                                      <span className="font-medium text-white/80">{span.title}</span>
                                      <span className="text-emerald-400">
                                        Relevance: {(span.relevance_score * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                    <p className="italic text-white/90">"{span.span_text}"</p>
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
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center text-white/40 text-sm">
                  No external citations or documents attached to this response.
                </div>
              ) : (
                proof.sources.map((src) => (
                  <div
                    key={src.id}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white/90">{src.title}</h4>
                        {src.domain && (
                          <span className="text-[11px] text-sky-400 font-mono">
                            {src.domain}
                          </span>
                        )}
                      </div>
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-white/70 hover:bg-white/10 hover:text-white"
                        >
                          Visit <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <div className="rounded-lg bg-black/40 p-2.5 text-xs text-white/80 border border-white/5 leading-relaxed">
                      "{src.snippet}"
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: SANDBOX TESTS */}
          {activeTab === 'tests' && (
            <div className="space-y-3">
              {proof.tests.length === 0 ? (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center text-white/40 text-sm">
                  No automated sandbox test assertions generated for this answer.
                </div>
              ) : (
                proof.tests.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-purple-400" />
                        <span className="font-mono text-xs font-semibold text-white/90">
                          {t.test_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-white/40">
                          {t.execution_time_ms}ms
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            t.passed
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {t.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg bg-[#07090e] p-3 border border-white/5 font-mono text-xs text-emerald-300 overflow-x-auto">
                      <code>{t.code_or_assertion}</code>
                    </div>

                    <div className="text-[11px] text-white/60">
                      Output: <span className="font-mono text-white/80">{t.output}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/10 bg-[#121522] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>Alizia Verifiable Runtime Protocol</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              JSON
            </button>
            <button
              onClick={handlePrintCertificate}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Certificate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
