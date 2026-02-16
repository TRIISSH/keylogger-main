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
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-primary/20 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-tight text-foreground flex items-center gap-3">
            <span className="text-primary text-glow">●</span> Live Simulator
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            Session ID: <span className="text-primary">{sessionId}</span>
          </p>
        </div>
        <div className="flex gap-3">
          {!isActive ? (
            <Button
              onClick={handleStart}
              size="lg"
              data-testid="start-capture-btn"
              variant="tech"
              className="font-bold"
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
              className="shadow-[0_0_15px_rgba(255,0,85,0.4)] animate-pulse"
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
            className="font-mono text-xs uppercase"
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
            className="font-mono text-xs uppercase"
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
          subtitle="Current Session"
          className="border-primary/20"
        />
        <StatsCard
          title="Session Duration"
          value={formatDuration(stats.sessionDuration)}
          subtitle="Active Timer"
          className="border-primary/20"
        />
        <StatsCard
          title="Typing Speed"
          value={`${stats.wpm} WPM`}
          subtitle="Estimated Rate"
          className="border-primary/20"
        />
      </div>

      {/* Main Simulator Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Input Area */}
          <div className="p-1 bg-gradient-to-br from-primary/30 to-transparent rounded-sm">
            <div className="p-6 bg-black/80 backdrop-blur-md border border-primary/20 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-secondary font-bold uppercase tracking-wide text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Target Input Area
                </h3>
                {isActive && (
                  <div className="flex items-center gap-2 px-2 py-1 bg-destructive/10 border border-destructive/20 rounded-sm">
                    <div className="w-2 h-2 bg-destructive rounded-full animate-ping" />
                    <span className="text-[10px] font-mono text-destructive font-bold tracking-widest">RECORDING</span>
                  </div>
                )}
              </div>
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder=">> Initialize typing sequence... Log capture pending..."
                className="min-h-[200px] font-mono text-base bg-black border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 rounded-none resize-none"
                data-testid="simulator-input"
              />
              <p className="text-xs text-muted-foreground mt-3 font-mono border-l-2 border-primary/30 pl-3">
                [INFO] Simulates application input field interception. All keystrokes logged to buffer.
              </p>
            </div>
          </div>

          {/* Live Log View */}
          <div className="glass-panel p-6 rounded-sm">
            <h3 className="text-sm font-secondary font-bold uppercase tracking-tight text-foreground mb-4">
              Real-time Interception Log
            </h3>
            <LogViewer keystrokes={keystrokes} maxHeight="400px" />
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <ExfiltrationIndicator buffer={buffer} isActive={isActive} />

          {/* Info Panel */}
          <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Square className="h-16 w-16 text-secondary" />
            </div>
            <h3 className="text-sm font-secondary font-bold uppercase tracking-tight text-foreground mb-4 flex items-center gap-2">
              <span className="text-secondary text-lg">ⓘ</span> Intel Brief
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground font-mono">
              <p>
                <strong className="text-secondary-foreground">&gt;&gt; Password Vulnerability:</strong>
                <br />Keyloggers capture raw input before UI masking (*****) occurs.
              </p>
              <p>
                <strong className="text-secondary-foreground">&gt;&gt; Stealth Mode:</strong>
                <br />Operates as a background daemon with minimal CPU footprint.
              </p>
              <p>
                <strong className="text-secondary-foreground">&gt;&gt; Buffer Logic:</strong>
                <br />Local buffering minimizes disk I/O signature to evade behavioral heuristics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}