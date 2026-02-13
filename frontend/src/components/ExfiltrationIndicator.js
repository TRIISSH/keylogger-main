import { motion } from 'framer-motion';
import { Upload, Mail, Globe, HardDrive } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ExfiltrationIndicator({ buffer, isActive }) {
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (buffer.length > 0 && buffer.length % 10 === 0) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1000);
    }
  }, [buffer.length]);

  return (
    <div className="p-6 bg-card border border-border rounded-sm" data-testid="exfiltration-indicator">
      <h3 className="text-sm font-secondary font-bold uppercase tracking-tight text-foreground mb-4">
        Exfiltration Status
      </h3>
      
      <div className="space-y-4">
        {/* Buffer Status */}
        <div className="flex items-center justify-between p-3 bg-background rounded-sm">
          <div className="flex items-center gap-3">
            <HardDrive className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Local Buffer</span>
          </div>
          <span className="text-sm font-mono font-bold text-primary">{buffer.length} keys</span>
        </div>

        {/* Data Flow Animation */}
        <div className="relative h-16 bg-background rounded-sm overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <div className="text-center">
              <HardDrive className="h-6 w-6 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Source</p>
            </div>
            
            <div className="flex-1 relative h-1 bg-zinc-800 mx-4">
              {isActive && (
                <motion.div
                  className="absolute h-full bg-primary"
                  animate={{
                    x: [0, '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ width: '20px' }}
                />
              )}
            </div>
            
            <div className="text-center">
              <Globe className={`h-6 w-6 mx-auto mb-1 ${showPulse ? 'text-secondary' : 'text-muted-foreground'}`} />
              <p className="text-xs text-muted-foreground">Remote</p>
            </div>
          </div>
        </div>

        {/* Exfiltration Methods */}
        <div className="space-y-2">
          <p className="text-xs font-secondary text-muted-foreground uppercase tracking-widest">Methods</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Mail, label: 'SMTP', color: 'text-blue-500' },
              { icon: Globe, label: 'HTTP', color: 'text-primary' },
              { icon: Upload, label: 'FTP', color: 'text-secondary' },
            ].map((method) => (
              <div
                key={method.label}
                className="p-2 bg-background border border-border rounded-sm text-center hover:border-primary/50 transition-colors"
              >
                <method.icon className={`h-4 w-4 ${method.color} mx-auto mb-1`} />
                <p className="text-xs font-mono text-muted-foreground">{method.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        {buffer.length >= 50 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-secondary/10 border border-secondary/20 rounded-sm"
          >
            <p className="text-xs text-secondary font-mono">⚠️ Buffer full - Initiating exfiltration...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}