import type { ReactNode } from "react";

export default function CardGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mt-6 grid gap-4 ${className}`.trim()}>{children}</div>;
}
