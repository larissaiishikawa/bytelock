import type { PasswordSettings } from "@/components/Controls";

interface StrengthMeterProps {
  password: string;
  settings: PasswordSettings;
}

function getStrength(password: string, settings: PasswordSettings): { score: number; label: string } {
  let score = 0;
  const len = password.length;
  if (len >= 12) score += 2;
  else if (len >= 8) score += 1;
  if (len >= 20) score += 1;

  const types = [settings.uppercase, settings.lowercase, settings.numbers, settings.symbols].filter(Boolean).length;
  score += types;

  if (score <= 2) return { score: 1, label: "Weak" };
  if (score <= 4) return { score: 2, label: "Medium" };
  return { score: 3, label: "Strong" };
}

const colors: Record<number, string> = {
  1: "bg-destructive",
  2: "bg-yellow-500",
  3: "bg-primary",
};

const textColors: Record<number, string> = {
  1: "text-destructive",
  2: "text-yellow-500",
  3: "text-primary",
};

const StrengthMeter = ({ password, settings }: StrengthMeterProps) => {
  const { score, label } = getStrength(password, settings);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground font-mono">Strength</span>
        <span className={`text-xs font-mono font-semibold ${textColors[score]}`}>{label}</span>
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-secondary"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground font-mono">
        {score === 1 && "Add more character types and length for better security."}
        {score === 2 && "Good, but a longer password with more variety is safer."}
        {score === 3 && "Excellent! This password is very strong."}
      </p>
    </div>
  );
};

export default StrengthMeter;
