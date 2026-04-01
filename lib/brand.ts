export const BRAND_LOGO = {
  src: "/brand/partylogo.png",
  alt: "Party @ Red Rocks",
  width: 160,
  height: 160,
} as const;

type BrandMarkVariantConfig = {
  frameClassName?: string;
  imageClassName?: string;
  email?: {
    marginBottom: number;
    frameWidth: number;
    frameHeight: number;
    imageWidth: number;
    imageHeight: number;
  };
};

export const BRAND_MARK_VARIANTS = {
  nav: {
    frameClassName: "h-14 w-[clamp(160px,50vw,210px)] sm:h-[72px] sm:w-[296px]",
    imageClassName: "h-28 sm:h-36",
  },
  footer: {
    frameClassName: "h-10 w-[156px] sm:h-11 sm:w-[172px]",
    imageClassName: "h-20 sm:h-[88px]",
  },
  compact: {
    frameClassName: "h-8 w-[132px]",
    imageClassName: "h-16",
  },
  booking: {
    frameClassName: "h-10 w-[156px] sm:h-11 sm:w-[172px]",
    imageClassName: "h-20 sm:h-[88px]",
  },
  email: {
    email: {
      marginBottom: 16,
      frameWidth: 172,
      frameHeight: 44,
      imageWidth: 176,
      imageHeight: 88,
    },
  },
} satisfies Record<string, BrandMarkVariantConfig>;

export type BrandMarkVariant = keyof typeof BRAND_MARK_VARIANTS;
export type BrandMarkDisplayVariant = Exclude<BrandMarkVariant, "email">;

export function renderBrandMarkEmailHtml(
  origin: string,
  variant: "email" = "email",
  alt: string = BRAND_LOGO.alt,
) {
  const variantConfig = BRAND_MARK_VARIANTS[variant];
  const { marginBottom, frameWidth, frameHeight, imageWidth, imageHeight } = variantConfig.email;
  const logoUrl = `${origin}${BRAND_LOGO.src}`;

  return `<div style="margin:0 0 ${marginBottom}px;line-height:0">
    <div style="display:inline-block;width:${frameWidth}px;height:${frameHeight}px;overflow:hidden;vertical-align:top">
      <img src="${logoUrl}" alt="${alt}" width="${imageWidth}" height="${BRAND_LOGO.height}" style="display:block;height:${imageHeight}px;width:auto;max-width:none;border:0;outline:none;text-decoration:none" />
    </div>
  </div>`;
}
