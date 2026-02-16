import { motion } from 'framer-motion';
import { Upload, Mail, Globe, HardDrive, Activity } from 'lucide-react';
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
    <div className="p-1 bg-gradient-to-br from-primary/20 to-transparent rounded-sm" data-testid="exfiltration-indicator">
      <div className="bg-black/90 p-6 border border-primary/20 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-display font-bold uppercase tracking-widest text-primary flex items-center gap-2">
            <Activity className="h-4 w-4 animate-pulse" />
            Exfiltration_Daemon
          </h3>
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary animate-ping' : 'bg-muted'}`} />
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </div>

        <div className="space-y-6">
          {/* Buffer Status */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 blur-sm opacity-50" />
            <div className="relative flex items-center justify-between p-3 border border-primary/30 bg-black/50">
              <div className="flex items-center gap-3">
                <HardDrive className="h-4 w-4 text-primary" />
                <span className="text-xs font-mono text-primary/80 uppercase tracking-wider">Local_Buffer</span>
              </div>
              <span className="text-lg font-display font-bold text-foreground text-glow">{buffer.length.toString().padStart(3, '0')} <span className="text-xs text-muted-foreground">pkts</span></span>
            </div>
          </div>

          {/* Data Flow Animation */}
          <div className="relative h-20 border-x border-primary/20 mx-4">
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <div className="text-center z-10 bg-black/80 p-2 border border-primary/20">
                <HardDrive className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-[10px] font-mono text-primary/60">LOCALHOST</p>
              </div>

              {/* Connection Line */}
              <div className="flex-1 relative h-[1px] bg-primary/20 mx-2">
                <div className="absolute top-0 left-0 w-full h-full bg-primary/20 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 animate-scanline" style={{ transform: 'rotate(90deg)' }} />
                </div>

                {isActive && (
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 bg-primary shadow-[0_0_10px_theme(colors.primary.DEFAULT)]"
                    animate={{
                      x: [0, '100%'],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                )}
              </div>

              <div className="text-center z-10 bg-black/80 p-2 border border-secondary/20">
                <Globe className={`h-5 w-5 mx-auto mb-1 ${showPulse ? 'text-secondary text-glow-purple' : 'text-muted-foreground'}`} />
                <p className="text-[10px] font-mono text-muted-foreground">C2_SERVER</p>
              </div>
            </div>
          </div>

          {/* Exfiltration Methods */}
          <div className="space-y-2">
            <p className="text-[10px] font-secondary text-muted-foreground/50 uppercase tracking-widest pl-1">Transmission_Protocols</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Mail, label: 'SMTP', color: 'text-blue-500', border: 'border-blue-500/30' },
                { icon: Globe, label: 'HTTP', color: 'text-primary', border: 'border-primary/30' },
                { icon: Upload, label: 'FTP', color: 'text-purple-500', border: 'border-purple-500/30' },
              ].map((method) => (
                <div
                  key={method.label}
                  className={`p-2 bg-black/50 border ${method.border} text-center hover:bg-white/5 transition-colors cursor-crosshair group`}
                >
                  <method.icon className={`h-4 w-4 ${method.color} mx-auto mb-1 group-hover:scale-110 transition-transform`} />
                  <p className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground">{method.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          {buffer.length >= 50 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 bg-secondary/10 border-l-2 border-secondary relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-secondary/5 animate-pulse" />
              <p className="text-xs text-secondary font-mono relative z-10 flex items-center gap-2">
                <Activity className="h-3 w-3" />
                BUFFER_OVERFLOW: Auto-Exfiltration Active
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}