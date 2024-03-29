/**
 * When adding a new context, refer to the guide here:
 * https://remix.run/docs/en/main/future/vite#cloudflare
 */

import { type AppLoadContext } from "@remix-run/cloudflare";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { type PlatformProxy } from "wrangler";
import { Database } from "~/types/supabase";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    supabase: () => SupabaseClient<Database>;
  }
}

type GetLoadContext = (args: {
  request: Request;
  context: { cloudflare: Cloudflare }; // load context _before_ augmentation
}) => AppLoadContext;

// Shared implementation compatible with Vite, Wrangler, and Cloudflare Pages
export const getLoadContext: GetLoadContext = ({ context }) => {
  return {
    ...context,
    supabase: () =>
      createClient<Database>(
        context.cloudflare.env.SUPABASE_URL,
        context.cloudflare.env.SUPABASE_ANON_KEY
      ),
  };
};
