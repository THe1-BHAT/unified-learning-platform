import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL ?? "postgresql://postgres:postgres@127.0.0.1:54322/postgres?schema=public",
  },
});
