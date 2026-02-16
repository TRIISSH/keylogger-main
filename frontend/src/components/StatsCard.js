import { cn } from '@/lib/utils';

export default function StatsCard({ title, value, icon: Icon, subtitle, className, ...props }) {
  return (
    <div {...props} className={cn("relative group overflow-hidden", className)}>
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Tech Borders */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary/50" />

      <div className="p-6 glass-panel border-l-4 border-l-primary/50 h-full flex flex-col justify-between relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-secondary text-primary/80 uppercase tracking-widest mb-1 font-bold">
              [{title}]
            </p>
            <p className="text-4xl font-display font-bold text-foreground tracking-tight text-glow">
              {value}
            </p>
          </div>
          {Icon && (
            <div className="p-3 bg-primary/10 border border-primary/20 shadow-[0_0_10px_rgba(0,255,157,0.1)]">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>

        {subtitle && (
          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/50">
            <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
            <p className="text-xs text-muted-foreground font-mono">{subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}