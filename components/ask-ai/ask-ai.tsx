import DOMPurify from "dompurify";
import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, SubmitEvent } from "react";
import { createPortal } from "react-dom";

import {
  type AskAiAnswerMetadata,
  type AskAiSurveyConfig,
  toAskAiSurveyProperties,
  type FeedbackReason,
} from "../../lib/ask-ai-survey";

interface AskStrings {
  ai: string;
  clear: string;
  close: string;
  copy: string;
  empty: string;
  error: string;
  label: string;
  placeholder: string;
  send: string;
  tip: string;
  title: string;
  you: string;
}

interface FeedbackState {
  comment: string;
  rating: "helpful" | "not-helpful";
  reason: FeedbackReason | null;
  status: "editing" | "error" | "submitted" | "submitting";
}

interface ChatMessage {
  content: string;
  feedback?: FeedbackState;
  id: string;
  metadata?: AskAiAnswerMetadata;
  role: "assistant" | "user";
  status?: "complete" | "error" | "streaming";
  traceId?: string;
}

interface Suggestion {
  icon: string | null;
  label: string;
}

interface AskIcons {
  arrowUp: string;
  chat: string;
  clear: string;
  close: string;
  copy: string;
  thumbsDown: string;
  thumbsUp: string;
}

const EMPTY_ICONS: AskIcons = {
  arrowUp: "",
  chat: "",
  clear: "",
  close: "",
  copy: "",
  thumbsDown: "",
  thumbsUp: "",
};

const DEFAULT_ASK: AskStrings = {
  ai: "AI",
  clear: "Clear conversation",
  close: "Close",
  copy: "Copy conversation",
  empty: "Ask a question about the docs.",
  error: "Sorry, something went wrong.",
  label: "Ask a question",
  placeholder: "Ask a question…",
  send: "Send",
  tip: "Tip: You can open and close chat with",
  title: "Ask AI",
  you: "You",
};

const FEEDBACK_REASONS: { label: string; value: FeedbackReason }[] = [
  { label: "Incorrect", value: "incorrect" },
  { label: "Outdated", value: "outdated" },
  { label: "Incomplete", value: "incomplete" },
  { label: "Unclear", value: "unclear" },
  { label: "Bad or missing citation", value: "bad-citation" },
  { label: "Other", value: "other" },
];

const withTrailingSlash = (base: string): string => (base.endsWith("/") ? base : `${base}/`);
const joinBase = (base: string, path: string): string => `${withTrailingSlash(base)}${path}`;
const prefixBase = (base: string, route: string): string => {
  if (!route.startsWith("/") || route.startsWith("//")) {
    return route;
  }
  const trimmed = base.replace(/\/+$/u, "");
  if (!trimmed || route === trimmed || route.startsWith(`${trimmed}/`)) {
    return route;
  }
  return route === "/" ? trimmed : `${trimmed}${route}`;
};
const stripBase = (base: string, pathname: string): string => {
  const slashed = withTrailingSlash(base);
  if (slashed === "/") {
    return pathname;
  }
  if (pathname.startsWith(slashed)) {
    return `/${pathname.slice(slashed.length)}`;
  }
  return `${pathname}/` === slashed ? "/" : pathname;
};

const DEFAULT_ASK_ENDPOINT = joinBase(import.meta.env.BASE_URL, "api/ask");
const currentPath = (): string => stripBase(import.meta.env.BASE_URL, window.location.pathname);

marked.setOptions({ breaks: true, gfm: true });
marked.use({
  walkTokens: (token) => {
    if (token.type === "link") {
      token.href = prefixBase(import.meta.env.BASE_URL, token.href);
    }
  },
});

const renderMarkdown = (content: string): string => DOMPurify.sanitize(marked.parse(content, { async: false }));

const Glyph = ({ path, size = 16 }: { path: string; size?: number }) => (
  <svg
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: path }}
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  />
);

const EMPTY_SUGGESTIONS: Suggestion[] = [];
const IS_APPLE = typeof navigator !== "undefined" && /mac|iphone|ipad|ipod/iu.test(navigator.platform);
const TRIGGER_CLASS =
  "inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";
const ICON_BUTTON_CLASS =
  "inline-flex size-8 cursor-pointer items-center justify-center rounded-blume text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-pressed:bg-muted aria-pressed:text-foreground disabled:pointer-events-none disabled:opacity-40";
