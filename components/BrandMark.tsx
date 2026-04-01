import Image from "next/image";
import { BRAND_LOGO, BRAND_MARK_VARIANTS, type BrandMarkDisplayVariant } from "@/lib/brand";

type BrandMarkProps = {
  alt?: string;
  variant?: BrandMarkDisplayVariant;
  className?: string;
};

export default function BrandMark({
  alt = BRAND_LOGO.alt,
  variant = "compact",
  className = "",
}: BrandMarkProps) {
  const variantStyles = BRAND_MARK_VARIANTS[variant];

  return (
    <span className={["flex items-center", className].filter(Boolean).join(" ")}>
      <span className={["flex items-center", variantStyles.frameClassName].join(" ")}>
        <Image
          src={BRAND_LOGO.src}
          alt={alt}
          width={BRAND_LOGO.width}
          height={BRAND_LOGO.height}
          priority
          className={["block h-auto w-full", variantStyles.imageClassName].filter(Boolean).join(" ")}
        />
      </span>
    </span>
  );
}
