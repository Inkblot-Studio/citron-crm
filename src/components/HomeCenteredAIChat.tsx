import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Loader2, Mic, Paperclip, Send, Sparkles, X } from 'lucide-react'
import type { CenteredAIChatMessage } from '@citron-systems/citron-ui'

type PendingAttachment = {
  file: File
  kind: 'image' | 'file'
  previewUrl?: string
}

function cn(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(' ')
}

export type HomeCenteredAIChatProps = {
  messages?: CenteredAIChatMessage[]
  onSend?: (payload: { text: string; files: File[] }) => void
  isProcessing?: boolean
  placeholder?: string
  emptyStateMessage?: string
  onVoiceClick?: () => void
  className?: string
}

/**
 * Chat del home con layout pedido: sin panel blanco del hilo, mensajes anclados abajo,
 * input una línea y acciones debajo del input. Usa citron-ui@1.25.0 solo para tipos.
 */
export function HomeCenteredAIChat({
  messages = [],
  onSend,
  isProcessing = false,
  placeholder = 'Ask Citron Intelligence...',
  emptyStateMessage = 'Ask anything — deals, contacts, forecasts...',
  onVoiceClick,
  className,
}: HomeCenteredAIChatProps) {
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<PendingAttachment[]>([])
  const feedRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const attachDisabled = isProcessing

  useEffect(() => {
    const el = feedRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const attachmentsRef = useRef(attachments)
  attachmentsRef.current = attachments

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach((a) => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl)
      })
    }
  }, [])

  const clearAttachments = () => {
    setAttachments((prev) => {
      prev.forEach((a) => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl)
      })
      return []
    })
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const removed = prev[index]
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  const flushSend = (trimmed: string, files: File[]) => {
    try {
      onSend?.({ text: trimmed, files })
    } catch {
      // no romper UI
    }
    clearAttachments()
    setInput('')
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  const handleSend = () => {
    if (isProcessing) return
    const trimmed = input.trim()
    const files = attachments.map((a) => a.file)
    if (!trimmed && files.length === 0) return
    flushSend(trimmed, files)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault()
      return
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length || attachDisabled) {
      e.target.value = ''
      return
    }
    const next: PendingAttachment[] = Array.from(files).map((file) => {
      const isImage = file.type.startsWith('image/')
      return {
        file,
        kind: isImage ? 'image' : 'file',
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      }
    })
    setAttachments((prev) => [...prev, ...next])
    e.target.value = ''
  }

  const trimmedInput = input.trim()
  const hasAttachments = attachments.length > 0
  const canSubmit = !isProcessing && (Boolean(trimmedInput) || hasAttachments)

  const surfaceClass = 'bg-[var(--inkblot-semantic-color-background-primary)]'

  return (
    <div className={cn('flex h-full min-h-0 flex-col', surfaceClass, className)}>
      {messages.length === 0 ? (
        <div className="flex min-h-0 flex-1 items-center justify-center px-[var(--inkblot-spacing-4)]">
          <p className="text-center [font:var(--inkblot-semantic-typography-body-default)] text-[var(--inkblot-semantic-color-text-tertiary)]">
            {emptyStateMessage}
          </p>
        </div>
      ) : (
        <div
          ref={feedRef}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[var(--inkblot-spacing-4)] pt-[var(--inkblot-spacing-4)]"
        >
          <div className="mx-auto mt-auto flex w-full max-w-3xl flex-col gap-[var(--inkblot-spacing-4)] pb-[var(--inkblot-spacing-4)]">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
          </div>
        </div>
      )}

      <div className={cn('shrink-0 px-[var(--inkblot-spacing-4)] py-[var(--inkblot-spacing-3)]', surfaceClass)}>
        <div
          className={cn('mx-auto flex w-full max-w-3xl flex-col gap-[var(--inkblot-spacing-2)]', isProcessing && 'pointer-events-none')}
          aria-busy={isProcessing}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="sr-only"
            aria-hidden
          />

          <div className="flex flex-col overflow-hidden rounded-3xl border border-[var(--inkblot-semantic-color-border-default)] bg-[var(--inkblot-semantic-color-background-secondary)] shadow-[var(--inkblot-shadow-sm)]">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-[var(--inkblot-spacing-2)] border-b border-[var(--inkblot-semantic-color-border-default)] p-[var(--inkblot-spacing-2)]">
                {attachments.map((a, i) => (
                  <div
                    key={`${a.file.name}-${i}`}
                    className="relative flex items-center gap-2 rounded-[var(--inkblot-radius-md)] border border-[var(--inkblot-semantic-color-border-default)] bg-[var(--inkblot-semantic-color-background-primary)] px-2 py-1 pr-7 [font:var(--inkblot-semantic-typography-body-small)] text-[var(--inkblot-semantic-color-text-secondary)]"
                  >
                    {a.previewUrl ? (
                      <img src={a.previewUrl} alt="" className="h-8 w-8 rounded object-cover" />
                    ) : null}
                    <span className="max-w-[10rem] truncate">{a.file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(i)}
                      className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[var(--inkblot-semantic-color-text-tertiary)] hover:bg-[var(--inkblot-semantic-color-background-tertiary)] hover:text-[var(--inkblot-semantic-color-text-primary)]"
                      aria-label="Quitar adjunto"
                    >
                      <X size={14} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              disabled={isProcessing}
              className={cn(
                'h-10 min-h-10 max-h-10 w-full resize-none overflow-x-auto overflow-y-hidden whitespace-nowrap border-0 bg-transparent px-[var(--inkblot-spacing-3)] py-[var(--inkblot-spacing-2)] [font:var(--inkblot-semantic-typography-body-default)] text-[var(--inkblot-semantic-color-text-primary)] placeholder:text-[var(--inkblot-semantic-color-text-tertiary)]',
                'focus:outline-none focus:ring-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-[var(--inkblot-spacing-2)] pt-[var(--inkblot-spacing-1)]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={attachDisabled}
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--inkblot-radius-full)] border border-[var(--inkblot-semantic-color-border-default)] bg-[var(--inkblot-semantic-color-background-primary)] text-[var(--inkblot-semantic-color-text-tertiary)] transition-[background,border-color,color] duration-[var(--inkblot-duration-fast)]',
                'hover:bg-[var(--inkblot-semantic-color-background-tertiary)] hover:text-[var(--inkblot-semantic-color-text-secondary)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--inkblot-semantic-color-border-focus)] focus:ring-offset-2 focus:ring-offset-[var(--inkblot-semantic-color-background-primary)]',
                'disabled:pointer-events-none disabled:opacity-50',
              )}
              aria-label="Adjuntar archivos"
            >
              <Paperclip size={18} strokeWidth={1.7} aria-hidden />
            </button>

            <button
              type="button"
              onClick={() => onVoiceClick?.()}
              disabled={isProcessing}
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--inkblot-radius-full)] border border-[var(--inkblot-semantic-color-border-default)] bg-[var(--inkblot-semantic-color-background-primary)] text-[var(--inkblot-semantic-color-text-tertiary)] transition-[background,border-color,color] duration-[var(--inkblot-duration-fast)]',
                'hover:bg-[var(--inkblot-semantic-color-background-tertiary)] hover:text-[var(--inkblot-semantic-color-text-secondary)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--inkblot-semantic-color-border-focus)] focus:ring-offset-2 focus:ring-offset-[var(--inkblot-semantic-color-background-primary)]',
                'disabled:pointer-events-none disabled:opacity-50',
              )}
              aria-label="Entrada de voz"
            >
              <Mic size={18} strokeWidth={1.7} aria-hidden />
            </button>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              {isProcessing ? (
                <div className="flex h-full w-full items-center justify-center rounded-[var(--inkblot-radius-full)] bg-[var(--inkblot-semantic-color-interactive-primary)]">
                  <Loader2
                    size={16}
                    strokeWidth={2}
                    className="animate-spin text-[var(--inkblot-semantic-color-text-inverse)]"
                    aria-hidden
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSubmit}
                  className={cn(
                    'flex h-full w-full items-center justify-center rounded-[var(--inkblot-radius-full)] bg-[var(--inkblot-semantic-color-interactive-primary)] text-[var(--inkblot-semantic-color-text-inverse)] transition-[background,box-shadow] duration-[var(--inkblot-duration-fast)]',
                    'hover:bg-[var(--inkblot-semantic-color-interactive-secondary-hover)]',
                    'focus:outline-none focus:ring-2 focus:ring-[var(--inkblot-semantic-color-border-focus)] focus:ring-offset-2 focus:ring-offset-[var(--inkblot-semantic-color-background-primary)]',
                    'disabled:pointer-events-none disabled:opacity-40',
                  )}
                  aria-label="Enviar"
                >
                  <Send size={16} strokeWidth={2} aria-hidden />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: CenteredAIChatMessage }) {
  const body = (msg.renderedContent ?? msg.content) as ReactNode
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-[var(--inkblot-radius-xl)] bg-[var(--inkblot-semantic-color-interactive-primary)] px-[var(--inkblot-spacing-4)] py-[var(--inkblot-spacing-3)] [font:var(--inkblot-semantic-typography-body-default)] text-[var(--inkblot-semantic-color-text-inverse)]">
          {body}
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-start gap-[var(--inkblot-spacing-2)]">
      <Sparkles
        size={16}
        strokeWidth={1.7}
        className="mt-[var(--inkblot-spacing-1)] shrink-0 text-[var(--inkblot-semantic-color-text-tertiary)]"
        aria-hidden
      />
      <div className="max-w-[90%] [font:var(--inkblot-semantic-typography-body-default)] text-[var(--inkblot-semantic-color-text-primary)]">{body}</div>
    </div>
  )
}
