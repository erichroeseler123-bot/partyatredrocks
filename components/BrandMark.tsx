import Image from "next/image";
import type { ReactNode } from "react";

type BrandMarkProps = {
  href?: string;
  alt?: string;
  frameClassName?: string;
  imageClassName?: string;
  className?: string;
  children?: ReactNode;
};

export default function BrandMark({
  alt = "Party @ Red Rocks",
  frameClassName = "h-8 w-[132px] sm:h-9 sm:w-[148px]",
  imageClassName = "h-16 sm:h-[72px]",
  className = "",
}: BrandMarkProps) {
  return (
    <span className={["flex items-center", className].filter(Boolean).join(" ")}>
      <span className={["flex items-start overflow-hidden", frameClassName].join(" ")}>
        <Image
          src="/brand/partylogo.png"
          alt={alt}
          width={160}
          height={160}
          priority
          className={["block w-auto max-w-none", imageClassName].join(" ")}
        />
      </span>
    </span>
  );
}
