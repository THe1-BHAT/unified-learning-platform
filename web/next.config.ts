import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const nextDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(nextDir, ".."),
  outputFileTracingIncludes: {
    "/studio/*": ["../app/dist/**/*"],
  },
};

export default nextConfig;
