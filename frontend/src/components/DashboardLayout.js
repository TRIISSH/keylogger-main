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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 sidebar-blur flex flex-col">
        <div className="p-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-sm">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-secondary font-bold uppercase tracking-tight text-foreground">KeyLogger</h1>
              <p className="text-xs font-secondary text-muted-foreground uppercase tracking-widest">Simulator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                data-testid={`nav-${item.name.toLowerCase()}`}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-secondary uppercase tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/40">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-sm">
            <p className="text-xs font-secondary text-destructive uppercase tracking-widest mb-2">⚠️ Educational Only</p>
            <p className="text-xs text-muted-foreground">This tool is for cybersecurity education. Unauthorized use is illegal.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="relative scanlines">
          {children}
        </div>
      </main>
    </div>
  );
}