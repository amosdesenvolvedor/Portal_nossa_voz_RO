import { cn } from "@/lib/utils/cn";

type DividerProps = {
  className?: string;
};

export function Divider({ className }: DividerProps) {
  return <hr aria-hidden className={cn("h-px border-0 bg-border", className)} />;
}