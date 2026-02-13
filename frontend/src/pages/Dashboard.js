import { useEffect, useState } from 'react';
import { AlertTriangle, Keyboard, Database, Activity, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import axios from 'axios';

import { API } from '../config';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_keys: 0,
    total_sessions: 0,
    recent_activity: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/stats`);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Warning Banner */}
      <div className="p-6 bg-destructive/10 border-2 border-destructive/30 rounded-sm" data-testid="warning-banner">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-destructive/20 rounded-sm">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-secondary font-bold uppercase tracking-tight text-destructive mb-2">
              ⚠️ Educational Cybersecurity Simulator
            </h2>
            <p className="text-sm text-foreground mb-3">
              This is a <strong>controlled simulation</strong> designed for educational purposes only. It demonstrates how keyloggers capture and exfiltrate data.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>All data is stored locally in your browser session</li>
              <li>No actual system-level hooking occurs</li>
              <li>For use in virtual machines and controlled environments only</li>
              <li>Unauthorized keylogging is illegal and punishable by law</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-5xl font-secondary font-bold uppercase tracking-tight text-foreground">
          Keylogger <span className="text-primary">Simulator</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Understand keystroke capture, buffering strategies, and data exfiltration in a safe, educational environment.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link to="/simulator">
            <Button className="glow-primary" size="lg" data-testid="start-simulation-btn">
              <Activity className="mr-2 h-5 w-5" />
              Start Simulation
            </Button>
          </Link>
          <Link to="/education">
            <Button variant="outline" size="lg" data-testid="learn-more-btn">
              Learn How It Works
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Keystrokes"
          value={stats.total_keys.toLocaleString()}
          icon={Keyboard}
          subtitle="All-time captured"
          data-testid="stat-total-keys"
        />
        <StatsCard
          title="Total Sessions"
          value={stats.total_sessions}
          icon={Database}
          subtitle="Unique simulations"
          data-testid="stat-total-sessions"
        />
        <StatsCard
          title="Recent Activity"
          value={stats.recent_activity}
          icon={Activity}
          subtitle="Last 5 minutes"
          data-testid="stat-recent-activity"
        />
      </div>

      {/* Concept Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-card border border-border rounded-sm">
          <h3 className="text-lg font-secondary font-bold uppercase tracking-tight text-foreground mb-4">
            How It Works
          </h3>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
              <span><strong className="text-foreground">Hooking:</strong> Real keyloggers hook into OS message streams using APIs like SetWindowsHookEx</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
              <span><strong className="text-foreground">Capture:</strong> Every keystroke is intercepted before reaching the target application</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
              <span><strong className="text-foreground">Buffer:</strong> Keys are stored in memory to reduce disk writes (stealth)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">4</span>
              <span><strong className="text-foreground">Exfiltration:</strong> Data is sent to remote servers via email, HTTP, or FTP</span>
            </li>
          </ol>
        </div>

        <div className="p-6 bg-card border border-border rounded-sm">
          <h3 className="text-lg font-secondary font-bold uppercase tracking-tight text-foreground mb-4">
            Defensive Measures
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Antivirus Software:</strong> Keep definitions updated to detect known keyloggers</span>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Virtual Keyboards:</strong> Use on-screen keyboards for sensitive input</span>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
              <span><strong className="text-foreground">2FA/MFA:</strong> Multi-factor authentication limits damage if passwords are stolen</span>
            </li>
            <li className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
              <span><strong className="text-foreground">Behavioral Analysis:</strong> Monitor for unusual network activity</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}