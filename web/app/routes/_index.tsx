import { getAuth } from "@clerk/remix/ssr.server";
import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "MochiDay" },
    {
      name: "description",
      content: "Reclaim your life.",
    },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId, sessionClaims } = await getAuth(args);

  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    return redirect("/onboarding");
  }
  return {};
};

export default function Index() {
  return <div>Welcome to MochiDay</div>;
}
