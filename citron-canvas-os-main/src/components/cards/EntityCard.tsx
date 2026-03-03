import { Building2, Users, ArrowUpRight, TrendingUp } from "lucide-react";

export function EntityCard() {
  return (
    <div className="glass rounded-xl p-5 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-citrus-lime/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-citrus-lime" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Acme Corporation</h3>
            <p className="text-xs text-muted-foreground">Enterprise · Series C · SaaS</p>
          </div>
        </div>
        <span className="text-xs font-mono text-citrus-lime bg-citrus-lime/10 px-2 py-0.5 rounded">
          Active
        </span>
      </div>

      {/* Relationship edges */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Contacts", value: "12", icon: Users },
          { label: "Open Deals", value: "3", icon: TrendingUp },
          { label: "Touchpoints", value: "47", icon: ArrowUpRight },
        ].map((stat) => (
          <div key={stat.label} className="surface-2 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <stat.icon className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <span className="text-lg font-semibold text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Relationship graph mini */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-citrus-lime" />
        Connected to <span className="text-foreground font-medium">Jane Smith</span>,{" "}
        <span className="text-foreground font-medium">TechVentures</span> +3 more
      </div>
    </div>
  );
}
