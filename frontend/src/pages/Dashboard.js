import { useEffect, useState } from 'react';
import { AlertTriangle, Keyboard, Database, Activity, ShieldAlert, Terminal, Lock, Cpu } from 'lucide-react';
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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Warning Banner */}
      <div className="relative group overflow-hidden rounded-none border border-destructive/50 bg-destructive/5 p-1" data-testid="warning-banner">
        <div className="absolute top-0 left-0 w-full h-1 bg-destructive/20" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-destructive/20" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,0,85,0.05)_10px,rgba(255,0,85,0.05)_20px)]" />

        <div className="relative z-10 p-4 flex items-start gap-4">
          <div className="p-3 bg-destructive/10 border border-destructive/30 shadow-[0_0_15px_rgba(255,0,85,0.2)]">
            <ShieldAlert className="h-6 w-6 text-destructive animate-pulse" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-display font-bold uppercase tracking-widest text-destructive mb-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-destructive inline-block animate-ping" />
              Security Protocol: Educational
            </h2>
            <p className="text-sm text-destructive-foreground/80 font-mono">
              [SYSTEM NOTICE] This is a controlled simulation environment. NO external data exfiltration permitted.
              Unauthorized use of code outside this sandbox is strictly prohibited.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-12 px-6 overflow-hidden rounded-none border-y border-primary/20 bg-black/40 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            System v2.0 Online
          </div>

          <h1 className="text-6xl md:text-7xl font-display font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 relative">
            Keylogger <span className="text-primary text-glow">Simulator</span>
          </h1>

          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto font-mono leading-relaxed">
            /* Initialize educational buffer. Capture keystrokes. Analyze exfiltration vectors. */
          </p>

          <div className="flex justify-center gap-6 mt-8">
            <Link to="/simulator">
              <Button variant="tech" size="lg" className="h-14 px-8 text-lg group" data-testid="start-simulation-btn">
                <Activity className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                Initialize Simulation
              </Button>
            </Link>
            <Link to="/education">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-secondary uppercase tracking-wide border-primary/30 hover:border-primary" data-testid="learn-more-btn">
                <Terminal className="mr-2 h-5 w-5" />
                Access Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Keystroke_Buffer"
          value={stats.total_keys.toLocaleString()}
          icon={Keyboard}
          subtitle="Total Captured Inputs"
          data-testid="stat-total-keys"
          className="border-primary/20"
        />
        <StatsCard
          title="Session_Database"
          value={stats.total_sessions}
          icon={Database}
          subtitle="Unique Init Vectors"
          data-testid="stat-total-sessions"
          className="border-primary/20"
        />
        <StatsCard
          title="Network_Activity"
          value={stats.recent_activity}
          icon={Activity}
          subtitle="Events / 5 Min"
          data-testid="stat-recent-activity"
          className="border-primary/20"
        />
      </div>

      {/* Concept Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-1 bg-gradient-to-br from-primary/20 to-transparent rounded-sm">
          <div className="h-full bg-black/80 backdrop-blur-md p-6 border border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Cpu className="h-24 w-24 text-primary" />
            </div>

            <h3 className="text-xl font-display font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-3">
              <Terminal className="h-5 w-5" />
              Operational Logic
            </h3>

            <ol className="space-y-4 font-mono text-sm text-muted-foreground relative z-10">
              <li className="flex items-start gap-4 group/item">
                <span className="flex-shrink-0 w-8 h-8 rounded-none border border-primary/30 bg-primary/5 text-primary flex items-center justify-center text-xs font-bold group-hover/item:bg-primary group-hover/item:text-black transition-colors">01</span>
                <div>
                  <strong className="text-foreground block mb-1">Hooking Mechanism</strong>
                  <span className="opacity-70">Intercepts OS message stream via simulated API hooks.</span>
                </div>
              </li>
              <li className="flex items-start gap-4 group/item">
                <span className="flex-shrink-0 w-8 h-8 rounded-none border border-primary/30 bg-primary/5 text-primary flex items-center justify-center text-xs font-bold group-hover/item:bg-primary group-hover/item:text-black transition-colors">02</span>
                <div>
                  <strong className="text-foreground block mb-1">Data Capture</strong>
                  <span className="opacity-70">Raw input is processed and normalized in memory.</span>
                </div>
              </li>
              <li className="flex items-start gap-4 group/item">
                <span className="flex-shrink-0 w-8 h-8 rounded-none border border-primary/30 bg-primary/5 text-primary flex items-center justify-center text-xs font-bold group-hover/item:bg-primary group-hover/item:text-black transition-colors">03</span>
                <div>
                  <strong className="text-foreground block mb-1">Silent Buffer</strong>
                  <span className="opacity-70">Data stored in volatile memory to evade disk scanning.</span>
                </div>
              </li>
              <li className="flex items-start gap-4 group/item">
                <span className="flex-shrink-0 w-8 h-8 rounded-none border border-primary/30 bg-primary/5 text-primary flex items-center justify-center text-xs font-bold group-hover/item:bg-primary group-hover/item:text-black transition-colors">04</span>
                <div>
                  <strong className="text-foreground block mb-1">Exfiltration</strong>
                  <span className="opacity-70">Transmission to remote C2 server via encrypted channel.</span>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="p-1 bg-gradient-to-br from-destructive/20 to-transparent rounded-sm">
          <div className="h-full bg-black/80 backdrop-blur-md p-6 border border-destructive/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Lock className="h-24 w-24 text-destructive" />
            </div>

            <h3 className="text-xl font-display font-bold uppercase tracking-widest text-destructive mb-6 flex items-center gap-3">
              <ShieldAlert className="h-5 w-5" />
              Countermeasures
            </h3>

            <ul className="space-y-4 font-mono text-sm text-muted-foreground relative z-10">
              <li className="flex items-start gap-3 p-3 border border-destructive/10 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <span><strong className="text-destructive-foreground">Heuristic Analysis:</strong> Behavioral monitoring can detect unusual hooking patterns.</span>
              </li>
              <li className="flex items-start gap-3 p-3 border border-destructive/10 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <span><strong className="text-destructive-foreground">Virtual Input:</strong> OS-level virtual keyboards bypass hardware hooks.</span>
              </li>
              <li className="flex items-start gap-3 p-3 border border-destructive/10 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <span><strong className="text-destructive-foreground">MFA Enforcement:</strong> Reduces impact of credential theft via keylogging.</span>
              </li>
              <li className="flex items-start gap-3 p-3 border border-destructive/10 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <span><strong className="text-destructive-foreground">Network Segmentation:</strong> Blocks unauthorized exfiltration traffic.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}