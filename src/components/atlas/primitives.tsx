import { useState, type ReactNode } from "react";
import { Check, Copy, AlertTriangle, Loader2, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-foreground sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[14px] text-muted-foreground sm:text-[15px]">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  );
}

export function Panel({ title, description, actions, children, className, bodyClassName }: {
  title?: ReactNode; description?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string;
}) {
  return (
    <section className={cn("surface min-w-0", className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>}
            {description && <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
        </div>
      )}
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function CopyButton({ value, label = "Copy", className, showLabel = false }: { value: string; label?: string; className?: string; showLabel?: boolean }) {
  const [done, setDone] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setDone(false), 1400);
    } catch {
      toast.error("Clipboard access was blocked by the browser");
    }
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
        className,
      )}
    >
      {done ? <Check className="size-3.5 text-success" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {showLabel && <span>{done ? "Copied" : label}</span>}
      <span className="sr-only" aria-live="polite">{done ? "Copied" : ""}</span>
    </button>
  );
}

export function MetadataRow({ label, value, mono = true, copy = true }: { label: string; value?: string | null; mono?: boolean; copy?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-border py-2.5 last:border-0 sm:grid-cols-[150px_1fr] sm:gap-4">
      <dt className="text-[12.5px] text-muted-foreground">{label}</dt>
      <dd className="flex min-w-0 items-center gap-1">
        {value ? (
          <>
            <span className={cn("min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-[13px] text-foreground", mono && "mono")}>{value}</span>
            {copy && <CopyButton value={value} label={`Copy ${label.toLowerCase()}`} />}
          </>
        ) : (
          <span className="text-[13px] text-subtle-foreground">Not supplied</span>
        )}
      </dd>
    </div>
  );
}

export function CodeBlock({ code, title, language, note, className }: { code: string; title?: string; language?: string; note?: string; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-code", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-2 text-[12px] text-muted-foreground">
          {title && <span className="truncate font-medium text-foreground">{title}</span>}
          {language && <span className="mono rounded bg-tertiary px-1.5 py-0.5 text-[11px]">{language}</span>}
          {note && <span className="rounded bg-warning-soft px-1.5 py-0.5 text-[11px] font-medium text-warning">{note}</span>}
        </div>
        <CopyButton value={code} label="Copy code" />
      </div>
      <pre className="mono overflow-x-auto px-4 py-3 text-[12.5px] leading-[1.65] text-code-foreground"><code>{code}</code></pre>
    </div>
  );
}

export function Terminal({ commands, note }: { commands: { cmd: string; comment?: string }[]; note?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-code">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
        </div>
        {note && <span className="rounded bg-warning-soft px-1.5 py-0.5 text-[11px] font-medium text-warning">{note}</span>}
      </div>
      <ul className="divide-y divide-border">
        {commands.map((c) => (
          <li key={c.cmd} className="flex items-center gap-2 px-3 py-2">
            <div className="mono min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-[12.5px]">
              {c.comment && <div className="text-syntax-comment"># {c.comment}</div>}
              <span className="text-subtle-foreground select-none">$ </span>
              <span className="text-syntax-fn">{c.cmd.split(" ")[0]}</span>
              <span className="text-code-foreground"> {c.cmd.split(" ").slice(1).join(" ")}</span>
            </div>
            <CopyButton value={c.cmd} label={`Copy ${c.cmd}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SegmentedControl<T extends string>({ value, onChange, options, label, size = "md" }: {
  value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string; size?: "sm" | "md";
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full overflow-x-auto rounded-lg bg-secondary p-0.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-md font-medium transition-all duration-150",
              size === "sm" ? "px-2.5 py-1 text-[12px]" : "px-3 py-1.5 text-[13px]",
              active ? "bg-card text-foreground shadow-surface" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

type Tone = "neutral" | "success" | "warning" | "error" | "info" | "checking";

const toneDot: Record<Tone, string> = {
  neutral: "bg-subtle-foreground",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
  info: "bg-primary",
  checking: "bg-primary animate-pulse",
};

export function StatusIndicator({ tone, label, className }: { tone: Tone; label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground", className)}>
      <span className={cn("size-2 rounded-full", toneDot[tone])} aria-hidden />
      <span>{label}</span>
    </span>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "error" | "info" }) {
  const t = {
    neutral: "bg-secondary text-muted-foreground",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    error: "bg-destructive-soft text-destructive",
    info: "bg-selected text-selected-foreground",
  }[tone];
  return <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[11.5px] font-medium", t)}>{children}</span>;
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
        <Icon className="size-5" aria-hidden />
      </div>
      <p className="text-[14px] font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ title, message, onRetry }: { title: string; message?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive-soft px-4 py-3">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-medium text-foreground">{title}</p>
        {message && <p className="mt-0.5 text-[13px] text-muted-foreground">{message}</p>}
      </div>
      {onRetry && (
        <button onClick={onRetry} className="shrink-0 rounded-md px-2 py-1 text-[13px] font-medium text-primary hover:bg-card">
          Retry
        </button>
      )}
    </div>
  );
}

export function Notice({ title, children, tone = "neutral" }: { title: string; children?: ReactNode; tone?: "neutral" | "warning" }) {
  return (
    <div className={cn("rounded-lg border px-4 py-3", tone === "warning" ? "border-warning/30 bg-warning-soft" : "border-border bg-secondary")}>
      <p className="text-[13.5px] font-medium text-foreground">{title}</p>
      {children && <div className="mt-0.5 text-[13px] text-muted-foreground">{children}</div>}
    </div>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-2 py-6 text-[13px] text-muted-foreground">
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {label}
    </div>
  );
}

export function FieldLabel({ htmlFor, children, hint }: { htmlFor: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-foreground">{children}</label>
      {hint && <span className="text-[12px] text-muted-foreground">{hint}</span>}
    </div>
  );
}

export const inputClass =
  "h-11 w-full rounded-lg border border-input bg-card px-3 text-[14px] text-foreground shadow-surface placeholder:text-subtle-foreground transition-[border-color,box-shadow] duration-150 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 aria-[invalid=true]:border-destructive";

export const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[14px] font-medium text-primary-foreground shadow-surface transition-colors duration-150 hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-50";

export const btnSecondary =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-[13px] font-medium text-foreground shadow-surface transition-colors duration-150 hover:bg-secondary disabled:pointer-events-none disabled:opacity-50";
