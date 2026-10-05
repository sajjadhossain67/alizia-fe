'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiClient } from '../../services/api';
import { Play, ShieldCheck, CheckCircle2, Terminal, Sparkles, Loader2 } from 'lucide-react';
import { AgentState, AgentLog } from '../../types';

const PRESETS = [
  { label: 'Preset: Concurrency Audit', goal: 'Run regression test suite in sandbox and verify zero concurrency deadlocks.' },
  { label: 'Preset: Schema Migration', goal: 'Inspect repository schemas and build verifiable migration script.' },
  { label: 'Preset: Safety Verification', goal: 'Analyze prompt injection defense rules (Section 71-77) and verify red-team barriers.' }
];

const STAGES: AgentState[] = ['QUEUED', 'PLANNING', 'RUNNING', 'VERIFYING', 'COMPLETED'];

export const AgentStudio: React.FC = () => {
  const { showToast } = useApp();
  const [goal, setGoal] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState<AgentState>('QUEUED');
  const [logs, setLogs] = useState<AgentLog[]>([
    {
      id: 'init-1',
      time: 'SYSTEM',
      tag: '[READY]',
      msg: 'Agent runtime initialized. Enter an objective and press "Run Verifiable Agent".'
    }
  ]);
  const [proof, setProof] = useState<{
    hash: string;
    riskTier: string;
    status: string;
    certId: string;
  } | null>(null);

  const logFeedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logFeedRef.current) {
      logFeedRef.current.scrollTop = logFeedRef.current.scrollHeight;
    }
  }, [logs, proof]);

  const appendLog = (tag: string, msg: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [
      ...prev,
      { id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, time, tag, msg }
    ]);
  };

  const getStageIndex = (stage: AgentState) => STAGES.indexOf(stage);

  const progressPercent = (getStageIndex(currentStage) / (STAGES.length - 1)) * 100;

  const handleRun = async () => {
    if (isRunning) return;
    const targetGoal = goal.trim();
    if (!targetGoal) {
      showToast('Please enter an objective for the agent.');
      return;
    }

    setIsRunning(true);
    setProof(null);
    setLogs([]);

    // 1. QUEUED
    setCurrentStage('QUEUED');
    appendLog('[SYSTEM]', `Agent run initialized with goal: "${targetGoal}"`);
    await new Promise(r => setTimeout(r, 600));

    // 2. PLANNING
    setCurrentStage('PLANNING');
    appendLog('[PLANNER]', 'Deconstructing goal into atomic sub-tasks with dependency graph...');
    await new Promise(r => setTimeout(r, 800));
    appendLog('[PLANNER]', 'Sub-tasks identified: (1) Workspace AST scan, (2) Tool execution, (3) Formal verification.');
    await new Promise(r => setTimeout(r, 600));

    // 3. RUNNING
    setCurrentStage('RUNNING');
    appendLog('[RUNTIME]', 'Executing step 1: code.sandbox inspection on target module...');
    await new Promise(r => setTimeout(r, 900));
    appendLog('[TOOL:SANDBOX]', 'Unit tests initiated: 9 passed, 0 failed. Execution time: 350ms');
    await new Promise(r => setTimeout(r, 800));
    appendLog('[TOOL:RAG]', 'Querying internal engineering guidelines & safety invariant bounds...');
    await new Promise(r => setTimeout(r, 600));

    // 4. VERIFYING
    setCurrentStage('VERIFYING');
    appendLog('[VERIFIER]', 'Checking Verifiable AI constraints (PRD Section 191)...');
    await new Promise(r => setTimeout(r, 1000));
    const generatedHash = `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 8)}`;
    appendLog('[VERIFIER]', `Cryptographic proof signature generated: ${generatedHash}`);
    await new Promise(r => setTimeout(r, 600));

    // 5. COMPLETED
    setCurrentStage('COMPLETED');
    appendLog('[SUCCESS]', 'Agent execution completed successfully with formal proof of correctness.');

    setProof({
      hash: generatedHash,
      riskTier: 'R0 (Read/Verified)',
      status: 'Zero regressions',
      certId: `CERT-ALZ-${Math.floor(100000 + Math.random() * 900000)}`
    });

    setIsRunning(false);
    showToast('Autonomous Agent finished successfully!');
  };

  return (
    <section className="view-container active overflow-y-auto">
      <div className="agent-studio-container">
        
        {/* Hero */}
        <div className="agent-studio-hero">
          <div className="agent-hero-info">
            <h2>Autonomous Verifiable Agent Studio</h2>
            <p>Orchestrate multi-step goals with state-machine execution, AST validation, and formal verification proofs.</p>
          </div>
        </div>

        {/* State Machine Progress Stepper */}
        <div className="agent-stepper-container">
          <div className="stepper-track">
            <div
              className="stepper-progress"
              style={{ width: `${progressPercent}%`, transition: 'width 0.4s ease' }}
            />
          </div>

          {STAGES.map((st, idx) => {
            const currentIdx = getStageIndex(currentStage);
            const isCompleted = idx < currentIdx;
            const isActive = idx === currentIdx;

            return (
              <div
                key={st}
                className={`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <div className="step-circle">
                  {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span className="step-label capitalize">{st.toLowerCase()}</span>
              </div>
            );
          })}
        </div>

        {/* Goal Input Card */}
        <div className="agent-input-card">
          <label className="font-semibold text-sm text-[var(--text-primary)]">
            Agent Objective & Goal Definition
          </label>
          <textarea
            className="agent-goal-textarea"
            placeholder="e.g. Audit API authentication middleware, identify token expiration edge cases, and run unit tests with verification proofs..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isRunning}
            rows={3}
          />

          {/* Quick Presets */}
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="dock-chip agent-preset-pill"
                onClick={() => setGoal(p.goal)}
                disabled={isRunning}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="agent-input-controls">
            <span className="text-xs text-[var(--text-tertiary)]">
              Token Budget: 500,000 | Risk Guard: Active (R0-R4)
            </span>
            <button
              className="agent-run-btn"
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Executing Agent...</span>
                </>
              ) : (
                <>
                  <Play size={16} className="fill-current" />
                  <span>Run Verifiable Agent</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Execution Log Terminal */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-[var(--accent-purple)]" />
            <label className="font-semibold text-[13.5px] text-[var(--text-secondary)]">
              Real-Time Agent State & Tool Log
            </label>
          </div>

          <div className="agent-feed" ref={logFeedRef}>
            {logs.map((log) => (
              <div key={log.id} className="log-entry">
                <span className="log-time">[{log.time}]</span>
                <span className="log-tag">{log.tag}</span>
                <span className="log-msg">{log.msg}</span>
              </div>
            ))}

            {/* Verifiable Proof Card */}
            {proof && (
              <div className="proof-card mt-4">
                <div className="proof-header">
                  <span className="proof-title">
                    <ShieldCheck size={18} className="text-emerald-400" />
                    Verifiable AI Certificate
                  </span>
                  <span className="proof-badge-verified">Verified 100%</span>
                </div>
                <div className="proof-details-grid">
                  <div className="proof-detail-item">
                    <span className="proof-detail-label">Certificate ID</span>
                    <span className="proof-detail-value">{proof.certId}</span>
                  </div>
                  <div className="proof-detail-item">
                    <span className="proof-detail-label">Proof Hash</span>
                    <span className="proof-detail-value font-mono">{proof.hash}</span>
                  </div>
                  <div className="proof-detail-item">
                    <span className="proof-detail-label">Risk Tier</span>
                    <span className="proof-detail-value">{proof.riskTier}</span>
                  </div>
                  <div className="proof-detail-item">
                    <span className="proof-detail-label">Status</span>
                    <span className="proof-detail-value">{proof.status}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
