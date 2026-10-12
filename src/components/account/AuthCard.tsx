import { Logo } from "@/components/layout/Logo";

export function AuthCard({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-x flex justify-center py-12 sm:py-16">
      <div className="flex w-full max-w-[460px] flex-col gap-6 rounded-[20px] border border-line bg-white p-6 shadow-[0_16px_40px_rgba(43,52,69,0.06)] sm:p-9">
        <Logo />
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.5px]">{title}</h1>
          <p className="m-0 text-[15px] text-muted">{lead}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="m-0 rounded-xl bg-accent-tint px-4 py-3 text-sm font-semibold text-accent-deep">
      {children}
    </p>
  );
}

/** Only same-site paths are allowed as a post-login destination. */
export function safeNext(next: string | null, fallback = "/profile") {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

/** Login payloads are either a bare token string or `{ token, refreshToken }`. */
export function readTokens(raw: unknown): { token?: string; refreshToken?: string } {
  if (typeof raw === "string") return { token: raw };
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    return {
      token: typeof r.token === "string" ? r.token : undefined,
      refreshToken: typeof r.refreshToken === "string" ? r.refreshToken : undefined,
    };
  }
  return {};
}

export function credentialVars(identifier: string, password: string) {
  const id = identifier.trim();
  return id.includes("@") ? { email: id, password } : { phone: id, password };
}
