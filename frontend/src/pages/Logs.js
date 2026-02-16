import { useEffect, useState } from 'react';
import { Filter, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogViewer from '@/components/LogViewer';
import axios from 'axios';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { API } from '../config';

export default function Logs() {
  const [keystrokes, setKeystrokes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchKeystrokes = async (sessionId = null, showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const params = sessionId && sessionId !== 'all' ? { session_id: sessionId } : {};
      const response = await axios.get(`${API}/keystrokes`, { params });
      setKeystrokes(response.data);
    } catch (error) {
      console.error('Failed to fetch keystrokes:', error);
      toast.error('Failed to load logs');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${API}/sessions`);
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  useEffect(() => {
    fetchKeystrokes(selectedSession === 'all' ? null : selectedSession);
    fetchSessions();

    const interval = setInterval(() => {
      fetchKeystrokes(selectedSession === 'all' ? null : selectedSession, false);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedSession]);

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all logs?')) return;

    try {
      await axios.delete(`${API}/keystrokes`);
      setKeystrokes([]);
      setSessions([]);
      toast.success('All logs cleared');
    } catch (error) {
      console.error('Failed to clear logs:', error);
      toast.error('Failed to clear logs');
    }
  };

  const handleExport = () => {
    const data = keystrokes.map(k =>
      `${k.timestamp} | ${k.key} | ${k.code} | ${k.key_code}`
    ).join('\n');

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keylog_export_${Date.now()}.txt`;
    a.click();
    toast.success('Logs exported');
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold uppercase tracking-tight text-foreground flex items-center gap-3">
            <span className="text-primary text-glow">&gt;</span> Keystroke Logs
          </h1>
          <p className="text-sm text-muted-foreground font-mono border-l-2 border-primary/30 pl-3 ml-2">
            buffer_size: <span className="text-primary font-bold">{keystrokes.length.toLocaleString()}</span> entries
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleExport}
            variant="outline"
            disabled={keystrokes.length === 0}
            data-testid="export-all-logs-btn"
            className="font-mono text-xs uppercase tracking-wider"
          >
            <Download className="mr-2 h-4 w-4" />
            Export_Data
          </Button>
          <Button
            onClick={handleClearAll}
            variant="destructive"
            disabled={keystrokes.length === 0}
            data-testid="clear-all-logs-btn"
            className="font-mono text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,85,0.3)]"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Purge_Buffer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-sm">
        <div className="p-6 bg-black/80 backdrop-blur-md border border-primary/20 flex items-center gap-6">
          <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
            <Filter className="h-5 w-5 text-primary" />
          </div>

          <div className="flex-1">
            <label className="text-xs font-secondary text-primary/70 uppercase tracking-widest mb-2 block font-bold">
              Target Session ID
            </label>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-[350px] bg-black/50 border-primary/30 text-foreground font-mono focus:ring-primary/50" data-testid="session-filter">
                <SelectValue placeholder=">> Select session stream..." />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-primary/30 text-foreground font-mono">
                <SelectItem value="all" className="focus:bg-primary/20 focus:text-primary">
                  [*] ALL SESSIONS
                </SelectItem>
                {sessions.map((session) => (
                  <SelectItem key={session.session_id} value={session.session_id} className="focus:bg-primary/20 focus:text-primary">
                    [{session.session_id.substring(0, 8)}...] Events: {session.key_count}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-right px-6 border-l border-primary/20">
            <p className="text-xs font-secondary text-muted-foreground uppercase tracking-widest mb-1">
              Active Streams
            </p>
            <p className="text-3xl font-display font-bold text-foreground text-glow">
              {sessions.length.toString().padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="relative">
        <div className="absolute -top-3 left-4 px-2 bg-background text-xs font-bold text-primary uppercase tracking-widest z-10 border border-primary/30">
          Raw_Input_Stream
        </div>
        <div className="tech-border">
          {loading ? (
            <div className="text-center py-24 flex flex-col items-center justify-center bg-black/50">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-primary font-mono animate-pulse">Initializing Log Stream...</p>
            </div>
          ) : (
            <LogViewer keystrokes={keystrokes} maxHeight="600px" />
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 glass-panel border border-primary/10 rounded-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Filter className="h-16 w-16 text-primary" />
          </div>
          <p className="text-xs font-secondary text-muted-foreground uppercase tracking-widest mb-2">
            Total Captured
          </p>
          <p className="text-3xl font-display font-bold text-foreground">
            {keystrokes.length.toLocaleString()}
          </p>
          <div className="w-full bg-primary/10 h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[75%]" />
          </div>
        </div>

        <div className="p-6 glass-panel border border-primary/10 rounded-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Filter className="h-16 w-16 text-primary" />
          </div>
          <p className="text-xs font-secondary text-muted-foreground uppercase tracking-widest mb-2">
            Sessions
          </p>
          <p className="text-3xl font-display font-bold text-foreground">
            {sessions.length}
          </p>
          <div className="w-full bg-secondary/10 h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-secondary h-full w-[45%]" />
          </div>
        </div>

        <div className="p-6 glass-panel border border-primary/10 rounded-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Filter className="h-16 w-16 text-primary" />
          </div>
          <p className="text-xs font-secondary text-muted-foreground uppercase tracking-widest mb-2">
            Est. Size
          </p>
          <p className="text-3xl font-display font-bold text-foreground">
            {((keystrokes.length * 50) / 1024).toFixed(2)} <span className="text-sm text-muted-foreground">KB</span>
          </p>
          <div className="w-full bg-primary/10 h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[15%]" />
          </div>
        </div>
      </div>
    </div>
  );
}