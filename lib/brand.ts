export const BRAND_LOGO = {
  src: "/brand/red-rocks-shuttle.png",
  alt: "Red Rocks Shuttle",
  width: 1000,
  height: 500,
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
    frameClassName: "w-[clamp(180px,44vw,244px)] sm:w-[280px]",
    imageClassName: "",
  },
  footer: {
    frameClassName: "w-[132px] sm:w-[148px]",
    imageClassName: "",
  },
  compact: {
    frameClassName: "w-[96px]",
    imageClassName: "",
  },
  booking: {
    frameClassName: "w-[168px] sm:w-[188px]",
    imageClassName: "",
  },
  email: {
    email: {
      marginBottom: 16,
      frameWidth: 188,
      frameHeight: 94,
      imageWidth: 188,
      imageHeight: 94,
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
    <div style="display:inline-block;width:${frameWidth}px;height:${frameHeight}px;vertical-align:top">
      <img src="${logoUrl}" alt="${alt}" width="${imageWidth}" height="${imageHeight}" style="display:block;width:${imageWidth}px;height:${imageHeight}px;border:0;outline:none;text-decoration:none" />
    </div>
  </div>`;
}
