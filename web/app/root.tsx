import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare";
import stylesheet from "~/tailwind.css?url";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp, ClerkErrorBoundary } from "@clerk/remix";
import { dark, neobrutalism } from "@clerk/themes";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader: LoaderFunction = (args) => rootAuthLoader(args);
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
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
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
