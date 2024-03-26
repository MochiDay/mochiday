import { z } from "zod";
import { logDevReady } from "@remix-run/cloudflare";
import * as build from "build/server";

const AppEnvSchema = z.object({
  // Clerk Auth
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_SIGN_IN_URL: z.string(),
  CLERK_SIGN_UP_URL: z.string(),
  CLERK_AFTER_SIGN_IN_URL: z.string(),
  CLERK_AFTER_SIGN_UP_URL: z.string(),

  // Supabase
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
});

declare module "@remix-run/cloudflare" {
  interface Cloudflare {
    env: z.output<typeof AppEnvSchema>;
  }
}

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}
