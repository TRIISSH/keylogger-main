import { ScrollArea } from '@/components/ui/scroll-area';
import { formatTimestamp, getKeyName } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function LogViewer({ keystrokes, maxHeight = '400px' }) {
  return (
    <ScrollArea className="border border-border rounded-sm" style={{ height: maxHeight }}>
      <div className="terminal-bg p-4 font-mono text-sm">
        {keystrokes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No keystrokes captured yet</p>
            <p className="text-xs mt-2">Start the simulator to begin logging</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {keystrokes.slice(0, 100).map((keystroke) => (
              <motion.div
                key={keystroke.id || keystroke.timestamp}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4 py-1 border-b border-zinc-800/50 hover:bg-zinc-900/30"
                data-testid="log-entry"
              >
                <span className="text-secondary text-xs w-28 flex-shrink-0">
                  {formatTimestamp(keystroke.timestamp)}
                </span>
                <span className="text-primary font-bold w-24 flex-shrink-0">
                  {getKeyName(keystroke.key, keystroke.code)}
                </span>
                <span className="text-muted-foreground text-xs w-32 flex-shrink-0">
                  {keystroke.code}
                </span>
                <span className="text-muted-foreground text-xs">
                  {keystroke.key_code || keystroke.keyCode}
                </span>
                {(keystroke.modifiers?.shift || keystroke.modifiers?.ctrl || keystroke.modifiers?.alt) && (
                  <span className="text-secondary text-xs">
                    [{Object.entries(keystroke.modifiers).filter(([_, v]) => v).map(([k]) => k.toUpperCase()).join('+')}]
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </ScrollArea>
  );
}