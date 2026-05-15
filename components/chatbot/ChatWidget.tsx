'use client'
import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  })

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl border border-ssuew-gray-200 shadow-[0_8px_40px_rgba(59,174,255,0.22)] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
            <span className="font-bold text-[0.85rem]">Asystent SSUEW</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Zamknij chat" className="text-white/80 hover:text-white text-lg leading-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-48 max-h-80">
            {messages.length === 0 && (
              <p className="text-[0.85rem] text-ssuew-gray-600 text-center mt-4">
                Cześć! Zadaj pytanie o Samorząd Studentów UEW.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-xl px-4 py-2 text-[0.85rem] max-w-[85%] ${
                  m.role === 'user'
                    ? 'bg-primary text-white self-end'
                    : 'bg-ssuew-gray-100 text-ssuew-black self-start'
                }`}
              >
                {m.content}
              </div>
            ))}
            {error && (
              <p className="text-[0.85rem] text-ssuew-gray-600 text-center bg-ssuew-gray-100 rounded-xl px-4 py-2">
                Chatbot niedostępny. Napisz na{' '}
                <a href="mailto:kontakt@samorzad.ue.wroc.pl" className="text-primary underline">
                  kontakt@samorzad.ue.wroc.pl
                </a>
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t border-ssuew-gray-200">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Zadaj pytanie..."
              className="flex-1 px-3 py-2 rounded-lg border border-ssuew-gray-200 text-[0.85rem] text-ssuew-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-white text-[0.85rem] font-bold hover:bg-primary-dark disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {isLoading ? '...' : '→'}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Zamknij chatbota' : 'Otwórz chatbota SSUEW'}
        className="w-14 h-14 rounded-full bg-primary text-white shadow-[0_4px_24px_rgba(59,174,255,0.4)] hover:bg-primary-dark hover:scale-110 transition-all duration-200 flex items-center justify-center text-2xl"
      >
        {open ? '×' : '💬'}
      </button>
    </div>
  )
}
