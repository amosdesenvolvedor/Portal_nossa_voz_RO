export type EditorialPresentationImage = {
  src?: string;
  alt?: string;
  caption?: string;
  credit?: string;
};

export type EditorialPresentationTag = {
  label: string;
  href?: string;
};

export type EditorialPresentationMeta = {
  publishedAtLabel: string;
  publishedAtISO?: string;
  municipality?: string;
  author?: string;
};

export type EditorialPresentationLink = {
  href: string;
  label: string;
};