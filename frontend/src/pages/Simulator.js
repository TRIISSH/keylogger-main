import { useState, useEffect } from 'react';
import { Play, Square, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import LogViewer from '@/components/LogViewer';
import StatsCard from '@/components/StatsCard';
import ExfiltrationIndicator from '@/components/ExfiltrationIndicator';
import { useKeylogger } from '@/hooks/useKeylogger';
import { toast } from 'sonner';

export default function Simulator() {
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const {
    isActive,
    keystrokes,
    buffer,
    stats,
    start,
    stop,
    clear,
    handleKeyDown,
  } = useKeylogger(sessionId);

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isActive) {
      toast.success('Keylogger Active', {
        description: 'All keystrokes are being captured',
      });
    } else if (keystrokes.length > 0) {
      toast.info('Keylogger Stopped', {
        description: 'Keystroke capture paused',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const handleStart = () => {
    start();
  };

  const handleStop = () => {
    stop();
  };

  const handleClear = () => {
    clear();
    setInputValue('');
    toast.success('Session Cleared', {
      description: 'All captured data has been deleted',
    });
  };

  const handleExport = () => {
    const data = keystrokes.map(k => `${k.timestamp} | ${k.key} | ${k.code}`).join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keylog_${sessionId}.txt`;
    a.click();
    toast.success('Logs Exported', {
      description: 'Keystroke data downloaded',
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-secondary font-bold uppercase tracking-tight text-foreground">
            Live Simulator
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Session ID: <span className="font-mono text-primary">{sessionId}</span>
          </p>
        </div>
        <div className="flex gap-3">
          {!isActive ? (
            <Button
              onClick={handleStart}
              className="glow-primary"
              size="lg"
              data-testid="start-capture-btn"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Capture
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              variant="destructive"
              size="lg"
              data-testid="stop-capture-btn"
            >
              <Square className="mr-2 h-5 w-5" />
              Stop Capture
            </Button>
          )}
          <Button
            onClick={handleClear}
            variant="outline"
            size="lg"
            disabled={keystrokes.length === 0}
            data-testid="clear-logs-btn"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            Clear
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            size="lg"
            disabled={keystrokes.length === 0}
            data-testid="export-logs-btn"
          >
            <Download className="mr-2 h-5 w-5" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Keys Captured"
          value={stats.totalKeys}
          subtitle="This session"
        />
        <StatsCard
          title="Session Duration"
          value={formatDuration(stats.sessionDuration)}
          subtitle="Active time"
        />
        <StatsCard
          title="Typing Speed"
          value={`${stats.wpm} WPM`}
          subtitle="Words per minute"
        />
      </div>

      {/* Main Simulator Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Input Area */}
          <div className="p-6 bg-card border border-border rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-secondary font-bold uppercase tracking-tight text-foreground">
                Target Input Area
              </h3>
              {isActive && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-destructive">RECORDING</span>
                </div>
              )}
            </div>
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type here to simulate keystroke capture... All keys will be logged."
              className="min-h-[200px] font-mono text-base bg-background border-zinc-700 focus:ring-primary"
              data-testid="simulator-input"
            />
            <p className="text-xs text-muted-foreground mt-3">
              🔒 In a real keylogger, this could be any application - your browser, email client, or password manager.
            </p>
          </div>

          {/* Live Log View */}
          <div className="p-6 bg-card border border-border rounded-sm">
            <h3 className="text-sm font-secondary font-bold uppercase tracking-tight text-foreground mb-4">
              Live Keystroke Log
            </h3>
            <LogViewer keystrokes={keystrokes} maxHeight="400px" />
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <ExfiltrationIndicator buffer={buffer} isActive={isActive} />

          {/* Info Panel */}
          <div className="p-6 bg-card border border-border rounded-sm">
            <h3 className="text-sm font-secondary font-bold uppercase tracking-tight text-foreground mb-4">
              💡 Did You Know?
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Passwords are vulnerable:</strong> Even with masked input fields (*****), keyloggers capture the actual keys pressed.
              </p>
              <p>
                <strong className="text-foreground">Stealth operation:</strong> Real keyloggers run silently without visible windows or high CPU usage.
              </p>
              <p>
                <strong className="text-foreground">Buffer strategy:</strong> Writing every keystroke to disk is "noisy." Instead, they buffer 50-100 keys before saving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}