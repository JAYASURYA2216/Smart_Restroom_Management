import { cn } from "../../lib/cn";
import type { ReactNode } from "react";

type GlassCardProps = {
  className?: string;
  children: ReactNode;
};

export function GlassCard({ className, children }: GlassCardProps) {
  return (
    <section className={cn("glass rounded-2xl p-5 relative overflow-hidden", className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(800px circle at 10% 10%, rgba(56,189,248,0.12), transparent 55%), radial-gradient(600px circle at 90% 30%, rgba(16,185,129,0.10), transparent 50%)",
        }}
      />
      <div className="relative">{children}</div>
    </section>
  );
}

