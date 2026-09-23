import { cn } from "@/lib/utils/cn";

type EditorialBylineProps = {
  author: string;
  role?: string;
  className?: string;
};

export function EditorialByline({ author, role, className }: EditorialBylineProps) {
  return (
    <p className={cn("text-caption text-text-muted", className)}>
      Por <span className="font-semibold text-text">{author}</span>
      {role ? <span> • {role}</span> : null}
    </p>
  );
}