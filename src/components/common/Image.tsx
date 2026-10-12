"use client";

import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useState } from "react";

const PLACEHOLDER = "/images/placeholder.svg";

function getFileUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/") || url.startsWith("data:")) return url;
  const endpoint = process.env.NEXT_PUBLIC_ERXES_ENDPOINT || "";
  const apiDomain = endpoint.replace(/\/gateway\/graphql$/, "");
  return apiDomain ? `${apiDomain}/read-file?key=${encodeURIComponent(url)}` : url;
}

type ImageProps = Omit<NextImageProps, "src"> & {
  src?: string | null;
  fallback?: string;
};

export default function Image({
  src,
  fallback = PLACEHOLDER,
  alt = "",
  ...props
}: ImageProps) {
  const resolved = getFileUrl(src || "") || fallback;
  // Remember which source failed so a new `src` gets a fresh attempt.
  const [failed, setFailed] = useState<string | null>(null);
  const current = failed === resolved ? fallback : resolved;

  return (
    <NextImage
      {...props}
      // The optimizer rejects SVG unless explicitly allowed; serve it as-is.
      unoptimized={props.unoptimized || current.endsWith(".svg")}
      src={current}
      alt={alt}
      onError={() => setFailed(resolved)}
    />
  );
}
