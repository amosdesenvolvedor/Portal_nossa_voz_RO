import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";
import { cn } from "@/lib/utils/cn";

type BrandLogoProps = {
  priority?: boolean;
  className?: string;
  href?: string;
};

export function BrandLogo({ priority = false, className, href = "/" }: BrandLogoProps) {
  const logoImage = (
    <Image
      src={SITE_CONFIG.logo.src}
      alt={SITE_CONFIG.logo.alt}
      width={SITE_CONFIG.logo.width}
      height={SITE_CONFIG.logo.height}
      priority={priority}
      className={cn("h-auto w-full max-w-[180px] md:max-w-[220px]", className)}
      sizes="(max-width: 768px) 180px, 220px"
    />
  );

  if (!href) {
    return logoImage;
  }

  return (
    <Link href={href} aria-label="Ir para a pagina inicial" className="inline-flex no-underline">
      {logoImage}
    </Link>
  );
}
