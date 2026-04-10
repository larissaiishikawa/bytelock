import { useState, useEffect } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordDisplayProps {
  password: string;
  onRegenerate: () => void;
}

const PasswordDisplay = ({ password, onRegenerate }: PasswordDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [displayedChars, setDisplayedChars] = useState(0);

  useEffect(() => {
    setDisplayedChars(0);
    const len = password.length;
    if (len === 0) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedChars(i);
      if (i >= len) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [password]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-4">
        <div className="flex-1 overflow-x-auto">
          <span className="font-mono text-lg md:text-xl tracking-wider text-primary neon-text whitespace-nowrap">
            {password.slice(0, displayedChars)}
          </span>
          <span className="inline-block w-[2px] h-5 bg-primary align-middle ml-0.5 animate-blink" />
        </div>
        <Button variant="ghost" size="icon" onClick={handleCopy} className="shrink-0 text-muted-foreground hover:text-primary hover:neon-glow transition-all">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onRegenerate} className="shrink-0 text-muted-foreground hover:text-primary hover:neon-glow transition-all">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      {copied && (
        <p className="text-xs text-primary animate-in fade-in">Copied to clipboard!</p>
      )}
    </div>
  );
};

export default PasswordDisplay;
