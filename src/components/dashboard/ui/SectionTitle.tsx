import clsx from "clsx";

interface SectionTitleProps {
  icon?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ icon, title, subtitle, className }: SectionTitleProps) {
  return (
    <div className={clsx("flex items-start gap-2.5", className)}>
      {icon && (
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-base shadow-sm shadow-blue-300">
          {icon}
        </span>
      )}
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>}
      </div>
    </div>
  );
}
