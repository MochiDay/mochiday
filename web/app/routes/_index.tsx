import { type MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import Room from "~/components/Room";
import PresenceProvider from "~/presence/presence-context";

export const meta: MetaFunction = () => {
  return [
    { title: "MochiDay" },
    {
      name: "description",
      content: "Reclaim your life.",
    },
  ];
};

export default function Index() {
  return (
    <PresenceProvider
      host="my-remix-app-party.goodluckh.partykit.dev"
      // host="localhost:1998"
      room="home-page"
      presence={{
        cursor: null,
        message: null,
        name: "Anonymous User",
        color: "#0000f0",
      }}
    >
      <Room />
      <div className="h-[100vh] w-full p-10">
        <div className="flex flex-col justify-between h-full">
          <div>
            <h1 className="text-4xl md:text-6xl font-black max-w-4xl">
              Software Engineer jobs, updated every 12 hours.
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold max-w-3xl mt-10">
              We pull jobs from easy-to-apply sites like Lever and Greenhouse so
              that you can submit your resume as soon as possible.
            </h2>
          </div>
          <div className="flex flex-row w-full justify-end">
            <Link to="/dashboard/jobs" prefetch="intent">
              <button className="btn md:btn-lg bg-black text-white mb-10">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </PresenceProvider>
  );
}
