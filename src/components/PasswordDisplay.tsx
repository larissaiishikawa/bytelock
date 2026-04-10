import { useState, useRef } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordDisplayProps {
  password: string;
  onRegenerate: () => void;
  onPasswordEdit: (newPassword: string) => void;
}

const PasswordDisplay = ({ password, onRegenerate, onPasswordEdit }: PasswordDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-4 transition-colors duration-200 focus-within:border-primary/40">
        <div className="flex-1 overflow-x-auto">
          <input
            ref={inputRef}
            type="text"
            value={password}
            onChange={(e) => onPasswordEdit(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-transparent font-mono text-lg md:text-xl tracking-wider text-primary neon-text outline-none border-none caret-primary"
          />
        </div>
        <Button variant="ghost" size="icon" onClick={handleCopy} className="shrink-0 text-muted-foreground hover:text-primary transition-colors duration-200">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onRegenerate} className="shrink-0 text-muted-foreground hover:text-primary transition-colors duration-200">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      {copied && (
        <p className="text-xs text-primary transition-opacity duration-200">Copied to clipboard!</p>
      )}
    </div>
  );
};

export default PasswordDisplay;
