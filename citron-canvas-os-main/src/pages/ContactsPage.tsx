import { AppLayout } from "../components/layout/AppLayout";
import { CircularScore } from "../components/cards/CircularScore";
import { Users, Search, Filter, Plus, Building2, User, Star, Tag } from "lucide-react";
import { useState } from "react";

const contacts = [
  { name: "Sarah Chen", company: "Acme Corp", role: "VP of Engineering", score: 92, tags: ["Champion", "Decision Maker"], lastActivity: "2h ago", starred: true },
  { name: "Marcus Johnson", company: "TechVentures", role: "CTO", score: 78, tags: ["Technical Buyer"], lastActivity: "1d ago", starred: false },
  { name: "Elena Rodriguez", company: "GlobalTech Inc", role: "Head of Product", score: 45, tags: ["At Risk"], lastActivity: "12d ago", starred: false },
  { name: "David Park", company: "DataFlow Labs", role: "CEO", score: 67, tags: ["Executive Sponsor"], lastActivity: "3h ago", starred: true },
  { name: "Lisa Wang", company: "StartupXYZ", role: "COO", score: 88, tags: ["Champion", "Budget Holder"], lastActivity: "5h ago", starred: false },
  { name: "James Miller", company: "Acme Corp", role: "Engineering Manager", score: 71, tags: ["End User"], lastActivity: "6h ago", starred: false },
  { name: "Anna Fischer", company: "GlobalTech Inc", role: "CFO", score: 34, tags: ["At Risk", "Budget Holder"], lastActivity: "21d ago", starred: false },
  { name: "Tom Nakamura", company: "TechVentures", role: "VP Sales", score: 83, tags: ["Decision Maker"], lastActivity: "8h ago", starred: true },
];

const tagColors: Record<string, string> = {
  Champion: "bg-citrus-lime/10 text-citrus-lime",
  "Decision Maker": "bg-citrus-lemon/10 text-citrus-lemon",
  "Technical Buyer": "bg-status-info/10 text-status-info",
  "At Risk": "bg-destructive/10 text-destructive",
  "Executive Sponsor": "bg-citrus-orange/10 text-citrus-orange",
  "Budget Holder": "bg-citrus-green/10 text-citrus-green",
  "End User": "bg-secondary text-secondary-foreground",
};

const ContactsPage = () => {
  const [search, setSearch] = useState("");

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout showRightPanel>
      <div className="h-full flex flex-col">
        <header className="px-8 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-status-info/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-status-info" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">Contacts</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {contacts.length} contacts · 5 organizations
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-3 h-3" />
            Add Contact
          </button>
        </header>

        {/* Search & filters */}
        <div className="px-8 py-3 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-1 border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Search contacts..."
            />
          </div>
          <button className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors">
            <Filter className="w-3 h-3" />
            Filters
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-6">
          <div className="glass rounded-xl overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_140px_120px_1fr_80px] gap-4 px-5 py-3 border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
              <span></span>
              <span>Name</span>
              <span>Company</span>
              <span>Role</span>
              <span>Tags</span>
              <span>Score</span>
            </div>
            {filtered.map((c) => (
              <div
                key={c.name}
                className="grid grid-cols-[40px_1fr_140px_120px_1fr_80px] gap-4 px-5 py-3 border-b border-border/50 hover:bg-secondary/30 transition-colors items-center"
              >
                <button className="w-5 h-5 flex items-center justify-center">
                  <Star
                    className={`w-3.5 h-3.5 ${c.starred ? "text-citrus-lemon fill-citrus-lemon" : "text-muted-foreground/30"}`}
                  />
                </button>
                <div>
                  <span className="text-sm font-medium text-foreground">{c.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-2">{c.lastActivity}</span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="w-3 h-3" />
                  {c.company}
                </span>
                <span className="text-xs text-muted-foreground">{c.role}</span>
                <div className="flex flex-wrap gap-1">
                  {c.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${tagColors[tag] || "bg-secondary text-secondary-foreground"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <CircularScore
                  label=""
                  value={c.score}
                  color={c.score >= 70 ? "var(--citrus-lime)" : c.score >= 50 ? "var(--citrus-lemon)" : "var(--citrus-orange)"}
                  size={32}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ContactsPage;
