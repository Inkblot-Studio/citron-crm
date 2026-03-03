import { CircularScore } from "./CircularScore";

export function IntelligenceCard() {
  return (
    <div className="glass rounded-xl p-5 animate-fade-in">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Intelligence Scores
      </h4>
      <div className="grid grid-cols-3 gap-6">
        <CircularScore
          label="Revenue Confidence"
          value={82}
          color="var(--citrus-lime)"
        />
        <CircularScore
          label="Churn Risk"
          value={23}
          color="var(--citrus-orange)"
          inverted
        />
        <CircularScore
          label="Momentum"
          value={67}
          color="var(--citrus-lemon)"
        />
      </div>
    </div>
  );
}
