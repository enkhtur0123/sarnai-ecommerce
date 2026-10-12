import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const erxesHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_ERXES_ENDPOINT ?? "").hostname;
  } catch {
    return "rosekitchen.next.erxes.io";
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The generator folder above has its own lockfile; pin the app root here.
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: erxesHost, pathname: "/**" },
      { protocol: "https", hostname: "*.erxes.io", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    // Design imagery bundled in public/images.
    localPatterns: [{ pathname: "/images/**" }],
  },
};

export default withNextIntl(nextConfig);
