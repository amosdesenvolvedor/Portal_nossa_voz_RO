export type EditorialInlineNode =
  | {
      type: "text";
      text: string;
      emphasis?: "strong" | "em";
    }
  | {
      type: "link";
      text: string;
      href: string;
    };

export type EditorialParagraphBlock = {
  type: "paragraph";
  content: EditorialInlineNode[];
};

export type EditorialHeadingBlock = {
  type: "heading";
  level: 2 | 3;
  text: string;
};

export type EditorialListBlock = {
  type: "list";
  style: "unordered" | "ordered";
  items: EditorialInlineNode[][];
};

export type EditorialQuoteBlock = {
  type: "quote";
  text: string;
  citation?: string;
};

export type EditorialContentBlock =
  | EditorialParagraphBlock
  | EditorialHeadingBlock
  | EditorialListBlock
  | EditorialQuoteBlock;