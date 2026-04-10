import { useState, useEffect, useRef } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordDisplayProps {
  password: string;
  onRegenerate: () => void;
  onPasswordEdit: (newPassword: string) => void;
}

const PasswordDisplay = ({ password, onRegenerate, onPasswordEdit }: PasswordDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [displayedPassword, setDisplayedPassword] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isUserEditRef = useRef(false);

  // Typing animation only when password changes programmatically
  useEffect(() => {
    if (isUserEditRef.current) {
      isUserEditRef.current = false;
      setDisplayedPassword(password);
      return;
    }

    setIsAnimating(true);
    setDisplayedPassword("");
    const len = password.length;
    if (len === 0) { setIsAnimating(false); return; }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedPassword(password.slice(0, i));
      if (i >= len) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [password]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserEditRef.current = true;
    onPasswordEdit(e.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-3 transition-colors duration-200 focus-within:border-primary/40">
        <div className="flex-1 overflow-x-auto">
          <input
            ref={inputRef}
            type="text"
            value={isAnimating ? displayedPassword : password}
            onChange={handleChange}
            readOnly={isAnimating}
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-transparent font-mono text-base tracking-wider text-primary neon-text outline-none border-none caret-primary"
          />
        </div>
        <Button variant="ghost" size="icon" onClick={handleCopy} className="shrink-0 h-8 w-8 text-muted-foreground hover:text-primary transition-colors duration-200">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={onRegenerate} className="shrink-0 h-8 w-8 text-muted-foreground hover:text-primary transition-colors duration-200">
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
      {copied && (
        <p className="text-xs text-primary transition-opacity duration-200">copied to clipboard!</p>
      )}
    </div>
  );
};

export default PasswordDisplay;
