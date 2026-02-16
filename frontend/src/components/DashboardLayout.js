import { Link, useLocation } from 'react-router-dom';
import { Terminal, Activity, Database, BookOpen, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Terminal },
  { name: 'Simulator', href: '/simulator', icon: Activity },
  { name: 'Logs', href: '/logs', icon: Database },
  { name: 'Education', href: '/education', icon: BookOpen },
];

export default function DashboardLayout({ children }) {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background font-mono text-sm">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border/40 backdrop-blur-md bg-background/80 flex flex-col z-20">
        <div className="p-6 border-b border-border/40">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse-glow" />
              <div className="p-2 bg-black border border-primary/50 relative z-10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-display font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">KeyLogger</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <p className="text-[10px] font-secondary text-primary uppercase tracking-widest">System Active</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                data-testid={`nav-${item.name.toLowerCase()}`}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden group',
                  isActive
                    ? 'text-primary bg-primary/5 border-r-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
                )}
                <item.icon className={cn("h-4 w-4 relative z-10", isActive && "text-glow")} />
                <span className={cn("font-secondary uppercase tracking-wide relative z-10", isActive && "font-bold text-glow")}>
                  {item.name}
                </span>
                {isActive && <div className="ml-auto w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_theme(colors.primary.DEFAULT)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/40">
          <div className="p-4 bg-destructive/5 border border-destructive/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-4 w-4 text-destructive" />
              <p className="text-xs font-secondary text-destructive uppercase tracking-widest font-bold">Restricted Access</p>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed font-mono relative z-10">
              For authorized educational personnel only. All actions are logged and monitored.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-grid-pattern">
        {/* Ambient background effects */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        <div className="fixed inset-0 pointer-events-none z-0 scanlines opacity-30" />

        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}