import { useState, useCallback } from "react";
import {
  Type,
  Image,
  Square,
  Columns,
  Minus,
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  MousePointerClick,
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

export type BlockType = "heading" | "text" | "image" | "button" | "divider" | "columns";

export interface EmailBlock {
  id: string;
  type: BlockType;
  content: string;
  props?: Record<string, string>;
}

const blockTypes: { type: BlockType; icon: typeof Type; label: string }[] = [
  { type: "heading", icon: Type, label: "Heading" },
  { type: "text", icon: Type, label: "Text" },
  { type: "image", icon: Image, label: "Image" },
  { type: "button", icon: Square, label: "Button" },
  { type: "divider", icon: Minus, label: "Divider" },
  { type: "columns", icon: Columns, label: "2 Columns" },
];

const defaultContent: Record<BlockType, string> = {
  heading: "Your Heading Here",
  text: "Write your content here. Click to edit this text block.",
  image: "https://placehold.co/600x200/1a1a1a/666?text=Image+Block",
  button: "Click Me",
  divider: "",
  columns: "Column 1 | Column 2",
};

function BlockRenderer({
  block,
  onUpdate,
  onDelete,
}: {
  block: EmailBlock;
  onUpdate: (content: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);

  const renderBlock = () => {
    switch (block.type) {
      case "heading":
        return (
          <h2
            contentEditable={editing}
            suppressContentEditableWarning
            onBlur={(e) => {
              onUpdate(e.currentTarget.textContent || "");
              setEditing(false);
            }}
            onClick={() => setEditing(true)}
            className="text-xl font-bold text-foreground outline-none cursor-text"
          >
            {block.content}
          </h2>
        );
      case "text":
        return (
          <p
            contentEditable={editing}
            suppressContentEditableWarning
            onBlur={(e) => {
              onUpdate(e.currentTarget.textContent || "");
              setEditing(false);
            }}
            onClick={() => setEditing(true)}
            className="text-sm text-foreground/80 leading-relaxed outline-none cursor-text"
          >
            {block.content}
          </p>
        );
      case "image":
        return (
          <div className="rounded-lg overflow-hidden bg-surface-2 flex items-center justify-center h-32">
            <Image className="w-8 h-8 text-muted-foreground/40" />
          </div>
        );
      case "button":
        return (
          <div className="flex justify-center">
            <span
              contentEditable={editing}
              suppressContentEditableWarning
              onBlur={(e) => {
                onUpdate(e.currentTarget.textContent || "");
                setEditing(false);
              }}
              onClick={() => setEditing(true)}
              className="inline-block px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium outline-none cursor-text"
            >
              {block.content}
            </span>
          </div>
        );
      case "divider":
        return <hr className="border-border my-2" />;
      case "columns":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface-2 text-sm text-muted-foreground text-center">Column 1</div>
            <div className="p-4 rounded-lg bg-surface-2 text-sm text-muted-foreground text-center">Column 2</div>
          </div>
        );
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="group relative flex items-start gap-2"
    >
      <div className="flex flex-col items-center gap-0.5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground cursor-grab" />
      </div>
      <div className="flex-1 p-3 rounded-lg border border-transparent group-hover:border-border transition-colors">
        {renderBlock()}
      </div>
      <button
        onClick={onDelete}
        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
      >
        <Trash2 className="w-3 h-3 text-destructive" />
      </button>
    </motion.div>
  );
}

interface EmailBlockEditorProps {
  blocks: EmailBlock[];
  onBlocksChange: (blocks: EmailBlock[]) => void;
}

export function EmailBlockEditor({ blocks, onBlocksChange }: EmailBlockEditorProps) {
  const addBlock = (type: BlockType) => {
    const newBlock: EmailBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      content: defaultContent[type],
    };
    onBlocksChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
    onBlocksChange(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const deleteBlock = (id: string) => {
    onBlocksChange(blocks.filter((b) => b.id !== id));
  };

  return (
    <div className="flex gap-4">
      {/* Block palette */}
      <div className="w-40 shrink-0 space-y-1">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Blocks</span>
        <div className="space-y-1 mt-2">
          {blockTypes.map((bt) => (
            <button
              key={bt.type}
              onClick={() => addBlock(bt.type)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-foreground hover:bg-secondary/50 transition-colors border border-border/50"
            >
              <bt.icon className="w-3.5 h-3.5 text-muted-foreground" />
              {bt.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
          Click to add blocks. Drag to reorder. Click content to edit inline.
        </p>
      </div>

      {/* Canvas */}
      <div className="flex-1 glass rounded-xl p-6 min-h-[400px]">
        {blocks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3">
            <MousePointerClick className="w-8 h-8 text-muted-foreground/30" />
            <div>
              <p className="text-sm text-muted-foreground">Drop blocks here to build your email</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">or use AI to generate a full layout</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {blocks.map((block) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  onUpdate={(content) => updateBlock(block.id, content)}
                  onDelete={() => deleteBlock(block.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
