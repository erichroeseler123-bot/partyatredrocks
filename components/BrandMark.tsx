import { BRAND_LOGO, BRAND_MARK_VARIANTS, type BrandMarkDisplayVariant } from "@/lib/brand";

type BrandMarkProps = {
  alt?: string;
  variant?: BrandMarkDisplayVariant;
  className?: string;
};

const SCANNED_FRAME_CLASSES: Record<BrandMarkDisplayVariant, string> = {
  nav: "w-[78px] min-[360px]:w-[88px] sm:w-[116px] lg:w-[138px]",
  footer: "w-[120px] sm:w-[144px]",
  compact: "w-[92px]",
  booking: "w-[152px] sm:w-[180px]",
};

export default function BrandMark({
  alt = BRAND_LOGO.alt,
  variant = "compact",
  className = "",
}: BrandMarkProps) {
  const variantStyles = BRAND_MARK_VARIANTS[variant];
  const widthClass = SCANNED_FRAME_CLASSES[variant] || "w-[112px]";

  return (
    <span className={["flex items-center", className].filter(Boolean).join(" ")}>
      <span className={["flex items-center", widthClass].join(" ")}>
        <img
          src={BRAND_LOGO.displaySrc}
          alt={alt}
          width={BRAND_LOGO.width}
          height={BRAND_LOGO.height}
          loading="eager"
          decoding="async"
          className={["block h-auto w-full", variantStyles.imageClassName].filter(Boolean).join(" ")}
        />
      </span>
    </span>
  );
}
