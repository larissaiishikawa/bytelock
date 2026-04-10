import { useState, useCallback, useEffect, useRef } from "react";
import { Shield } from "lucide-react";
import PasswordDisplay from "./PasswordDisplay";
import Controls, { type PasswordSettings } from "./Controls";
import StrengthMeter from "./StrengthMeter";

function generatePassword(settings: PasswordSettings): string {
  const { length, uppercase, lowercase, numbers, symbols, avoidAmbiguous } = settings;

  let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let lower = "abcdefghijklmnopqrstuvwxyz";
  let nums = "0123456789";
  const syms = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (avoidAmbiguous) {
    upper = upper.replace(/[OI]/g, "");
    lower = lower.replace(/[l]/g, "");
    nums = nums.replace(/[01]/g, "");
  }

  let chars = "";
  const required: string[] = [];

  if (uppercase) { chars += upper; required.push(upper[Math.floor(Math.random() * upper.length)]); }
  if (lowercase) { chars += lower; required.push(lower[Math.floor(Math.random() * lower.length)]); }
  if (numbers) { chars += nums; required.push(nums[Math.floor(Math.random() * nums.length)]); }
  if (symbols) { chars += syms; required.push(syms[Math.floor(Math.random() * syms.length)]); }

  if (!chars) chars = lower;

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);

  const result = Array.from(arr, (v) => chars[v % chars.length]);

  for (let i = 0; i < required.length && i < length; i++) {
    const pos = arr[i] % length;
    result[pos] = required[i];
  }

  return result.join("");
}

function detectCharTypes(password: string) {
  return {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
  };
}

const GeneratorCard = () => {
  const [settings, setSettings] = useState<PasswordSettings>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    avoidAmbiguous: false,
  });

  const [password, setPassword] = useState("");
  const isEditingRef = useRef(false);

  const regenerate = useCallback(() => {
    isEditingRef.current = false;
    setPassword(generatePassword(settings));
  }, [settings]);

  useEffect(() => {
    if (!isEditingRef.current) {
      regenerate();
    }
  }, [regenerate]);

  const handlePasswordEdit = (newPassword: string) => {
    isEditingRef.current = true;
    setPassword(newPassword);

    const detected = detectCharTypes(newPassword);
    const clampedLength = Math.max(8, Math.min(32, newPassword.length));

    setSettings((prev) => ({
      ...prev,
      length: clampedLength,
      uppercase: detected.uppercase,
      lowercase: detected.lowercase,
      numbers: detected.numbers,
      symbols: detected.symbols,
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col px-4">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-end pb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 neon-glow mb-5">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
          bytelock
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-2">
          secure password generator
        </p>
      </div>

      {/* Card / Form */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4 neon-glow">
        <PasswordDisplay password={password} onRegenerate={regenerate} onPasswordEdit={handlePasswordEdit} />
        <StrengthMeter password={password} />
        <div className="h-px bg-border" />
        <Controls settings={settings} onChange={(s) => { isEditingRef.current = false; setSettings(s); }} />
      </div>

      {/* Footer */}
      <div className="flex-1 flex items-start justify-center pt-6">
        <p className="text-center text-xs text-muted-foreground font-mono leading-relaxed">
          passwords are generated locally.
          <br />
          nothing leaves your browser.
        </p>
      </div>
    </div>
  );
};

export default GeneratorCard;
