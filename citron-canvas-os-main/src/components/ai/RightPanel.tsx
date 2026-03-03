import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Activity, ChevronDown, FileText, Mail, Users, CheckSquare, MessageSquare, Paperclip, X } from "lucide-react";
import { EventFeed } from "../feed/EventFeed";
import { useCanvas } from "./CanvasContext";

type PanelTab = "chat" | "events";

interface Agent {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const agents: Agent[] = [
  { id: "general", label: "General", icon: MessageSquare, description: "Full CRM assistant" },
  { id: "invoices", label: "Invoices", icon: FileText, description: "Create & manage invoices" },
  { id: "campaigns", label: "Campaigns", icon: Mail, description: "Email campaigns & templates" },
  { id: "contacts", label: "Contacts", icon: Users, description: "Contact management" },
  { id: "tasks", label: "Tasks", icon: CheckSquare, description: "Task automation" },
];

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  files?: string[];
}

const agentResponses: Record<string, { text: string; cards: ("entity" | "intelligence")[] }> = {
  general: { text: "Here's an overview of your CRM data with entity profile and intelligence scores.", cards: ["entity", "intelligence"] },
  invoices: { text: "I've pulled up your latest invoice data and deal health metrics.", cards: ["entity", "intelligence"] },
  campaigns: { text: "Analyzing your campaign performance. Here are the key insights.", cards: ["intelligence"] },
  contacts: { text: "Here's the contact profile and relationship intelligence.", cards: ["entity"] },
  tasks: { text: "I've reviewed your task queue. Here's what needs attention.", cards: ["intelligence"] },
};

export function RightPanel() {
  const [tab, setTab] = useState<PanelTab>("chat");
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const [agentMenuOpen, setAgentMenuOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", role: "assistant", content: "Welcome to Citron OS. I'm your AI assistant — ask me anything about your revenue operations." },
  ]);
  const [input, setInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addBlocks } = useCanvas();

  const handleSend = () => {
    if (!input.trim() && attachedFiles.length === 0) return;
    const fileNames = attachedFiles.map((f) => f.name);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input || `Attached ${fileNames.length} file(s)`,
      files: fileNames.length > 0 ? fileNames : undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    const query = input;
    setInput("");
    setAttachedFiles([]);

    // Add loading to canvas
    const loadingId = `loading-${Date.now()}`;
    addBlocks([{ id: loadingId, type: "loading" }]);

    setTimeout(() => {
      const response = agentResponses[selectedAgent.id] || agentResponses.general;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.text,
        },
      ]);

      // Replace loading with actual blocks on canvas
      addBlocks([
        { id: `text-${Date.now()}`, type: "text", content: `[${selectedAgent.label}] ${response.text}` },
        ...response.cards.map((card, i) => ({
          id: `card-${Date.now()}-${i}`,
          type: card as "entity" | "intelligence",
        })),
      ]);
    }, 800);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setTab("chat")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
            tab === "chat" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="w-3 h-3" />
          AI Chat
        </button>
        <button
          onClick={() => setTab("events")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors ${
            tab === "events" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="w-3 h-3" />
          Events
        </button>
      </div>

      {tab === "events" ? (
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <EventFeed />
        </div>
      ) : (
        <>
          {/* Agent Selector */}
          <div className="px-3 py-2 border-b border-border relative">
            <button
              onClick={() => setAgentMenuOpen(!agentMenuOpen)}
              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <selectedAgent.icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">{selectedAgent.label} Agent</span>
              <ChevronDown className={`w-3 h-3 text-muted-foreground ml-auto transition-transform ${agentMenuOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {agentMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute left-3 right-3 top-full mt-1 glass rounded-lg z-50 py-1 shadow-lg"
                >
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => { setSelectedAgent(agent); setAgentMenuOpen(false); }}
                      className={`flex items-center gap-2.5 w-full px-3 py-2 text-left hover:bg-secondary/50 transition-colors ${
                        selectedAgent.id === agent.id ? "bg-secondary/30" : ""
                      }`}
                    >
                      <agent.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-foreground">{agent.label}</p>
                        <p className="text-[10px] text-muted-foreground">{agent.description}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto hide-scrollbar px-3 py-3 space-y-3">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={msg.role === "user" ? "flex justify-end" : ""}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[85%]">
                    {msg.files && msg.files.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1 justify-end">
                        {msg.files.map((f, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/50 text-muted-foreground flex items-center gap-1">
                            <Paperclip className="w-2 h-2" />{f}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="px-3 py-2 rounded-xl rounded-br-sm bg-secondary text-secondary-foreground text-xs leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-primary" />
                    </div>
                    <p className="text-xs text-foreground/80 leading-relaxed">{msg.content}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Attached files preview */}
          {attachedFiles.length > 0 && (
            <div className="px-3 py-2 border-t border-border/50 flex flex-wrap gap-1.5">
              {attachedFiles.map((file, i) => (
                <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-secondary/50 text-foreground flex items-center gap-1.5">
                  <Paperclip className="w-2.5 h-2.5 text-muted-foreground" />
                  {file.name}
                  <button onClick={() => removeFile(i)} className="hover:text-destructive transition-colors">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Chat input */}
          <div className="px-3 py-2.5 border-t border-border">
            <div className="glass rounded-lg flex items-center gap-2 px-3 py-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors flex-shrink-0"
                title="Attach files"
              >
                <Paperclip className="w-3 h-3" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={`Ask ${selectedAgent.label} agent...`}
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() && attachedFiles.length === 0}
                className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
