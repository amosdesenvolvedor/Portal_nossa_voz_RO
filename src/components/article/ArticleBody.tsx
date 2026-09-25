import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import type { EditorialContentBlock, EditorialInlineNode } from "@/lib/editorial/article-blocks";
import { EditorialImageCaption } from "@/components/editorial/EditorialImageCaption";

type ArticleBodyProps = {
  blocks: EditorialContentBlock[];
  middleContentAfterBlock?: number;
  middleContent?: ReactNode;
  mediaById?: Record<
    string,
    {
      publicUrl: string;
      altText?: string;
      caption?: string;
      credit?: string;
      origin?: "UPLOADED" | "AI_GENERATED";
    }
  >;
};

function renderInlineNode(node: EditorialInlineNode, index: number) {
  if (node.type === "link") {
    const isExternal = /^https?:\/\//.test(node.href);

    if (isExternal) {
      return (
        <a key={`${node.href}-${index}`} href={node.href} target="_blank" rel="noopener noreferrer">
          {node.text}
        </a>
      );
    }

    return (
      <Link key={`${node.href}-${index}`} href={node.href}>
        {node.text}
      </Link>
    );
  }

  if (node.emphasis === "strong") {
    return <strong key={`${node.text}-${index}`}>{node.text}</strong>;
  }

  if (node.emphasis === "em") {
    return <em key={`${node.text}-${index}`}>{node.text}</em>;
  }

  return <span key={`${node.text}-${index}`}>{node.text}</span>;
}

function renderInlineContent(content: EditorialInlineNode[]) {
  return content.map((node, index) => renderInlineNode(node, index));
}

export function ArticleBody({ blocks, middleContentAfterBlock, middleContent, mediaById }: ArticleBodyProps) {
  return (
    <div className="editorial-body">
      {blocks.map((block, index) => {
        const shouldRenderMiddleContent = middleContent && middleContentAfterBlock === index + 1;

        return (
          <div key={`${block.type}-${index}`}>
            {block.type === "paragraph" ? <p>{renderInlineContent(block.content)}</p> : null}

            {block.type === "heading" && block.level === 2 ? <h2>{block.text}</h2> : null}
            {block.type === "heading" && block.level === 3 ? <h3>{block.text}</h3> : null}

            {block.type === "list" ? (
              block.style === "ordered" ? (
                <ol>
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{renderInlineContent(item)}</li>
                  ))}
                </ol>
              ) : (
                <ul>
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{renderInlineContent(item)}</li>
                  ))}
                </ul>
              )
            ) : null}

            {block.type === "quote" ? (
              <blockquote>
                <p>{block.text}</p>
                {block.citation ? <cite>{block.citation}</cite> : null}
              </blockquote>
            ) : null}

            {block.type === "image" ? (
              (() => {
                const linked = mediaById?.[block.mediaAssetId];
                if (!linked) {
                  return null;
                }

                const resolvedCaption = block.caption || linked.caption;
                const aiLabel = linked.origin === "AI_GENERATED" ? "Ilustração gerada por inteligência artificial." : "";

                return (
                  <figure className="my-6 space-y-2">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-card border border-border bg-surface-secondary">
                      <Image
                        src={linked.publicUrl}
                        alt={block.altText || linked.altText || "Imagem editorial"}
                        fill
                        sizes="(max-width: 768px) 100vw, 760px"
                        className="object-cover"
                      />
                    </div>
                    <EditorialImageCaption
                      caption={[resolvedCaption, aiLabel].filter(Boolean).join(" ") || undefined}
                      credit={block.credit || linked.credit}
                    />
                  </figure>
                );
              })()
            ) : null}

            {shouldRenderMiddleContent ? <div className="my-8">{middleContent}</div> : null}
          </div>
        );
      })}
    </div>
  );
}