interface StrengthMeterProps {
  password: string;
}

function analyzePassword(password: string): { score: number; label: string } {
  if (!password) return { score: 0, label: "none" };

  let score = 0;
  const len = password.length;

  if (len >= 8) score += 1;
  if (len >= 12) score += 1;
  if (len >= 20) score += 1;

  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score: 1, label: "weak" };
  if (score <= 4) return { score: 2, label: "medium" };
  return { score: 3, label: "strong" };
}

const colors: Record<number, string> = {
  0: "bg-secondary",
  1: "bg-destructive",
  2: "bg-yellow-500",
  3: "bg-primary",
};

const textColors: Record<number, string> = {
  0: "text-muted-foreground",
  1: "text-destructive",
  2: "text-yellow-500",
  3: "text-primary",
};

const StrengthMeter = ({ password }: StrengthMeterProps) => {
  const { score, label } = analyzePassword(password);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground font-mono">strength</span>
        <span className={`text-[10px] font-mono font-semibold transition-colors duration-300 ${textColors[score]}`}>{label}</span>
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ease-out ${
              i <= score ? colors[score] : "bg-secondary"
            }`}
          />
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground font-mono transition-opacity duration-300">
        {score <= 1
          ? "add more character types and length for better security."
          : score === 2
          ? "good, but a longer password with more variety is safer."
          : "excellent! this password is very strong."}
      </p>
    </div>
  );
};

export default StrengthMeter;
