import { cn } from '@/lib/utils';

export default function StatsCard({ title, value, icon: Icon, subtitle, className, ...props }) {
  return (
    <div {...props} className={cn("p-6 bg-card border border-border rounded-sm", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-secondary text-muted-foreground uppercase tracking-widest mb-2">
            {title}
          </p>
          <p className="text-3xl font-secondary font-bold text-foreground mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-sm">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}