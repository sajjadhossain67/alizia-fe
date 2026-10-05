import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  Button,
  IconButton,
  Chip,
  Pill,
  Input,
  Textarea,
  Tabs,
  Toggle,
  Switch,
  Slider,
  Badge,
  Progress,
  Meter,
  EmptyState,
  ErrorState,
  CopyButton,
  Spinner,
  AliziaSparkle,
  Kbd,
} from '../index';

describe('UI Component Library - Phase 1', () => {
  it('renders Button with variants and handles click events', () => {
    const handleClick = vi.fn();
    render(
      <Button variant="filled" size="md" onClick={handleClick}>
        Send Prompt
      </Button>
    );

    const btn = screen.getByRole('button', { name: /send prompt/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders Button loading state with aria-busy and disabled behavior', () => {
    render(
      <Button loading size="sm">
        Generating
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
  });

  it('renders IconButton with mandatory accessible label', () => {
    render(
      <IconButton label="Open Canvas Workspace">
        <span>🎨</span>
      </IconButton>
    );
    const btn = screen.getByRole('button', { name: /open canvas workspace/i });
    expect(btn).toBeInTheDocument();
  });

  it('renders Chip with selected state and dismiss callback', () => {
    const handleDismiss = vi.fn();
    render(
      <Chip selected onDismiss={handleDismiss} dismissLabel="Remove filter">
        Deep Research
      </Chip>
    );
    expect(screen.getByText('Deep Research')).toBeInTheDocument();
    const dismissBtn = screen.getByRole('button', { name: /remove filter/i });
    fireEvent.click(dismissBtn);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders Pill with semantic variants and status dot', () => {
    render(
      <Pill variant="accent" dot>
        Reasoning: High
      </Pill>
    );
    expect(screen.getByText('Reasoning: High')).toBeInTheDocument();
  });

  it('renders Input with clearable button and error state', () => {
    const handleClear = vi.fn();
    render(
      <Input
        label="API Endpoint"
        value="https://api.alizia.ai"
        onChange={() => {}}
        clearable
        onClear={handleClear}
        error="Invalid URL"
      />
    );
    expect(screen.getByText('API Endpoint')).toBeInTheDocument();
    expect(screen.getByText('Invalid URL')).toBeInTheDocument();
    const clearBtn = screen.getByRole('button', { name: /clear input/i });
    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('renders auto-growing Textarea with enter submit', () => {
    const handleSubmit = vi.fn();
    render(
      <Textarea
        value="Hello Alizia"
        onChange={() => {}}
        onEnterSubmit={handleSubmit}
        placeholder="Ask anything..."
      />
    );
    const textarea = screen.getByPlaceholderText('Ask anything...');
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders Tabs and navigates with arrow keys', () => {
    const handleTabChange = vi.fn();
    const tabs = [
      { id: 'chat', label: 'Chat' },
      { id: 'agents', label: 'Agents' },
      { id: 'canvas', label: 'Canvas' },
    ];
    render(<Tabs tabs={tabs} activeTab="chat" onChange={handleTabChange} />);
    const activeTab = screen.getByRole('tab', { name: /chat/i });
    expect(activeTab).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(activeTab, { key: 'ArrowRight' });
    expect(handleTabChange).toHaveBeenCalledWith('agents');
  });

  it('renders Switch with accessible keyboard toggling', () => {
    const handleToggle = vi.fn();
    render(<Switch checked={false} onCheckedChange={handleToggle} label="Web Search" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-checked', 'false');
    fireEvent.keyDown(sw, { key: ' ' });
    expect(handleToggle).toHaveBeenCalledWith(true);
  });

  it('renders Slider with percentage calculation', () => {
    const handleChange = vi.fn();
    render(<Slider value={50} min={0} max={100} onChange={handleChange} label="Effort" />);
    expect(screen.getByText('Effort')).toBeInTheDocument();
  });

  it('renders Progress and Meter with budget limits', () => {
    render(<Progress value={75} showValue />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');

    render(<Meter value={8500} max={10000} label="Token Budget" />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '8500');
    expect(screen.getByText(/80% reached/i)).toBeInTheDocument();
  });

  it('renders CopyButton and handles copy action', async () => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    render(<CopyButton textToCopy="curl https://api.alizia.ai/v1/responses" />);
    const btn = screen.getByRole('button', { name: /copy/i });
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('curl https://api.alizia.ai/v1/responses');
  });

  it('renders AliziaSparkle logo with thinking spin animation', () => {
    render(<AliziaSparkle thinking size="lg" />);
    const star = screen.getByRole('img', { name: /alizia is thinking/i });
    expect(star).toBeInTheDocument();
  });

  it('renders EmptyState and ErrorState with action buttons', () => {
    const handleRetry = vi.fn();
    render(
      <ErrorState
        message="Backend SSE stream disconnected"
        code="STREAM_ERR_503"
        onRetry={handleRetry}
      />
    );
    expect(screen.getByText('Backend SSE stream disconnected')).toBeInTheDocument();
    expect(screen.getByText(/STREAM_ERR_503/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /retry request/i }));
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
