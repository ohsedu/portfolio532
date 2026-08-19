"use client";

import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";

import { useDictionary } from "@/components/layout/dictionary-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

/** Tab order, and therefore the order errors are reported in. */
const fieldOrder = ["name", "email", "message"] as const;

/**
 * Deliberately permissive. The only authority on whether an address exists is
 * the mail server, so this catches typos ("me@", "me.com") and nothing more —
 * a stricter regex rejects valid addresses far more often than it helps.
 */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
 * `fg-muted`, not `fg-subtle`: a field label is the input's only visible name,
 * so it has to clear 4.5:1 (SC 1.4.3). `fg-subtle` sits nearer 3.4:1 and is
 * kept for genuinely decorative captions.
 */
const labelClasses =
  "text-fg-muted mb-2 block font-mono text-[11.5px] tracking-[0.14em] uppercase";

/** Sizing is added per control; `h-12` / `min-h-32` clear the 44px touch floor. */
const controlClasses =
  "bg-surface text-fg placeholder:text-fg-muted focus-visible:outline-ring w-full rounded-xl border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

/** Invalid controls are tinted as well as marked, so the state survives a glance. */
function controlTone(invalid: boolean) {
  return invalid
    ? "border-line-strong bg-brand-soft/30"
    : "border-line hover:border-line-strong";
}

/**
 * The contact form, with no server behind it.
 *
 * Two modes, decided by `endpoint`:
 *   - set    → POST the fields as JSON and report what came back.
 *   - `null` → build a prefilled `mailto:` and hand off to the mail client.
 *              Faking a "sent" state instead would quietly lose messages.
 *
 * Fields are uncontrolled and read out of `FormData` on submit. Nothing here
 * needs to re-render while someone types, and it makes "validate on submit, not
 * on every keystroke" the shape of the code rather than a rule to remember.
 */
