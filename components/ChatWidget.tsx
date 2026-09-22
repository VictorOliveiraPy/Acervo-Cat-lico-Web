"use client";

/**
 * Widget de chat flutuante, disponível em qualquer página (montado uma vez
 * em `app/layout.tsx`) — única forma de conversar com o chatbot do acervo.
 * Existiu uma página dedicada (`/perguntar`), removida a favor deste widget
 * (ver `next.config.js::redirects` pro link antigo).
 *
 * Identidade visual: "Sob a intercessão de São Carlos Acutis", usando o
 * mesmo selo simbólico do rodapé (`SeloCarlosAcutis` — cruz, halo e pixels,
 * SEM retrato, de propósito, pra não virar mascote nem sugerir que é ele
 * "falando"). As respostas continuam em 3ª pessoa, grounded no acervo — o
 * `SYSTEM_PROMPT` do backend proíbe explicitamente fingir ser uma pessoa
 * real, e isso não muda aqui, só o rótulo visual do widget.
 *
 * Estado local (histórico de mensagens) só existe no cliente, por sessão de
 * navegação — cada pergunta já é uma chamada de API independente no
 * backend (sem memória de conversa lá), então perder o histórico ao
 * recarregar a página não perde nenhum contexto real.
 */

import { useEffect, useId, useRef, useState } from "react";

import { perguntarWidgetAction } from "@/components/chatWidgetActions";
import { FonteLink } from "@/components/FonteLink";
import { SeloCarlosAcutis } from "@/components/SeloCarlosAcutis";
import { CHAT_PERGUNTA_MAX, type FonteCitada } from "@/lib/chatSchemas";

type WidgetMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  fontes?: FonteCitada[];
  time: string;
};

function formatTime(): string {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

const WELCOME_MESSAGE: WidgetMessage = {
  id: "welcome",
  role: "bot",
  text: "Olá! Sou o assistente do Compêndio Católico, sob a intercessão de São Carlos Acutis. Pergunte algo sobre fé, doutrina ou vida católica — respondo só com o que está no acervo, e digo quando não encontro nada, em vez de arriscar.",
  time: "",
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<WidgetMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const titleId = useId();

  // Rola pro fim a cada mensagem nova — sem isso, uma resposta longa some
  // fora da área visível e parece que nada aconteceu.
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  // Esc fecha o painel — mesma expectativa de qualquer overlay/diálogo.
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  async function handleSend() {
    const text = input.trim();
    if (!text || pending) return;

    setMessages((prev) => [...prev, { id: newId(), role: "user", text, time: formatTime() }]);
    setInput("");
    setPending(true);
    setError(null);

    const result = await perguntarWidgetAction(text);

    setPending(false);
    if (result.status === "error") {
      setError(result.message);
      return;
    }
    setMessages((prev) => [
      ...prev,
      { id: newId(), role: "bot", text: result.resposta, fontes: result.fontes, time: formatTime() },
    ]);
  }

  return (
    <>
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir assistente do Compêndio Católico"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-bordeaux text-parchment-raised shadow-lg transition-colors hover:bg-bordeaux-soft"
        >
          <SeloCarlosAcutis size={30} className="text-parchment-raised" />
          <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-bordeaux bg-state-ok" />
        </button>
      ) : (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-40 flex flex-col bg-parchment-raised sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(640px,80vh)] sm:w-[380px] sm:rounded-edge sm:border sm:border-rule-faint sm:shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-bordeaux px-4 py-3 text-parchment-raised sm:rounded-t-edge">
            <div className="flex items-center gap-3">
              <SeloCarlosAcutis size={30} className="shrink-0 text-gold-bright" />
              <div>
                <p id={titleId} className="font-display text-title-sm leading-tight">
                  Assistente do Compêndio
                </p>
                <div className="flex items-center gap-1.5 text-meta text-parchment/80">
                  <span className="h-2 w-2 rounded-full bg-state-ok" aria-hidden="true" />
                  Sob a intercessão de São Carlos Acutis
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fechar assistente"
              className="shrink-0 rounded-edge p-1.5 text-parchment-raised/80 hover:bg-bordeaux-soft hover:text-parchment-raised"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Thread */}
          <div
            ref={threadRef}
            aria-live="polite"
            className="flex flex-1 flex-col gap-3 overflow-y-auto bg-parchment px-4 py-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col gap-1 ${message.role === "user" ? "items-end self-end" : "items-start self-start"} max-w-[85%]`}
              >
                <div
                  className={
                    message.role === "user"
                      ? "whitespace-pre-wrap rounded-edge bg-bordeaux px-3 py-2 text-body text-parchment-raised"
                      : "whitespace-pre-wrap rounded-edge border border-rule-faint bg-parchment-raised px-3 py-2 text-body text-ink"
                  }
                >
                  {message.text}
                </div>
                {message.fontes && message.fontes.length > 0 ? (
                  <ul className="flex flex-col gap-0.5 px-1">
                    {message.fontes.map((fonte) => (
                      <li key={`${fonte.categoria}/${fonte.slug}`} className="text-meta">
                        <FonteLink fonte={fonte} />
                      </li>
                    ))}
                  </ul>
                ) : null}
                {message.time ? (
                  <span className="px-1 text-meta text-ink-muted">{message.time}</span>
                ) : null}
              </div>
            ))}
            {pending ? (
              <div className="max-w-[85%] self-start rounded-edge border border-rule-faint bg-parchment-raised px-3 py-2 text-body text-ink-muted">
                Buscando no acervo…
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="border-t border-rule-faint bg-parchment px-4 py-2 text-meta text-state-error">
              {error}
            </p>
          ) : null}

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-rule-faint bg-parchment-raised p-3 sm:rounded-b-edge">
            <label htmlFor={inputId} className="sr-only">
              Sua pergunta
            </label>
            <input
              id={inputId}
              type="text"
              value={input}
              maxLength={CHAT_PERGUNTA_MAX}
              placeholder="Digite sua pergunta…"
              disabled={pending}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
              className="flex-1 rounded-edge border border-rule-faint bg-parchment px-3 py-2 text-body text-ink placeholder:text-ink-muted focus:border-bordeaux focus:outline-none disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={pending || !input.trim()}
              aria-label="Enviar pergunta"
              className="shrink-0 rounded-edge bg-bordeaux p-2.5 text-parchment-raised transition-colors hover:bg-bordeaux-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 20l16-8L4 4v6l10 2-10 2v6z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