const ANSWER_CLASS =
  "prose prose-sm max-w-none text-foreground [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1 [&_a]:rounded-full [&_a]:bg-muted [&_a]:px-2 [&_a]:py-1 [&_a]:align-middle [&_a]:font-medium [&_a]:text-[0.7rem] [&_a]:leading-none [&_a]:text-muted-foreground! [&_a]:no-underline! [&_a:hover]:text-foreground!";

const newId = (): string => crypto.randomUUID();

interface PostHog {
  capture: (event: string, properties?: Record<string, unknown>) => void;
}

interface PostHogConfig {
  host: string;
  token: string;
}

const posthog = (): PostHog | undefined => (window as Window & { posthog?: PostHog }).posthog;

const capturePostHog = async (
  event: string,
  properties: Record<string, unknown>,
  config?: PostHogConfig,
): Promise<void> => {
  const client = posthog();
  if (client) {
    client.capture(event, properties);
    return;
  }
  if (!config) {
    throw new Error("PostHog is not configured.");
  }
  const response = await fetch(`${config.host.replace(/\/+$/u, "")}/i/v0/e/`, {
    body: JSON.stringify({
      api_key: config.token,
      event,
      properties: {
        ...properties,
        distinct_id: properties.$ai_session_id ? `docs-ask:${properties.$ai_session_id}` : "docs-ask-anonymous",
      },
    }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`PostHog capture failed (${response.status}).`);
  }
};

const AskAI = ({
  endpoint = DEFAULT_ASK_ENDPOINT,
  icons = EMPTY_ICONS,
  posthogConfig,
  strings,
  suggestions = EMPTY_SUGGESTIONS,
  survey,
  posthogEnabled = false,
}: {
  endpoint?: string;
  icons?: AskIcons;
  posthogConfig?: PostHogConfig;
  strings?: AskStrings;
  suggestions?: Suggestion[];
  survey?: AskAiSurveyConfig;
  posthogEnabled?: boolean;
}) => {
  const t = { ...DEFAULT_ASK, ...strings };
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const generationRef = useRef(0);
  const conversationIdRef = useRef<string | null>(null);
  const shownFeedbackRef = useRef(new Set<string>());
  const feedbackSubmissionRef = useRef(new Set<string>());

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handler = (event: Event) => {
      const query = (event as CustomEvent<{ query?: string }>).detail?.query;
      if (query) {
        setInput(query);
      }
      setOpen(true);
    };
    window.addEventListener("blume:open-ask-ai", handler);
    return () => window.removeEventListener("blume:open-ask-ai", handler);
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "i") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape" && open) {
        const target = event.target as HTMLElement | null;
        if (!target?.closest("dialog")) {
          setOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.dataset.blumeAsk = "open";
    } else {
      delete document.body.dataset.blumeAsk;
    }
    if (open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      window.setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      returnFocusRef.current?.focus?.();
    }
    return () => document.body.removeAttribute("data-blume-ask");
  }, [open]);

  useEffect(() => {
    if (open) {
      posthog()?.capture("ask_ai_opened");
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!(open && posthogEnabled && survey)) {
      return;
    }
    for (const message of messages) {
      if (
        message.role !== "assistant" ||
        message.status !== "complete" ||
        !message.metadata ||
        shownFeedbackRef.current.has(message.id)
      ) {
        continue;
      }
      shownFeedbackRef.current.add(message.id);
      const client = posthog();
      if (!client) {
        shownFeedbackRef.current.delete(message.id);
        continue;
      }
      const metadata = message.metadata;
      client.capture("survey shown", {
        $ai_session_id: metadata.conversationId,
        $ai_span_id: message.id,
        $ai_trace_id: metadata.traceId,
        $survey_id: survey.surveyId,
        ai_answer: message.content,
        ai_conversation: metadata.messages,
        ai_input_source: metadata.inputSource,
        ai_latency_ms: metadata.latencyMs,
        ai_page_path: metadata.pagePath,
        ai_time_to_first_token_ms: metadata.timeToFirstTokenMs,
      });
    }
  }, [messages, open, posthogEnabled, survey]);

  const updateMessage = (id: string, update: (message: ChatMessage) => ChatMessage) => {
    setMessages((current) => current.map((message) => (message.id === id ? update(message) : message)));
  };

  const runQuestion = async (raw: string, inputSource: "manual" | "suggestion" = "manual") => {
    const question = raw.trim();
    if (!question || busy) {
      return;
    }

    posthog()?.capture("ask_ai_question_submitted", { input_source: inputSource, page_path: currentPath() });

    conversationIdRef.current ??= newId();
    const conversationId = conversationIdRef.current;
    const userMessage: ChatMessage = { content: question, id: newId(), role: "user" };
    const history = [...messages, userMessage];
    const assistant: ChatMessage = {
      content: "",
      id: newId(),
      role: "assistant",
      status: "streaming",
      traceId: newId(),
    };
    setMessages([...history, assistant]);
    setInput("");
    setBusy(true);
    const generation = generationRef.current;
    const controller = new AbortController();
    abortRef.current = controller;
    const startedAt = performance.now();
    let firstTokenAt: number | null = null;

    try {
      const response = await fetch(endpoint, {
        body: JSON.stringify({
          messages: history.map(({ content, role }) => ({ content, role })),
          page: { path: currentPath() },
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
        signal: controller.signal,
      });
      if (!(response.ok && response.body)) {
        throw new Error(`Ask AI request failed (${response.status}).`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const chunk = await reader.read();
        ({ done } = chunk);
        if (chunk.value) {
          firstTokenAt ??= performance.now();
          assistant.content += decoder.decode(chunk.value, { stream: true });
          if (generationRef.current === generation) {
            updateMessage(assistant.id, () => ({ ...assistant }));
          }
        }
      }
      assistant.content += decoder.decode();
      if (!assistant.content.trim()) {
        throw new Error("Ask AI returned an empty response.");
      }
      assistant.status = "complete";
      if (generationRef.current === generation) {
        updateMessage(assistant.id, () => ({ ...assistant }));
        assistant.metadata = {
          conversationId,
          inputSource,
          latencyMs: performance.now() - startedAt,
          messages: [
            ...history.map(({ content, role }) => ({ content, role })),
            { content: assistant.content, role: "assistant" },
          ],
          pagePath: currentPath(),
          timeToFirstTokenMs: firstTokenAt === null ? null : firstTokenAt - startedAt,
          traceId: assistant.traceId!,
        };
        updateMessage(assistant.id, () => ({ ...assistant }));
      }
    } catch {
      if (generationRef.current === generation) {
        assistant.content = t.error;
        assistant.status = "error";
        updateMessage(assistant.id, () => ({ ...assistant }));
      }
    } finally {
      setBusy(false);
    }
  };

  const submitFeedback = async (
    message: ChatMessage,
    rating: "helpful" | "not-helpful",
    reason: FeedbackReason | null,
    comment: string,
  ) => {
    if (!message.metadata || feedbackSubmissionRef.current.has(message.id)) {
      return;
    }
    feedbackSubmissionRef.current.add(message.id);
    const metadata = message.metadata;
    updateMessage(message.id, (current) => ({
      ...current,
      feedback: { comment, rating, reason, status: "submitting" },
    }));
    try {
      if (survey) {
        await capturePostHog(
          "survey sent",
          toAskAiSurveyProperties({
            answer: message.content,
            answerId: message.id,
            comment,
            metadata,
            rating,
            reason,
            submissionId: newId(),
            survey,
          }),
          posthogConfig,
        );
      } else {
        await capturePostHog(
          "ask_ai_feedback_submitted",
          {
            ai_answer: message.content,
            ai_answer_id: message.id,
            ai_conversation: metadata.messages,
            ai_input_source: metadata.inputSource,
            ai_latency_ms: metadata.latencyMs,
            ai_page_path: metadata.pagePath,
            ai_question: metadata.messages.filter(({ role }) => role === "user").at(-1)?.content,
            ai_time_to_first_token_ms: metadata.timeToFirstTokenMs,
            feedback_comment: comment.trim() || undefined,
            feedback_rating: rating,
            feedback_reason: reason ?? undefined,
            trace_id: metadata.traceId,
          },
          posthogConfig,
        );
      }
      updateMessage(message.id, (current) => ({
        ...current,
        feedback: { comment, rating, reason, status: "submitted" },
      }));
    } catch {
      feedbackSubmissionRef.current.delete(message.id);
      updateMessage(message.id, (current) => ({
        ...current,
        feedback: { comment, rating, reason, status: "error" },
      }));
    }
  };

  const clearConversation = () => {
    generationRef.current += 1;
    abortRef.current?.abort();
    conversationIdRef.current = null;
    shownFeedbackRef.current.clear();
    feedbackSubmissionRef.current.clear();
    setMessages([]);
  };

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runQuestion(input);
  };

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void runQuestion(input);
    }
  };

  const copyConversation = async () => {
    const text = messages
      .map((message) => `${message.role === "user" ? t.you : t.ai}: ${message.content}`)
      .join("\n\n");
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API unavailable.");
      }
      await navigator.clipboard.writeText(text);
      setCopyStatus("Conversation copied.");
    } catch {
      setCopyStatus("Could not copy conversation.");
    }
  };

  const feedbackControls = (message: ChatMessage) => {
    if (message.status !== "complete") {
      return null;
    }
    const feedback = message.feedback;
    if (feedback?.status === "submitted") {
      return (
        <p className="mt-2 text-muted-foreground text-xs" role="status">
          Thanks for the feedback.
        </p>
      );
    }
    const editing = feedback?.rating === "not-helpful";
    return (
      <div className="mt-2 border-border border-t pt-2 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="me-1 text-muted-foreground text-xs">Was this helpful?</span>
          <button
            aria-label="Helpful answer"
            aria-pressed={feedback?.rating === "helpful"}
            className={ICON_BUTTON_CLASS}
            disabled={feedback?.status === "submitting"}
            onClick={() => void submitFeedback(message, "helpful", null, "")}
            type="button"
          >
            <Glyph path={icons.thumbsUp} />
          </button>
          <button
            aria-label="Not helpful"
            aria-pressed={editing}
            className={ICON_BUTTON_CLASS}
            disabled={feedback?.status === "submitting"}
            onClick={() =>
              updateMessage(message.id, (current) => ({
                ...current,
                feedback: {
                  comment: current.feedback?.comment ?? "",
                  rating: "not-helpful",
                  reason: current.feedback?.reason ?? "incorrect",
                  status: "editing",
                },
              }))
            }
            type="button"
          >
            <Glyph path={icons.thumbsDown} />
          </button>
        </div>
        {editing && (
          <form
            className="mt-3 flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (feedback.reason) {
                void submitFeedback(message, "not-helpful", feedback.reason, feedback.comment);
              }
            }}
          >
            <fieldset className="flex flex-wrap gap-2">
              <legend className="mb-2 w-full text-foreground text-xs">What could be improved?</legend>
              {FEEDBACK_REASONS.map((reason) => (
                <label
                  className="cursor-pointer rounded-full border border-border px-2.5 py-1 text-xs has-[:checked]:border-foreground has-[:checked]:bg-muted has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
                  key={reason.value}
                >
                  <input
                    checked={feedback.reason === reason.value}
                    className="sr-only"
                    name={`feedback-reason-${message.id}`}
                    onChange={() =>
                      updateMessage(message.id, (current) => ({
                        ...current,
                        feedback: { ...current.feedback!, reason: reason.value, status: "editing" },
                      }))
                    }
                    type="radio"
                    value={reason.value}
                  />
                  {reason.label}
                </label>
              ))}
            </fieldset>
            <label className="flex flex-col gap-1.5 text-foreground text-xs">
              Additional details (optional)
              <textarea
                className="min-h-20 resize-y rounded-blume border border-border bg-transparent px-3 py-2 text-foreground outline-none focus:border-foreground"
                maxLength={500}
                onChange={(event) =>
                  updateMessage(message.id, (current) => ({
                    ...current,
                    feedback: { ...current.feedback!, comment: event.target.value, status: "editing" },
                  }))
                }
                onKeyDown={(event) => {
                  if (IS_APPLE && event.metaKey && event.key === "Enter" && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Do not include secrets or personal data."
                value={feedback.comment}
              />
            </label>
            <div className="flex items-center gap-2">
              <button
                className="rounded-blume bg-foreground px-3 py-1.5 font-medium text-background text-xs disabled:opacity-40"
                disabled={!feedback.reason || feedback.status === "submitting"}
                type="submit"
              >
                {feedback.status === "submitting" ? "Sending…" : "Send feedback"}
              </button>
              {feedback.status === "error" && (
                <span className="text-destructive text-xs" role="status">
                  Feedback unavailable. PostHog is not initialized.
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    );
  };

  const hasMessages = messages.length > 0;
  const panel = (
    <aside
      aria-hidden={open ? undefined : "true"}
      aria-label={t.title}
      className={`fixed inset-y-0 end-0 z-[60] flex w-[var(--blume-ask-width)] flex-col border-border border-s bg-background shadow-2xl transition-transform duration-200 ease-out ${open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"}`}
      data-blume-ask-panel
      id="blume-ask-panel"
      inert={!open}
    >
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-border border-b px-4">
        <span className="font-semibold text-foreground">{t.title}</span>
        <div className="flex items-center gap-0.5">
          <button
            aria-label={t.copy}
            className={ICON_BUTTON_CLASS}
            disabled={!hasMessages}
            onClick={() => void copyConversation()}
            type="button"
          >
            <Glyph path={icons.copy} />
          </button>
          <button
            aria-label={t.clear}
            className={ICON_BUTTON_CLASS}
            disabled={!hasMessages}
            onClick={clearConversation}
            type="button"
          >
            <Glyph path={icons.clear} />
          </button>
          <button aria-label={t.close} className={ICON_BUTTON_CLASS} onClick={() => setOpen(false)} type="button">
            <Glyph path={icons.close} size={18} />
          </button>
        </div>
      </header>
      <p className="sr-only" role="status">
        {copyStatus}
      </p>

      <div
        aria-busy={busy}
        aria-live="polite"
        className="flex flex-1 flex-col overflow-y-auto"
        ref={scrollRef}
        role="log"
      >
        {hasMessages ? (
          <div className="flex flex-col gap-4 p-4">
            {messages.map((message) =>
              message.role === "user" ? (
                <div
                  className="max-w-[85%] self-end whitespace-pre-wrap rounded-blume bg-muted px-3 py-2 text-foreground text-sm"
                  key={message.id}
                >
                  {message.content}
                </div>
              ) : (
                <div key={message.id}>
                  <div className={ANSWER_CLASS}>
                    {message.content ? (
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
                    ) : (
                      <span className="animate-pulse text-muted-foreground">…</span>
                    )}
                  </div>
                  {feedbackControls(message)}
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="mt-auto flex flex-col gap-0.5 p-4">
            {suggestions.length === 0 && <p className="px-2 text-muted-foreground text-sm">{t.empty}</p>}
            {suggestions.map((suggestion) => (
              <button
                className="flex cursor-pointer items-center gap-2.5 rounded-blume px-2 py-2 text-start text-foreground text-sm transition-colors hover:bg-muted"
                key={suggestion.label}
                onClick={() => void runQuestion(suggestion.label, "suggestion")}
                type="button"
              >
                {suggestion.icon && (
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-muted-foreground [&_svg]:size-[18px]"
                    dangerouslySetInnerHTML={{ __html: suggestion.icon }}
                  />
                )}
                <span>{suggestion.label}</span>
              </button>
            ))}
            <p className="mt-3 flex items-center gap-1.5 px-2 text-muted-foreground text-sm">
              {t.tip}
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-xs">
                {IS_APPLE ? "⌘" : "Ctrl"}
              </kbd>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-xs">I</kbd>
            </p>
          </div>
        )}
      </div>

      <form className="relative shrink-0 border-border border-t" onSubmit={onSubmit}>
        <textarea
          aria-label={t.label}
          autoComplete="off"
          className="max-h-48 min-h-[5rem] w-full resize-none bg-transparent px-4 py-3.5 pe-14 text-foreground text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring pointer-coarse:text-base"
          name="question"
          maxLength={4000}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder={t.placeholder}
          ref={inputRef}
          rows={3}
          value={input}
        />
        <button
          aria-label={t.send}
          className="absolute end-3 bottom-3 inline-flex size-8 cursor-pointer items-center justify-center rounded-blume bg-foreground text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          disabled={busy || input.trim().length === 0}
          type="submit"
        >
          <Glyph path={icons.arrowUp} />
        </button>
      </form>
      {posthogEnabled && (
        <p className="shrink-0 border-border border-t px-4 py-2 text-[0.7rem] text-muted-foreground">
          Questions and answers are logged to improve the documentation. Do not include passwords, API keys, tokens,
          personal data, or other secrets.
        </p>
      )}
    </aside>
  );

  return (
    <>
      <button
        aria-controls="blume-ask-panel"
        aria-expanded={open}
        aria-label={t.title}
        className={TRIGGER_CLASS}
        onClick={() => setOpen((value) => !value)}
        ref={triggerRef}
        type="button"
      >
        <Glyph path={icons.chat} size={18} />
      </button>
      {mounted && createPortal(panel, document.body)}
    </>
  );
};

export default AskAI;