export function ContactForm({
  endpoint,
  recipient,
  className,
}: {
  /** POST target, from `contactEndpoint`. `null` enables the mailto fallback. */
  endpoint: string | null;
  /** Address the mailto fallback is addressed to. */
  recipient: string;
  className?: string;
}) {
  const dict = useDictionary();
  const copy = dict.contact.form;

  // One id root, so ids stay unique even if this form is mounted twice.
  const uid = useId();
  const fieldId = (field: FieldName) => `${uid}-${field}`;
  const errorId = (field: FieldName) => `${uid}-${field}-error`;
  const fallbackId = `${uid}-fallback`;

  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  // Focus has to land on the element itself, so keep a handle on each control
  // rather than querying the DOM back out after validating.
  const controls = useRef<Record<FieldName, HTMLElement | null>>({
    name: null,
    email: null,
    message: null,
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    /* The submit button stays focusable while sending, so re-entry is blocked
       here instead of by the `disabled` attribute. */
    if (submitting) return;

    // `currentTarget` is nulled out once the browser finishes dispatching the
    // event, so it has to be captured before the first `await`.
    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    const values: Record<FieldName, string> = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    const found: FieldErrors = {};
    for (const field of fieldOrder) {
      if (!values[field]) found[field] = copy.required;
    }
    if (!found.email && !emailPattern.test(values.email)) {
      found.email = copy.invalidEmail;
    }

    setErrors(found);

    const firstInvalid = fieldOrder.find((field) => found[field]);
    if (firstInvalid) {
      // Naming the problem is not enough — put the caret where the fix is.
      controls.current[firstInvalid]?.focus();
      setStatus("idle");
      return;
    }

    if (!endpoint) {
      // Labels come from the dictionary so the draft opens in the language the
      // sender was reading. Both halves are encoded: a bare `&`, `#` or newline
      // in the message silently truncates the body in most mail clients.
      const subject = encodeURIComponent(
        `${dict.contact.heading} — ${values.name}`,
      );
      const body = encodeURIComponent(
        `${values.message}\n\n${copy.name}: ${values.name}\n${copy.email}: ${values.email}`,
      );
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error(`Contact endpoint responded ${response.status}`);
      }
      setStatus("success");
      formElement.reset();
    } catch {
      // Leave the fields filled in: the error copy points at the email address,
      // and nobody should have to retype a message because of our outage.
      setStatus("error");
    }
  }

  const submitting = status === "submitting";

  return (
    <form
      // Our messages are localized and stay on screen; the browser's native
      // bubbles are neither, and they pre-empt this handler entirely.
      noValidate
      onSubmit={onSubmit}
      aria-label={dict.contact.heading}
      className={cn("flex flex-col gap-5", className)}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("name")} className={labelClasses}>
            {copy.name}
          </label>
          <input
            ref={(node) => {
              controls.current.name = node;
            }}
            id={fieldId("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={copy.namePlaceholder}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? errorId("name") : undefined}
            className={cn(controlClasses, "h-12", controlTone(Boolean(errors.name)))}
          />
          <FieldError id={errorId("name")} message={errors.name} />
        </div>

        <div>
          <label htmlFor={fieldId("email")} className={labelClasses}>
            {copy.email}
          </label>
          <input
            ref={(node) => {
              controls.current.email = node;
            }}
            id={fieldId("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={copy.emailPlaceholder}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? errorId("email") : undefined}
            className={cn(controlClasses, "h-12", controlTone(Boolean(errors.email)))}
          />
          <FieldError id={errorId("email")} message={errors.email} />
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("message")} className={labelClasses}>
          {copy.message}
        </label>
        <textarea
          ref={(node) => {
            controls.current.message = node;
          }}
          id={fieldId("message")}
          name="message"
          rows={6}
          required
          placeholder={copy.messagePlaceholder}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? errorId("message") : undefined}
          className={cn(
            controlClasses,
            "min-h-32 resize-y py-3 leading-relaxed",
            controlTone(Boolean(errors.message)),
          )}
        />
        <FieldError id={errorId("message")} message={errors.message} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        {/*
          `aria-disabled` rather than `disabled`: the browser pulls focus off a
          disabled element, which would drop a keyboard user onto <body> at the
          exact moment a failure needs reading. The guard at the top of
          `onSubmit` is what actually blocks a second submit.
        */}
        <Button
          type="submit"
          size="lg"
          aria-disabled={submitting}
          aria-describedby={endpoint ? undefined : fallbackId}
        >
          {submitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              {copy.submitting}
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden />
              {copy.submit}
            </>
          )}
        </Button>

        {/* Warns before the click that a mail client is about to take over. */}
        {endpoint ? null : (
          <p id={fallbackId} className="text-fg-subtle max-w-[16rem] text-xs">
            {copy.mailtoFallback}
          </p>
        )}
      </div>

      {/*
        Always in the DOM, even while empty: a live region inserted in the same
        commit as its text is not reliably announced. `empty:hidden` keeps it
        from reserving space until there is something to say.
      */}
      <p
        role="status"
        aria-live="polite"
        className="text-fg-muted flex items-center gap-2 text-sm empty:hidden"
      >
        {status === "success" ? (
          <>
            <CircleCheck
              className="text-brand-accent size-4 shrink-0"
              aria-hidden
            />
            {copy.success}
          </>
        ) : status === "error" ? (
          <>
            <CircleAlert
              className="text-brand-accent size-4 shrink-0"
              aria-hidden
            />
            {copy.error}
          </>
        ) : null}
      </p>
    </form>
  );
}

/**
 * Per-field message, tied to its control by `aria-describedby`.
 *
 * The token palette has no danger colour, so the icon only draws the eye — the
 * text carries the meaning, which is also all a screen reader gets.
 */
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p
      id={id}
      className="text-fg mt-2 flex items-center gap-1.5 text-xs font-medium"
    >
      <CircleAlert className="text-brand-accent size-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}
