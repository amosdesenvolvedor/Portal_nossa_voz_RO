import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { EditorialPresentationTag } from "@/lib/editorial/presentation";

type EditorialTagListProps = {
  tags: EditorialPresentationTag[];
};

export function EditorialTagList({ tags }: EditorialTagListProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tags editoriais">
      {tags.map((tag) => (
        <li key={`${tag.label}-${tag.href ?? "static"}`}>
          {tag.href ? (
            <Link href={tag.href} className="no-underline">
              <Badge variant="tag">{tag.label}</Badge>
            </Link>
          ) : (
            <Badge variant="tag">{tag.label}</Badge>
          )}
        </li>
      ))}
    </ul>
  );
}