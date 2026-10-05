'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Button,
  IconButton,
  Chip,
  Pill,
  Input,
  Textarea,
  Select,
  Combobox,
  CommandPalette,
  Dialog,
  Drawer,
  Sheet,
  Popover,
  Tooltip,
  HoverCard,
  Tabs,
  Toggle,
  Switch,
  Slider,
  Menu,
  ContextMenu,
  Toast,
  Banner,
  Skeleton,
  Avatar,
  Badge,
  Progress,
  Meter,
  Table,
  Tree,
  Kbd,
  Divider,
  ScrollArea,
  ResizablePanels,
  EmptyState,
  ErrorState,
  CopyButton,
  Spinner,
  AliziaSparkle,
  useTheme,
} from '../../components/ui';
import { accentPalettes, ThemeKey, AccentColorKey } from '../../styles/tokens';

export default function DesignSystemPage() {
  const { theme, setTheme, accent, setAccent, dir, toggleDir } = useTheme();

  // Component Playground States
  const [btnLoading, setBtnLoading] = useState(false);
  const [inputValue, setInputValue] = useState('Frontier Reasoning Query');
  const [textareaValue, setTextareaValue] = useState('Explain how quantum entanglement powers verifiable multi-agent consensus.');
  const [selectVal, setSelectVal] = useState('nova');
  const [comboboxVal, setComboboxVal] = useState('proof');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [togglePressed, setTogglePressed] = useState(true);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [sliderVal, setSliderVal] = useState(65);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'warning' | 'error' | 'info' }>>([]);
  const [selectedTreeNode, setSelectedTreeNode] = useState<string>('node-1');

  const addDemoToast = (type: 'success' | 'warning' | 'error' | 'info') => {
    const id = `t_${Date.now()}`;
    setToasts((prev) => [...prev, { id, message: `Action executed with status ${type}`, type }]);
  };

  const sampleTableData = [
    { id: '1', model: 'Alizia Nova', context: '1M tokens', latency: '120ms', cost: '$0.002/1k', status: 'Active' },
    { id: '2', model: 'Alizia Pulse', context: '128k tokens', latency: '45ms', cost: '$0.0005/1k', status: 'Active' },
    { id: '3', model: 'Alizia Forge', context: '2M tokens', latency: '350ms', cost: '$0.008/1k', status: 'Beta' },
    { id: '4', model: 'Alizia Council', context: 'Dynamic', latency: '600ms', cost: '$0.015/1k', status: 'Experimental' },
  ];

  const sampleTreeData = [
    {
      id: 'node-1',
      label: 'Workspace / Alizia Core',
      defaultExpanded: true,
      children: [
        { id: 'node-1-1', label: 'Proof_Engine.py', badge: 'v2' },
        { id: 'node-1-2', label: 'Model_Council_Router.ts' },
        {
          id: 'node-1-3',
          label: 'Artifacts',
          defaultExpanded: true,
          children: [
            { id: 'node-1-3-1', label: 'Execution_Trace.json' },
            { id: 'node-1-3-2', label: 'Verification_Report.pdf' },
          ],
        },
      ],
    },
    {
      id: 'node-2',
      label: 'Agents Timeline',
      children: [{ id: 'node-2-1', label: 'Run_84920_Verifying.log' }],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)] transition-colors duration-200">
      {/* Top Controls Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-outline)] bg-[var(--color-glass-surface)] backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <AliziaSparkle size={26} animate />
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent">
              Alizia Design System
            </span>
          </Link>
          <Badge variant="gradient">Phase 1 Tokens & Components</Badge>
        </div>

        {/* Global Controls: Theme, Accent, RTL, Command */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Theme Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[var(--color-surface-container)] border border-[var(--color-outline)] text-xs">
            {(['dark', 'light', 'amoled', 'sepia', 'high-contrast'] as ThemeKey[]).map((th) => (
              <button
                key={th}
                type="button"
                onClick={() => setTheme(th)}
                className={`px-2.5 py-1 rounded-full capitalize font-medium transition-all ${
                  theme === th
                    ? 'bg-[var(--accent)] text-white shadow-xs'
                    : 'text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)]'
                }`}
              >
                {th.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Accent Color Picker */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[var(--color-surface-container)] border border-[var(--color-outline)]">
            {(Object.keys(accentPalettes) as AccentColorKey[]).map((acKey) => (
              <button
                key={acKey}
                type="button"
                onClick={() => setAccent(acKey)}
                title={accentPalettes[acKey].name}
                style={{ backgroundColor: accentPalettes[acKey].value }}
                className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                  accent === acKey ? 'ring-2 ring-white ring-offset-2 ring-offset-[var(--color-surface)] scale-110' : 'hover:scale-105 opacity-80'
                }`}
              />
            ))}
          </div>

          {/* RTL Toggle */}
          <Button
            size="sm"
            variant="tonal"
            onClick={toggleDir}
          >
            {dir === 'ltr' ? 'LTR ➔ RTL' : 'RTL ➔ LTR'}
          </Button>

          {/* Command Palette Trigger */}
          <Button
            size="sm"
            variant="filled"
            icon={<Kbd>⌘K</Kbd>}
            iconPosition="end"
            onClick={() => setIsCommandOpen(true)}
          >
            Commands
          </Button>
        </div>
      </header>

      {/* Main Showcase Body */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10">
        {/* Visual Language Principles Overview */}
        <section className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)] shadow-[var(--shadow-elevation-1)] flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-on-surface)]">
              Google Gemini Visual Language & Refined Tokens
            </h1>
            <p className="text-sm text-[var(--color-on-surface-muted)] leading-relaxed">
              Generous whitespace, 4px grid, large radii (12/16/24/pill), soft elevation, tonal separation, and brand gradient (<span className="text-[#4285F4] font-semibold">#4285F4 Blue</span> → <span className="text-[#9B72CB] font-semibold">#9B72CB Violet</span> → <span className="text-[#D96570] font-semibold">#D96570 Rose</span>).
            </p>
          </div>

          {/* Color Token Swatches */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-background)] border border-[var(--color-outline)] flex flex-col gap-1">
              <span className="text-xs font-semibold">Background</span>
              <span className="text-[10px] font-mono text-[var(--color-on-surface-muted)]">--color-background</span>
            </div>
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-outline)] flex flex-col gap-1">
              <span className="text-xs font-semibold">Surface</span>
              <span className="text-[10px] font-mono text-[var(--color-on-surface-muted)]">--color-surface</span>
            </div>
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-container)] border border-[var(--color-outline)] flex flex-col gap-1">
              <span className="text-xs font-semibold">Container</span>
              <span className="text-[10px] font-mono text-[var(--color-on-surface-muted)]">--color-container</span>
            </div>
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-hover)] border border-[var(--color-outline)] flex flex-col gap-1">
              <span className="text-xs font-semibold">Hover Surface</span>
              <span className="text-[10px] font-mono text-[var(--color-on-surface-muted)]">--color-hover</span>
            </div>
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--accent)] text-white flex flex-col gap-1">
              <span className="text-xs font-semibold">Accent Primary</span>
              <span className="text-[10px] font-mono opacity-80">--accent</span>
            </div>
            <div className="p-3 rounded-[var(--radius-md)] bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] text-white flex flex-col gap-1">
              <span className="text-xs font-semibold">Brand Gradient</span>
              <span className="text-[10px] font-mono opacity-80">Gemini Aurora</span>
            </div>
          </div>
        </section>

        {/* Section 1: Buttons, IconButtons, Chips, Pills */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)] flex flex-col gap-4">
            <h2 className="text-base font-semibold">Buttons & Icon Buttons</h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="filled">Filled Action</Button>
              <Button variant="tonal">Tonal Default</Button>
              <Button variant="outlined">Outlined</Button>
              <Button variant="text">Text Only</Button>
              <Button variant="gradient">Brand Gradient</Button>
              <Button
                loading={btnLoading}
                onClick={() => {
                  setBtnLoading(true);
                  setTimeout(() => setBtnLoading(false), 2000);
                }}
              >
                Click to Test Spin
              </Button>
            </div>
            <Divider label="Icon Buttons" />
            <div className="flex items-center gap-3">
              <IconButton label="Sparkle AI" variant="gradient">
                <AliziaSparkle size={18} />
              </IconButton>
              <IconButton label="Edit Prompt" variant="tonal">
                ✏️
              </IconButton>
              <IconButton label="Copy Response" variant="outlined">
                📋
              </IconButton>
              <IconButton label="Settings" variant="text">
                ⚙️
              </IconButton>
            </div>
          </div>

          <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)] flex flex-col gap-4">
            <h2 className="text-base font-semibold">Chips & Status Pills</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Chip selected>⚡ Deep Research</Chip>
              <Chip>🎨 Canvas</Chip>
              <Chip onDismiss={() => alert('Dismissed')} dismissLabel="Dismiss proof">
                🛡️ Proof Mode
              </Chip>
              <Chip>🌐 Web Search</Chip>
            </div>
            <Divider label="Pills with Status Dots" />
            <div className="flex flex-wrap items-center gap-2">
              <Pill variant="neutral" dot>Offline Ready</Pill>
              <Pill variant="accent" dot>Streaming Active</Pill>
              <Pill variant="success" dot>Verification 100%</Pill>
              <Pill variant="warning" dot>Rate Limit Warning</Pill>
              <Pill variant="danger" dot>Budget Exceeded</Pill>
              <Pill variant="gradient">Alizia Council</Pill>
            </div>
          </div>
        </section>

        {/* Section 2: Form Inputs, Auto-grow Textarea, Select, Combobox */}
        <section className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)] flex flex-col gap-6">
          <h2 className="text-base font-semibold">Input Controls & Textareas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Standard Tonal Input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              clearable
              onClear={() => setInputValue('')}
              helperText="Auto-clearing with Esc support"
            />
            <Select
              label="Model Selector Dropdown"
              value={selectVal}
              onChange={setSelectVal}
              options={[
                { value: 'nova', label: 'Alizia Nova 1.5', badge: 'Fastest', description: 'Real-time reasoning & tool calls' },
                { value: 'pulse', label: 'Alizia Pulse', badge: 'Pro', description: 'Complex code synthesis & math' },
                { value: 'forge', label: 'Alizia Forge 2M', badge: 'Ultra', description: 'Long-context multimodal agent' },
              ]}
            />
            <Combobox
              label="Fuzzy Searchable Combobox"
              value={comboboxVal}
              onChange={setComboboxVal}
              items={[
                { value: 'proof', label: 'Show Proof Drawer', category: 'Transparency' },
                { value: 'timeline', label: 'Inspect Agent Steps', category: 'Agents' },
                { value: 'council', label: 'Model Council Compare', category: 'Models' },
                { value: 'canvas', label: 'Open TipTap Canvas', category: 'Workspace' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[var(--color-on-surface-variant)] px-1">
              Auto-growing IME-Safe Textarea (Signature Input Bar Engine)
            </label>
            <div className="p-3 rounded-[var(--radius-xl)] bg-[var(--color-surface-container)] border border-[var(--color-outline)] shadow-[var(--shadow-elevation-1)]">
              <Textarea
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                showCount
                maxCount={4000}
                onEnterSubmit={() => alert(`Submitted prompt: ${textareaValue}`)}
              />
            </div>
          </div>
        </section>

        {/* Section 3: Navigation, Tabs, Toggles, Sliders, Switches */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)] flex flex-col gap-5">
            <h2 className="text-base font-semibold">Tabs & Segmented Controls</h2>
            <div className="flex flex-col gap-4">
              <Tabs
                variant="pill"
                tabs={[
                  { id: 'overview', label: 'Overview', badge: '4' },
                  { id: 'proof', label: 'Proof Mode' },
                  { id: 'timeline', label: 'Timeline' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
              <Tabs
                variant="segmented"
                tabs={[
                  { id: 'low', label: 'Low Effort' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'high', label: 'High Reasoning' },
                ]}
                activeTab="high"
                onChange={() => {}}
              />
              <Tabs
                variant="underline"
                tabs={[
                  { id: 'code', label: 'Code Blocks' },
                  { id: 'katex', label: 'Math Formulas' },
                  { id: 'markdown', label: 'Rich Markdown' },
                ]}
                activeTab="code"
                onChange={() => {}}
              />
            </div>
          </div>

          <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)] flex flex-col gap-5">
            <h2 className="text-base font-semibold">Toggles, Switches & Range Slider</h2>
            <div className="flex flex-wrap items-center gap-6">
              <Toggle pressed={togglePressed} onPressedChange={setTogglePressed}>
                {togglePressed ? '✓ Active State' : 'Off'}
              </Toggle>
              <Switch
                checked={switchChecked}
                onCheckedChange={setSwitchChecked}
                label="Autonomous Tool Calling"
                description="Allows model to invoke local sandbox"
              />
            </div>
            <Slider
              value={sliderVal}
              onChange={setSliderVal}
              min={0}
              max={100}
              label="Reasoning Effort Budget"
              valueDisplay={`${sliderVal}%`}
            />
          </div>
        </section>

        {/* Section 4: Overlays, Modals, Drawers, Sheets, Menus */}
        <section className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)] flex flex-col gap-4">
          <h2 className="text-base font-semibold">Modals, Panels, Menus & Overlays</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="filled" onClick={() => setIsDialogOpen(true)}>
              Open Dialog Modal
            </Button>
            <Button variant="tonal" onClick={() => setIsDrawerOpen(true)}>
              Open Bottom Drawer
            </Button>
            <Button variant="tonal" onClick={() => setIsSheetOpen(true)}>
              Open Side Sheet (Proof / Canvas)
            </Button>
            <Popover trigger={<Button variant="outlined">Trigger Popover</Button>}>
              <div className="text-xs flex flex-col gap-2">
                <span className="font-semibold text-sm">Alizia Nova Model Specs</span>
                <p className="text-[var(--color-on-surface-muted)]">Context window: 1M tokens. Trained on frontier reasoning sets.</p>
              </div>
            </Popover>
            <Tooltip content="Tooltip explains power features" side="top">
              <Button variant="text">Hover Tooltip</Button>
            </Tooltip>
            <HoverCard
              trigger={<span className="text-xs text-[var(--accent)] underline cursor-pointer">Hover Card Citation [1]</span>}
            >
              <div className="flex flex-col gap-1 text-xs">
                <span className="font-semibold">Nature Physics (2026)</span>
                <span className="text-[11px] text-[var(--color-on-surface-muted)]">DOI: 10.1038/s41567-026</span>
                <p className="text-[var(--color-on-surface-variant)] mt-1">Experimental demonstration of macroscopic quantum verification protocols.</p>
              </div>
            </HoverCard>
            <Menu
              trigger={<Button variant="tonal">Context Options Menu ▾</Button>}
              items={[
                { id: '1', label: 'Fork Conversation', shortcut: '⌘D', onClick: () => {} },
                { id: '2', label: 'Export as Markdown', onClick: () => {} },
                { id: 'div1', label: '', divider: true },
                { id: '3', label: 'Delete Conversation', destructive: true, onClick: () => {} },
              ]}
            />
          </div>
        </section>

        {/* Section 5: Data Displays: Table, Tree, Resizable Panels, Meter, Progress */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)] flex flex-col gap-4">
            <h2 className="text-base font-semibold">Accessible Table & Tree View</h2>
            <Table
              keyField="id"
              columns={[
                { key: 'model', header: 'Model Engine', sortable: true },
                { key: 'context', header: 'Context' },
                { key: 'latency', header: 'Latency', sortable: true },
                { key: 'cost', header: 'Pricing' },
              ]}
              data={sampleTableData}
            />
            <Divider label="Hierarchical Tree Navigation" />
            <Tree
              data={sampleTreeData}
              selectedId={selectedTreeNode}
              onSelectNode={(node) => setSelectedTreeNode(node.id)}
            />
          </div>

          <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)] flex flex-col gap-5">
            <h2 className="text-base font-semibold">Meters, Progress, Avatars & CopyButton</h2>
            <Meter value={8200} max={10000} label="Agent Step Token Consumption" unit="tokens" />
            <Progress value={42} showValue variant="gradient" />
            <Divider label="Avatars & Badges" />
            <div className="flex items-center gap-4">
              <Avatar name="User Test" status="online" size="md" />
              <Avatar isModel modelThinking size="md" />
              <Badge variant="primary">Verified Claim</Badge>
              <Badge variant="success">Pass</Badge>
              <Badge variant="warning">80% Budget</Badge>
              <CopyButton textToCopy="https://alizia.ai/share/84920" />
            </div>
            <Divider label="Toast Notifications" />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="tonal" onClick={() => addDemoToast('success')}>Success Toast</Button>
              <Button size="sm" variant="tonal" onClick={() => addDemoToast('warning')}>Warning Toast</Button>
              <Button size="sm" variant="tonal" onClick={() => addDemoToast('error')}>Error Toast</Button>
            </div>
          </div>
        </section>

        {/* Section 6: Resizable Split Panels Demonstration */}
        <section className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)] flex flex-col gap-4">
          <h2 className="text-base font-semibold">Resizable Split Panels (Draggable Divider)</h2>
          <div className="h-48 border border-[var(--color-outline)] rounded-[var(--radius-lg)] overflow-hidden">
            <ResizablePanels
              defaultLeftWidth={50}
              left={
                <div className="h-full p-4 bg-[var(--color-surface-container)] flex flex-col justify-center items-center text-center">
                  <span className="font-semibold text-sm">Left Pane: Chat Streaming Stream</span>
                  <span className="text-xs text-[var(--color-on-surface-muted)]">SSE Token chunks & thinking stream</span>
                </div>
              }
              right={
                <div className="h-full p-4 bg-[var(--color-surface)] flex flex-col justify-center items-center text-center">
                  <span className="font-semibold text-sm">Right Pane: Canvas & Proof Inspector</span>
                  <span className="text-xs text-[var(--color-on-surface-muted)]">Monaco editor, citations & execution trace</span>
                </div>
              }
            />
          </div>
        </section>

        {/* Section 7: Empty & Error States */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)]">
            <EmptyState
              title="No Autonomous Agent Runs Yet"
              description="Deploy a verifiable multi-step agent to run complex workflows, coding tasks, or deep research."
              action={<Button variant="filled">Start Agent Run</Button>}
            />
          </div>
          <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-outline)] flex items-center justify-center">
            <ErrorState
              title="Verification Incomplete"
              message="The citation verification service timed out while re-deriving mathematical proofs."
              code="PROOF_VERIFY_TIMEOUT"
              onRetry={() => alert('Retrying proof verification...')}
              onReport={() => alert('Reported to telemetry')}
            />
          </div>
        </section>
      </main>

      {/* Interactive Overlays */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Alizia Frontier Reasoning Model Council"
        description="Run prompts simultaneously across Nova, Pulse, and Forge for cross-verification."
        footer={
          <>
            <Button variant="tonal" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="filled" onClick={() => setIsDialogOpen(false)}>Confirm Run</Button>
          </>
        }
      >
        <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
          The Council runs 3 models in parallel, compiles diffs, flags contradictions, and presents a synthesized consensus answer with mathematical confidence scores.
        </p>
      </Dialog>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Mobile Tool Tray">
        <div className="p-4 flex flex-col gap-3">
          <Chip selected>⚡ Deep Research Mode</Chip>
          <Chip>🎨 Canvas Workspace</Chip>
          <Chip>🎙️ Voice Dictation</Chip>
        </div>
      </Drawer>

      <Sheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title="Proof Mode & Sources Drawer" size="md">
        <div className="flex flex-col gap-4">
          <Banner variant="brand" title="Proof Verified">
            All 4 claims checked against arXiv & DOI repositories.
          </Banner>
          <p className="text-xs text-[var(--color-on-surface-muted)]">
            Every sentence generated by Alizia is tagged with a cryptographic hash and citation span. Click any claim in the response to inspect the source text.
          </p>
        </div>
      </Sheet>

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        items={[
          { id: '1', label: 'New Chat Conversation', category: 'Navigation', shortcut: '⌘O', onSelect: () => {} },
          { id: '2', label: 'Switch to Dark Mode', category: 'Preferences', onSelect: () => setTheme('dark') },
          { id: '3', label: 'Switch to Light Mode', category: 'Preferences', onSelect: () => setTheme('light') },
          { id: '4', label: 'Switch to AMOLED Black', category: 'Preferences', onSelect: () => setTheme('amoled') },
          { id: '5', label: 'Start Autonomous Agent Run', category: 'Agents', onSelect: () => {} },
          { id: '6', label: 'Open TipTap Canvas', category: 'Canvas', onSelect: () => {} },
        ]}
      />

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            message={t.message}
            type={t.type}
            onDismiss={(id) => setToasts((prev) => prev.filter((item) => item.id !== id))}
          />
        ))}
      </div>
    </div>
  );
}
