import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare";
// eslint-disable-next-line import/no-unresolved
import stylesheet from "~/tailwind.css?url";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp } from "@clerk/remix";
import { getToast } from "remix-toast";
import { useEffect, useRef } from "react";
import { Toaster, toast as notify } from "sonner";
import { neobrutalism } from "@clerk/themes";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(args, async ({ request }) => {
    const { toast, headers } = await getToast(request);
    return json({ toast }, { headers });
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="darcula">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

function App() {
  const { toast } = useLoaderData() as {
    toast:
      | {
          message: string;
          type: "error" | "warning" | "success" | "info";
          description?: string | undefined;
        }
      | undefined;
  };

  const navigation = useNavigation();
  const navigationState = useRef(navigation.state);
  const toastId = useRef<string | number | null>(null);

  useEffect(() => {
    navigationState.current = navigation.state;
    if (toastId.current && navigationState.current === "idle") {
      notify.dismiss(toastId.current);
    }
    if (navigationState.current === "loading") {
      const timeout = setTimeout(() => {
        if (navigationState.current === "loading") {
          toastId.current = notify.info("Still loading...", {
            duration: 30000,
            closeButton: true,
          });
        }
        return () => clearTimeout(timeout);
      }, 1000);
    }
  }, [navigation.state]);

  useEffect(() => {
    if (toast?.type === "error") {
      const timeOutId = setTimeout(() => notify.error(toast.message), 1);
      return () => clearTimeout(timeOutId);
    }
    if (toast?.type === "success") {
      const timeOutId = setTimeout(() => notify.success(toast.message), 1);
      return () => clearTimeout(timeOutId);
    }
  }, [toast]);
  return <Outlet />;
}

export default ClerkApp(App, {
  appearance: {
    baseTheme: neobrutalism,
  },
});
