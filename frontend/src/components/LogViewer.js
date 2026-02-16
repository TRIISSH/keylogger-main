import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTimestamp, getKeyName } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function LogViewer({ keystrokes, maxHeight = '400px' }) {
  return (
    <div className="rounded-none border border-primary/30 bg-black/90 font-mono text-sm overflow-hidden shadow-[0_0_20px_rgba(0,255,157,0.1)]">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-3 text-xs text-primary/70 font-bold uppercase tracking-widest">
            root@kali:~/captured_logs
          </span>
        </div>
        <div className="text-xs text-primary/50">
          -bash
        </div>
      </div>

      <ScrollArea className="w-full relative" style={{ height: maxHeight }}>
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]" />

        <div className="p-4 relative z-10 space-y-1">
          {keystrokes.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-3">
              <div className="w-12 h-12 border border-dashed border-muted-foreground rounded-full flex items-center justify-center animate-spin-slow">
                <div className="w-2 h-2 bg-muted-foreground rounded-full" />
              </div>
              <div>
                <p className="font-bold text-primary">BUFFER_EMPTY</p>
                <p className="text-xs mt-1 font-mono opacity-70">Waiting for input stream initialization...</p>
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {keystrokes.slice(0, 100).map((keystroke, index) => (
                <motion.div
                  key={keystroke.id || keystroke.timestamp}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="flex items-center gap-3 py-0.5 px-2 hover:bg-primary/10 border-l-2 border-transparent hover:border-primary group"
                  data-testid="log-entry"
                >
                  <span className="text-muted-foreground/40 text-[10px] w-6 flex-shrink-0 select-none">
                    {(index + 1).toString().padStart(3, '0')}
                  </span>
                  <span className="text-secondary text-xs w-28 flex-shrink-0 font-mono opacity-70 group-hover:opacity-100">
                    [{formatTimestamp(keystroke.timestamp)}]
                  </span>
                  <span className="text-primary font-bold w-24 flex-shrink-0 group-hover:text-glow transition-all">
                    {getKeyName(keystroke.key, keystroke.code)}
                  </span>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-muted-foreground text-xs font-mono">
                      Code: <span className="text-foreground">{keystroke.code}</span>
                    </span>
                    <span className="text-muted-foreground text-xs font-mono border-l border-white/10 pl-3">
                      ID: {keystroke.key_code || keystroke.keyCode}
                    </span>
                  </div>
                  {(keystroke.modifiers?.shift || keystroke.modifiers?.ctrl || keystroke.modifiers?.alt) && (
                    <span className="text-secondary text-[10px] px-1.5 py-0.5 rounded bg-secondary/10 border border-secondary/20">
                      MOD: {Object.entries(keystroke.modifiers).filter(([_, v]) => v).map(([k]) => k.toUpperCase()).join('+')}
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {keystrokes.length > 0 && (
            <div className="flex items-center gap-2 mt-4 text-primary animate-pulse">
              <span className="font-bold">➜</span>
              <div className="w-2.5 h-4 bg-primary" />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}