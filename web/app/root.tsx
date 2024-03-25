import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare";
// eslint-disable-next-line import/no-unresolved
import stylesheet from "~/tailwind.css?url";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp, ClerkErrorBoundary } from "@clerk/remix";
import { dark, neobrutalism } from "@clerk/themes";
import { getToast } from "remix-toast";
import { useEffect } from "react";
import { Toaster, toast as notify } from "sonner";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(args, async ({ request }) => {
    const { toast, headers } = await getToast(request);
    // Important to pass in the headers so the toast is cleared properly
    return json({ toast }, { headers });
  });
};

export const ErrorBoundary = ClerkErrorBoundary();

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
        <Toaster richColors />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  const { toast } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (toast?.type === "error") {
      notify.error(toast.message);
    }
    if (toast?.type === "success") {
      notify.success(toast.message);
    }
  }, [toast]);
  return <Outlet />;
}

export default ClerkApp(App, {
  appearance: {
    baseTheme: dark,
    signIn: { baseTheme: neobrutalism },
    signUp: { baseTheme: neobrutalism },
    elements: {
      headerSubtitle: "text-secondary",
      footerActionText: "text-secondary",
    },
  },
});
