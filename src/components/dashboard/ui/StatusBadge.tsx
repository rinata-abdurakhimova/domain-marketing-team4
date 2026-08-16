import clsx from "clsx";

interface StatusBadgeProps {
  isEffective: boolean | null;
  className?: string;
}

export function StatusBadge({ isEffective, className }: StatusBadgeProps) {
  if (isEffective === null) {
    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600",
          className
        )}
      >
        ⚪ No data
      </span>
    );
  }
  if (isEffective) {
    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700",
          className
        )}
      >
        🟢 Effective
      </span>
    );
  }
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700",
        className
      )}
    >
      🔴 Ineffective
    </span>
  );
}
