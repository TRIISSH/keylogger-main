import { useEffect, useState } from 'react';
import { Filter, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogViewer from '@/components/LogViewer';
import axios from 'axios';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { API } from '@/config';

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
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-secondary font-bold uppercase tracking-tight text-foreground">
            Keystroke Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {keystrokes.length.toLocaleString()} total keystrokes captured
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleExport}
            variant="outline"
            disabled={keystrokes.length === 0}
            data-testid="export-all-logs-btn"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={handleClearAll}
            variant="destructive"
            disabled={keystrokes.length === 0}
            data-testid="clear-all-logs-btn"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 bg-card border border-border rounded-sm">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <label className="text-xs font-secondary text-muted-foreground uppercase tracking-widest mb-2 block">
              Filter by Session
            </label>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-[300px]" data-testid="session-filter">
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                {sessions.map((session) => (
                  <SelectItem key={session.session_id} value={session.session_id}>
                    {session.session_id} ({session.key_count} keys)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-right">
            <p className="text-xs font-secondary text-muted-foreground uppercase tracking-widest mb-1">
              Sessions
            </p>
            <p className="text-2xl font-secondary font-bold text-foreground">
              {sessions.length}
            </p>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="p-6 bg-card border border-border rounded-sm">
        <h3 className="text-sm font-secondary font-bold uppercase tracking-tight text-foreground mb-4">
          Captured Keystrokes
        </h3>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading logs...</p>
          </div>
        ) : (
          <LogViewer keystrokes={keystrokes} maxHeight="600px" />
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card border border-border rounded-sm">
          <p className="text-xs font-secondary text-muted-foreground uppercase tracking-widest mb-2">
            Total Keystrokes
          </p>
          <p className="text-3xl font-secondary font-bold text-foreground">
            {keystrokes.length.toLocaleString()}
          </p>
        </div>
        <div className="p-6 bg-card border border-border rounded-sm">
          <p className="text-xs font-secondary text-muted-foreground uppercase tracking-widest mb-2">
            Unique Sessions
          </p>
          <p className="text-3xl font-secondary font-bold text-foreground">
            {sessions.length}
          </p>
        </div>
        <div className="p-6 bg-card border border-border rounded-sm">
          <p className="text-xs font-secondary text-muted-foreground uppercase tracking-widest mb-2">
            Data Size
          </p>
          <p className="text-3xl font-secondary font-bold text-foreground">
            {(keystrokes.length * 50 / 1024).toFixed(2)} KB
          </p>
        </div>
      </div>
    </div>
  );
}