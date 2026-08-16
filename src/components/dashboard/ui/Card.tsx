import type { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function Card({ title, subtitle, children, className, action }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-md shadow-blue-200/40 backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-blue-200/50",
        className
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-sm font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-slate-600">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
