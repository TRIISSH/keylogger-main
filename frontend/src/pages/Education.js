import { Code, Shield, AlertTriangle, Lock, Eye, Network } from 'lucide-react';

export default function Education() {
  const sections = [
    {
      title: 'How Keyloggers Work',
      icon: Code,
      content: [
        {
          subtitle: '1. Hooking Methods',
          text: 'Keyloggers intercept keystrokes by "hooking" into the operating system\'s message stream. There are two primary approaches:',
          details: [
            '<strong class="text-primary">User-Level Hooking:</strong> Uses standard APIs like SetWindowsHookEx (Windows) or Quartz Event Services (macOS) to intercept keyboard events before they reach applications.',
            '<strong class="text-primary">Kernel-Level Hooking:</strong> Involves writing a filter driver that sits between hardware and the OS. Much harder to detect but significantly more complex to implement.',
          ],
        },
        {
          subtitle: '2. Key Code Translation',
          text: 'The OS doesn\'t send the letter "A" - it sends a virtual key code (e.g., 0x41). Keyloggers use mapping tables or functions like ToUnicode() to convert these codes into readable characters.',
          details: [
            'Special handling for modifier keys (Shift, Ctrl, Alt)',
            'Proper interpretation of Backspace, Enter, and navigation keys',
            'Context-aware translation based on keyboard layout',
          ],
        },
        {
          subtitle: '3. Buffer Strategy',
          text: 'Writing every keystroke to disk is "noisy" and can be detected. Professional keyloggers use buffering:',
          details: [
            'Store 50-100 characters in RAM before writing to disk',
            'Reduces disk I/O and makes detection harder',
            'Balances stealth with data loss risk if system crashes',
          ],
        },
      ],
    },
    {
      title: 'Data Exfiltration',
      icon: Network,
      content: [
        {
          subtitle: 'Remote Communication',
          text: 'Captured data is worthless if it stays on the victim\'s machine. Keyloggers use various methods to send data to attackers:',
          details: [
            '<strong class="text-primary">Email (SMTP):</strong> Periodically sends logs as email attachments. Simple but leaves email traces.',
            '<strong class="text-primary">HTTP POST:</strong> Sends data to a web server disguised as normal traffic. Most common method.',
            '<strong class="text-primary">FTP Upload:</strong> Uploads log files to a remote FTP server. Easy to detect with network monitoring.',
            '<strong class="text-primary">Cloud Storage:</strong> Modern keyloggers sync to Dropbox, Google Drive, etc.',
          ],
        },
        {
          subtitle: 'Timing & Frequency',
          text: 'Attackers balance between data freshness and detection risk:',
          details: [
            'Too frequent: Suspicious network activity',
            'Too infrequent: Risk of data loss if malware is discovered',
            'Common interval: Every 30 minutes to 2 hours',
            'Some wait for idle periods or specific triggers',
          ],
        },
      ],
    },
    {
      title: 'Detection & Defense',
      icon: Shield,
      content: [
        {
          subtitle: 'Detection Methods',
          text: 'How security professionals identify keyloggers:',
          details: [
            '<strong class="text-primary">Signature-based:</strong> Antivirus scans for known malware patterns',
            '<strong class="text-primary">Behavioral Analysis:</strong> Monitor for suspicious API calls (SetWindowsHookEx, GetAsyncKeyState)',
            '<strong class="text-primary">Network Monitoring:</strong> Unusual outbound connections',
            '<strong class="text-primary">Process Analysis:</strong> Hidden or disguised processes',
          ],
        },
        {
          subtitle: 'Protection Strategies',
          text: 'Defending against keystroke capture:',
          details: [
            '<strong class="text-primary">Virtual Keyboards:</strong> On-screen keyboards bypass hardware hooks',
            '<strong class="text-primary">2FA/MFA:</strong> Stolen passwords are useless without second factor',
            '<strong class="text-primary">Anti-Keylogger Software:</strong> Specialized tools that detect hooking',
            '<strong class="text-primary">Regular Scans:</strong> Keep antivirus updated and scan regularly',
            '<strong class="text-primary">Principle of Least Privilege:</strong> Run as non-admin to limit installation',
          ],
        },
      ],
    },
    {
      title: 'Legal & Ethical Considerations',
      icon: Lock,
      content: [
        {
          subtitle: 'Legal Status',
          text: 'Keylogger legality depends on context and jurisdiction:',
          details: [
            '<strong class="text-primary">Illegal:</strong> Installing on someone else\'s computer without consent',
            '<strong class="text-primary">Legal:</strong> Monitoring your own devices or employer-owned systems with proper disclosure',
            '<strong class="text-primary">Gray Area:</strong> Parental monitoring (varies by location and child\'s age)',
            'Penalties include fines, imprisonment, and civil lawsuits',
          ],
        },
        {
          subtitle: 'Ethical Use',
          text: 'Even when legal, ethical considerations apply:',
          details: [
            'Always obtain informed consent',
            'Use in controlled environments (VMs, test systems)',
            'Educational and research purposes only',
            'Never deploy without explicit permission',
            'Respect privacy and handle data responsibly',
          ],
        },
      ],
    },
  ];

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-block px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-xs font-mono text-primary mb-2">
          KNOWLEDGE_BASE // ACCESS_GRANTED
        </div>
        <h1 className="text-4xl font-display font-bold uppercase tracking-tight text-foreground">
          Educational <span className="text-primary text-glow">Resources</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-mono text-sm leading-relaxed">
          &gt; Understanding keystroke logging: technical mechanisms, detection methods, and defensive strategies.
        </p>
      </div>

      {/* Warning */}
      <div className="p-1 bg-gradient-to-r from-destructive/40 to-transparent rounded-sm">
        <div className="p-6 bg-black/90 border border-destructive/30 flex items-start gap-4">
          <div className="p-3 bg-destructive/10 rounded-full border border-destructive/20 shadow-[0_0_15px_rgba(255,0,85,0.2)]">
            <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-secondary font-bold text-destructive uppercase mb-2">
              Important Legal Notice
            </h3>
            <p className="text-sm text-foreground/90 font-mono">
              Unauthorized keylogging is a serious crime in most jurisdictions. This simulator is for educational purposes only. Always obtain explicit permission before monitoring any computer system you don't own.
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      {sections.map((section, idx) => (
        <div key={idx} className="group relative">
          <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
          <div className="p-8 glass-panel border border-primary/10 rounded-sm relative z-10 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-4 mb-6 border-b border-primary/10 pb-4">
              <div className="p-3 bg-primary/10 rounded-sm border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                <section.icon className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-foreground">
                {section.title}
              </h2>
            </div>

            <div className="space-y-8">
              {section.content.map((item, i) => (
                <div key={i} className="pl-4 border-l-2 border-primary/10 hover:border-primary/50 transition-colors">
                  <h3 className="text-lg font-secondary font-bold text-primary/90 mb-3 uppercase tracking-wider text-sm">
                    {item.subtitle}
                  </h3>
                  <p className="text-muted-foreground mb-4 font-mono text-sm leading-relaxed">{item.text}</p>
                  <ul className="space-y-2">
                    {item.details.map((detail, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground/80 font-mono">
                        <span className="text-primary mt-1 text-xs">➜</span>
                        <span dangerouslySetInnerHTML={{ __html: detail }} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Technical Implementation */}
      <div className="glass-panel p-8 border border-primary/10 rounded-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-secondary/10 rounded-sm border border-secondary/20">
            <Eye className="h-7 w-7 text-secondary" />
          </div>
          <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-foreground">
            This Simulator vs. Real Keyloggers
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 font-secondary uppercase tracking-wider text-primary/70 text-xs">Aspect</th>
                <th className="text-left py-4 px-4 font-secondary uppercase tracking-wider text-primary/70 text-xs">This Simulator</th>
                <th className="text-left py-4 px-4 font-secondary uppercase tracking-wider text-primary/70 text-xs">Real Keylogger</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 text-foreground font-semibold">Hooking Method</td>
                <td className="py-4 px-4 text-muted-foreground">JavaScript event listeners</td>
                <td className="py-4 px-4 text-muted-foreground">OS-level API hooks (SetWindowsHookEx)</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 text-foreground font-semibold">Scope</td>
                <td className="py-4 px-4 text-muted-foreground">Single web page only</td>
                <td className="py-4 px-4 text-muted-foreground">System-wide (all applications)</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 text-foreground font-semibold">Stealth</td>
                <td className="py-4 px-4 text-muted-foreground">Fully visible UI</td>
                <td className="py-4 px-4 text-muted-foreground">Hidden process, no UI</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 text-foreground font-semibold">Exfiltration</td>
                <td className="py-4 px-4 text-muted-foreground">Simulated (fake network requests)</td>
                <td className="py-4 px-4 text-muted-foreground">Real data transmission</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 text-foreground font-semibold">Persistence</td>
                <td className="py-4 px-4 text-muted-foreground">Browser session only</td>
                <td className="py-4 px-4 text-muted-foreground">Survives reboots (registry/startup)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}