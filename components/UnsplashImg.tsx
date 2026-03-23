import type { ImgHTMLAttributes } from "react";
import { buildUnsplashImageSrc } from "@/lib/unsplash";

type UnsplashImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  query?: string | null;
};

export function UnsplashImg({ src, alt, query, width, height, ...props }: UnsplashImgProps) {
  return (
    <img
      {...props}
      src={buildUnsplashImageSrc({
        query,
        src,
        alt: typeof alt === "string" ? alt : undefined,
        width: typeof width === "number" ? width : undefined,
        height: typeof height === "number" ? height : undefined,
      })}
      alt={alt}
      width={width}
      height={height}
    />
  );
}
