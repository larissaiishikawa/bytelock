import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface PasswordSettings {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
}

interface ControlsProps {
  settings: PasswordSettings;
  onChange: (settings: PasswordSettings) => void;
}

const toggles: { key: keyof Omit<PasswordSettings, "length">; label: string }[] = [
  { key: "uppercase", label: "Uppercase (A-Z)" },
  { key: "lowercase", label: "Lowercase (a-z)" },
  { key: "numbers", label: "Numbers (0-9)" },
  { key: "symbols", label: "Symbols (!@#$)" },
  { key: "avoidAmbiguous", label: "Avoid ambiguous (O,0,l,1)" },
];

const Controls = ({ settings, onChange }: ControlsProps) => {
  const update = (partial: Partial<PasswordSettings>) =>
    onChange({ ...settings, ...partial });

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground font-mono">Length</Label>
          <span className="font-mono text-sm text-primary neon-text">{settings.length}</span>
        </div>
        <Slider
          value={[settings.length]}
          onValueChange={([v]) => update({ length: v })}
          min={8}
          max={32}
          step={1}
        />
        <div className="flex justify-between text-xs text-muted-foreground font-mono">
          <span>8</span>
          <span>32</span>
        </div>
      </div>

      <div className="space-y-4">
        {toggles.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <Label className="text-sm text-secondary-foreground font-mono cursor-pointer" htmlFor={key}>
              {label}
            </Label>
            <Switch
              id={key}
              checked={settings[key] as boolean}
              onCheckedChange={(v) => update({ [key]: v })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Controls;
